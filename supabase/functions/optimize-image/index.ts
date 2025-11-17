import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Get authorization token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      throw new Error('No file provided');
    }

    console.log(`Processing image: ${file.name}, size: ${file.size} bytes`);

    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Simple validation - just pass through the image
    // Note: Complex image processing with subprocesses is not supported in Edge Runtime
    // For production, consider using client-side compression or a separate image processing service
    console.log('Image received successfully');

    // Generate unique filename - preserve original extension
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    const extension = file.name.split('.').pop() || 'jpg';
    const fileName = `${timestamp}-${randomStr}.${extension}`;

    // Upload image directly to storage
    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from('pet-gallery')
      .upload(fileName, arrayBuffer, {
        contentType: file.type || 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseClient
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
        optimizedSize: file.size,
        message: 'Image uploaded successfully. For best results, compress images before uploading.'
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
