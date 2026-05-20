// netlify/functions/generate.js
// Secure proxy for fal.ai API calls
// FAL_KEY is stored as Netlify environment variable — never exposed to frontend

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const { faceImageBase64, prompt, negativePrompt, step } = JSON.parse(event.body);
    const FAL_KEY = process.env.FAL_KEY;

    if (!FAL_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    // ── STEP 1: Generate scene with Flux Dev ──
    if (step === 'generate') {
      const response = await fetch('https://fal.run/fal-ai/flux/dev', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${FAL_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          negative_prompt: negativePrompt || 'cartoon, anime, blur, low quality, deformed, ugly',
          image_size: 'portrait_4_3',
          num_inference_steps: 28,
          guidance_scale: 3.5,
          num_images: 1,
          enable_safety_checker: true,
          output_format: 'jpeg'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          statusCode: response.status,
          headers,
          body: JSON.stringify({ error: data.detail || 'Scene generation failed' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          sceneUrl: data.images[0].url
        })
      };
    }

    // ── STEP 2: Face swap ──
    if (step === 'faceswap') {
      const { sceneUrl } = JSON.parse(event.body);

      const response = await fetch('https://fal.run/easel-ai/advanced-face-swap', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${FAL_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          face_image_0: faceImageBase64,
          target_image: sceneUrl,
          workflow_type: 'target_hair',
          upscale: true,
          detailer: false
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          statusCode: response.status,
          headers,
          body: JSON.stringify({ error: data.detail || 'Face swap failed' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          resultUrl: data.image.url
        })
      };
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid step parameter' })
    };

  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Internal server error' })
    };
  }
};
