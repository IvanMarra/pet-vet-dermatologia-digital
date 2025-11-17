import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_DIMENSION = 600;
const TARGET_FILE_SIZE = 200 * 1024;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Verify admin access
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('Starting reprocessing of gallery images...');

    // Get all images from pet_gallery_images
    const { data: images, error: imagesError } = await supabaseAdmin
      .from('pet_gallery_images')
      .select('*')
      .order('created_at', { ascending: true });

    if (imagesError) throw imagesError;

    console.log(`Found ${images?.length || 0} images to process`);

    const results = {
      total: images?.length || 0,
      processed: 0,
      skipped: 0,
      errors: 0,
      details: [] as any[]
    };

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    for (const image of images || []) {
      try {
        console.log(`Processing image ${image.id}: ${image.image_url}`);

        // Download the existing image
        const imageResponse = await fetch(image.image_url);
        if (!imageResponse.ok) {
          throw new Error(`Failed to download image: ${imageResponse.status}`);
        }

        const imageBlob = await imageResponse.blob();
        const arrayBuffer = await imageBlob.arrayBuffer();
        
        // Check file size - if already small, skip
        if (arrayBuffer.byteLength < TARGET_FILE_SIZE) {
          console.log(`Image ${image.id} is already optimized (${arrayBuffer.byteLength} bytes), skipping`);
          results.skipped++;
          results.details.push({
            id: image.id,
            status: 'skipped',
            reason: 'Already optimized',
            originalSize: arrayBuffer.byteLength
          });
          continue;
        }

        // Convert to base64
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        const imageDataUrl = `data:image/jpeg;base64,${base64}`;

        console.log(`Sending to AI for optimization (original: ${arrayBuffer.byteLength} bytes)...`);

        // Process with AI
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image-preview',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `Optimize this pet photo by:
1. Resize to maximum ${MAX_DIMENSION}px on the longest side (maintain aspect ratio, do NOT crop)
2. Add a subtle watermark "Popular Vet" in bottom right (semi-transparent)
3. Compress heavily to JPEG quality 70% - final file MUST be under ${TARGET_FILE_SIZE / 1024}KB
4. Return as optimized JPEG format
CRITICAL: The output file size MUST be under 200KB. Prioritize small file size over quality.`
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: imageDataUrl
                    }
                  }
                ]
              }
            ],
            modalities: ['image', 'text']
          })
        });

        if (!aiResponse.ok) {
          throw new Error(`AI processing failed: ${aiResponse.status}`);
        }

        const aiData = await aiResponse.json();
        const optimizedImageUrl = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!optimizedImageUrl) {
          throw new Error('No image returned from AI processing');
        }

        // Decode optimized image
        const optimizedBase64 = optimizedImageUrl.split(',')[1];
        const binaryString = atob(optimizedBase64);
        const optimizedBuffer = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          optimizedBuffer[i] = binaryString.charCodeAt(i);
        }

        console.log(`AI processed successfully (new size: ${optimizedBuffer.length} bytes)`);

        // Upload to storage with a new name
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 9);
        const fileName = `optimized-${timestamp}-${randomStr}.jpg`;

        const { data: uploadData, error: uploadError } = await supabaseAdmin
          .storage
          .from('pet-gallery')
          .upload(fileName, optimizedBuffer, {
            contentType: 'image/jpeg',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabaseAdmin
          .storage
          .from('pet-gallery')
          .getPublicUrl(fileName);

        // Update the database record
        const { error: updateError } = await supabaseAdmin
          .from('pet_gallery_images')
          .update({ image_url: publicUrl })
          .eq('id', image.id);

        if (updateError) throw updateError;

        // Delete old image from storage (extract filename from URL)
        const oldFileName = image.image_url.split('/').pop();
        if (oldFileName) {
          await supabaseAdmin.storage.from('pet-gallery').remove([oldFileName]);
        }

        results.processed++;
        results.details.push({
          id: image.id,
          status: 'success',
          originalSize: arrayBuffer.byteLength,
          newSize: optimizedBuffer.length,
          newUrl: publicUrl
        });

        console.log(`Successfully processed image ${image.id}`);

      } catch (error: any) {
        console.error(`Error processing image ${image.id}:`, error.message);
        results.errors++;
        results.details.push({
          id: image.id,
          status: 'error',
          error: error.message
        });
      }
    }

    console.log('Reprocessing completed:', results);

    return new Response(
      JSON.stringify({
        success: true,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in reprocess-gallery-images function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
