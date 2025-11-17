import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TARGET_SIZE = 800;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
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

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      throw new Error('No file provided');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 10MB limit');
    }

    console.log(`Processing image: ${file.name}, size: ${file.size} bytes`);

    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const imageDataUrl = `data:${file.type};base64,${base64}`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Processing with AI for watermark and optimization...');
    
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
1. Resize it to exactly ${TARGET_SIZE}x${TARGET_SIZE} pixels (square crop, maintaining the pet as the focal point)
2. Add a subtle watermark with the text "Popular Vet" in the bottom right corner (semi-transparent, professional looking)
3. Enhance image quality and reduce file size
Return the optimized image.`
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
      const errorText = await aiResponse.text();
      console.error('AI API error:', errorText);
      throw new Error(`AI processing failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const optimizedImageUrl = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!optimizedImageUrl) {
      throw new Error('No image returned from AI processing');
    }

    console.log('Image processed successfully by AI');

    const optimizedBase64 = optimizedImageUrl.split(',')[1];
    const optimizedBuffer = Uint8Array.from(atob(optimizedBase64), c => c.charCodeAt(0));

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    const fileName = `${timestamp}-${randomStr}.jpg`;

    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('pet-gallery')
      .upload(fileName, optimizedBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('pet-gallery')
      .getPublicUrl(fileName);

    console.log('Image uploaded successfully:', publicUrl);

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: publicUrl,
        fileName: fileName,
        originalSize: file.size,
        optimizedSize: optimizedBuffer.length,
        message: 'Image optimized, watermarked, and uploaded successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in optimize-image function:', error);
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
