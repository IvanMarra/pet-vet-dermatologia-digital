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
    const uint8Array = new Uint8Array(arrayBuffer);

    // Use ImageMagick via Deno subprocess for image processing
    const process = new Deno.Command("convert", {
      args: [
        "-", // Read from stdin
        "-resize", "800x800^", // Resize to fill 800x800
        "-gravity", "center",
        "-extent", "800x800", // Crop to exactly 800x800
        "-quality", "85", // Compress to 85% quality
        "-strip", // Remove metadata
        // Add watermark
        "-gravity", "southeast",
        "-pointsize", "14",
        "-fill", "white",
        "-stroke", "rgba(0,0,0,0.3)",
        "-strokewidth", "1",
        "-annotate", "+12+12", "popularVET",
        "jpeg:-" // Output as JPEG to stdout
      ],
      stdin: "piped",
      stdout: "piped",
      stderr: "piped",
    });

    const child = process.spawn();
    
    // Write input image to stdin
    const writer = child.stdin.getWriter();
    await writer.write(uint8Array);
    await writer.close();

    // Get the output
    const { stdout, stderr } = await child.output();
    const status = await child.status;

    if (!status.success) {
      const errorText = new TextDecoder().decode(stderr);
      console.error('ImageMagick error:', errorText);
      throw new Error(`Image processing failed: ${errorText}`);
    }

    console.log('Image processed successfully');

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    const fileName = `${timestamp}-${randomStr}.jpg`;

    // Upload optimized image to storage
    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from('pet-gallery')
      .upload(fileName, stdout, {
        contentType: 'image/jpeg',
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
        optimizedSize: stdout.length,
        compressionRatio: ((1 - stdout.length / file.size) * 100).toFixed(2) + '%'
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
