// OM Events Photo Kiosk — Template Definitions
// Each template has: id, category, name, prompt, negativePrompt, previewGradient

const TEMPLATES = {
  categories: [
    {
      id: 'hollywood',
      name: 'Hollywood',
      icon: '🎬',
      gradient: 'linear-gradient(135deg, #2d1b00, #5c3317, #8B0000)',
      scenes: [
        {
          id: 'hw-redcarpet',
          name: 'Red Carpet Premiere',
          gradient: 'linear-gradient(135deg, #8B0000, #2d0000)',
          prompt: 'A person standing on a Hollywood red carpet premiere, surrounded by bright camera flashes and paparazzi, wearing elegant evening wear, cinematic lighting, velvet ropes, movie premiere backdrop with logos, dramatic night scene, ultra photorealistic, 8k, professional photography, bokeh background',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed, ugly, extra limbs'
        },
        {
          id: 'hw-oscar',
          name: 'Oscar Night',
          gradient: 'linear-gradient(135deg, #C9A84C, #5a3a00)',
          prompt: 'A person holding an Oscar Academy Award trophy on stage, golden spotlight, grand ceremony theater, wearing formal gala attire, standing at podium with Oscar statue, ultra photorealistic, cinematic dramatic lighting, 8k, professional photography',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        },
        {
          id: 'hw-billboard',
          name: 'Times Square Star',
          gradient: 'linear-gradient(135deg, #001a4d, #003399)',
          prompt: 'A person featured on a massive Times Square New York City billboard at night, surrounded by neon city lights, iconic NYC skyline, celebrity moment, ultra photorealistic, cinematic, 8k resolution, editorial photography style',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        },
        {
          id: 'hw-director',
          name: 'Behind The Camera',
          gradient: 'linear-gradient(135deg, #1a1a1a, #3d3d3d)',
          prompt: 'A person as a famous Hollywood film director on a large movie set, sitting in directors chair with their name on it, professional cinema cameras and crew in background, clapperboard, dramatic studio lighting, ultra photorealistic, 8k, professional photography',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        }
      ]
    },
    {
      id: 'royal',
      name: 'Royal',
      icon: '👑',
      gradient: 'linear-gradient(135deg, #1a0a2e, #2d1b5c, #4a0080)',
      scenes: [
        {
          id: 'rl-palace',
          name: 'Palace Throne',
          gradient: 'linear-gradient(135deg, #4a0080, #1a0030)',
          prompt: 'A person seated on an ornate royal golden throne in a grand European palace hall, wearing royal crown and regal clothing, majestic chandelier overhead, velvet drapes, marble floors, ultra photorealistic, 8k, professional portrait photography, regal lighting',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        },
        {
          id: 'rl-king',
          name: 'The King',
          gradient: 'linear-gradient(135deg, #8B6914, #2d2200)',
          prompt: 'A person as a powerful medieval king wearing a magnificent crown and royal robe with fur trim, holding a golden scepter, standing in grand stone castle, dramatic lighting through tall windows, ultra photorealistic, 8k, cinematic royal portrait',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        },
        {
          id: 'rl-queen',
          name: 'The Queen',
          gradient: 'linear-gradient(135deg, #800040, #2d0015)',
          prompt: 'A person as a beautiful queen wearing an elaborate royal gown and diamond tiara, posing in a grand palace ballroom with crystal chandeliers, bouquet of flowers, ultra photorealistic, 8k, cinematic royal portrait photography',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        },
        {
          id: 'rl-mughal',
          name: 'Mughal Emperor',
          gradient: 'linear-gradient(135deg, #4d2600, #1a0d00)',
          prompt: 'A person as a Mughal emperor wearing ornate royal Indian attire with jeweled turban and pearl necklaces, standing in the grand Mughal palace courtyard, intricate architecture, ultra photorealistic, 8k, majestic royal portrait',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        }
      ]
    },
    {
      id: 'annual-day',
      name: 'Annual Day',
      icon: '🏆',
      gradient: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
      scenes: [
        {
          id: 'ad-stage',
          name: 'Grand Stage',
          gradient: 'linear-gradient(135deg, #0f3460, #16213e)',
          prompt: 'A person standing on a grand corporate annual day event stage, bright stage spotlights, award trophy in hand, large audience in background applauding, professional corporate event setup, beautiful stage decoration, ultra photorealistic, 8k, event photography',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        },
        {
          id: 'ad-award',
          name: 'Award Winner',
          gradient: 'linear-gradient(135deg, #C9A84C, #4d3d00)',
          prompt: 'A person receiving a prestigious award trophy on a corporate ceremony stage, confetti falling, professional audience applauding, elegant event backdrop with company logo, dramatic spotlight, ultra photorealistic, 8k, professional event photography',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        },
        {
          id: 'ad-ceo',
          name: 'CEO Moment',
          gradient: 'linear-gradient(135deg, #1a2a1a, #0d3d1a)',
          prompt: 'A person as a powerful CEO giving a keynote speech at a prestigious corporate annual event, modern stage with large LED screen behind them, professional business attire, ultra photorealistic, 8k, corporate photography, dramatic lighting',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        },
        {
          id: 'ad-celebration',
          name: 'Celebration',
          gradient: 'linear-gradient(135deg, #2d0066, #110033)',
          prompt: 'A person at a grand corporate annual day celebration party, colorful confetti and balloons everywhere, festive decorations, champagne toast, joyful atmosphere, ultra photorealistic, 8k, event photography',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        }
      ]
    },
    {
      id: 'summer',
      name: 'Summer Special',
      icon: '☀️',
      gradient: 'linear-gradient(135deg, #1a0a00, #3d2200, #7a4800)',
      scenes: [
        {
          id: 'sm-maldives',
          name: 'Maldives Resort',
          gradient: 'linear-gradient(135deg, #006994, #003d5c)',
          prompt: 'A person relaxing at a luxury overwater bungalow resort in the Maldives, crystal clear turquoise ocean, white sand beach, palm trees, golden sunset sky, wearing resort wear, ultra photorealistic, 8k, travel photography, paradise',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        },
        {
          id: 'sm-yacht',
          name: 'Luxury Yacht',
          gradient: 'linear-gradient(135deg, #001433, #003399)',
          prompt: 'A person standing on the deck of a massive luxury superyacht in the Mediterranean sea, blue ocean all around, wearing sunglasses and elegant summer outfit, golden hour lighting, ultra photorealistic, 8k, luxury lifestyle photography',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        },
        {
          id: 'sm-ibiza',
          name: 'Beach Party',
          gradient: 'linear-gradient(135deg, #ff6600, #cc2200)',
          prompt: 'A person at a glamorous luxury beach club party, tropical beach setting, golden sunset, cocktails, DJ stage in background, beautiful ocean view, ultra photorealistic, 8k, lifestyle photography, vibrant colors',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        },
        {
          id: 'sm-safari',
          name: 'African Safari',
          gradient: 'linear-gradient(135deg, #5c3d00, #1a1000)',
          prompt: 'A person on an African safari in the savanna, sitting on top of a safari jeep at golden sunset, giraffes and elephants visible in the background, vast golden grasslands, ultra photorealistic, 8k, nature photography, adventure',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        }
      ]
    },
    {
      id: 'winter',
      name: 'Winter Special',
      icon: '❄️',
      gradient: 'linear-gradient(135deg, #0a1628, #0d2444, #1a3a6b)',
      scenes: [
        {
          id: 'wn-alps',
          name: 'Swiss Alps',
          gradient: 'linear-gradient(135deg, #1a3a6b, #0a1628)',
          prompt: 'A person standing on a snow-covered Swiss Alps mountain peak, dramatic winter landscape, blue sky, snow-capped mountains all around, wearing luxury ski wear, ultra photorealistic, 8k, adventure photography, epic scenery',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        },
        {
          id: 'wn-aurora',
          name: 'Northern Lights',
          gradient: 'linear-gradient(135deg, #001a33, #003322)',
          prompt: 'A person standing under breathtaking Northern Lights aurora borealis in Iceland, vibrant green and purple sky, snow landscape, warm winter clothing, dramatic night photography, ultra photorealistic, 8k, magical atmosphere',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        },
        {
          id: 'wn-xmas',
          name: 'Winter Wonderland',
          gradient: 'linear-gradient(135deg, #1a0033, #330066)',
          prompt: 'A person in a magical Christmas winter wonderland, decorated with thousands of fairy lights, snow falling gently, giant decorated Christmas tree, festive warm atmosphere, ultra photorealistic, 8k, holiday photography',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        },
        {
          id: 'wn-chateau',
          name: 'Ice Palace',
          gradient: 'linear-gradient(135deg, #003366, #000d1a)',
          prompt: 'A person standing inside a magnificent ice palace or ice hotel, blue crystalline ice walls and sculptures all around, magical icy atmosphere, soft blue lighting, ultra photorealistic, 8k, fantasy editorial photography',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        }
      ]
    },
    {
      id: 'family',
      name: 'Family Style',
      icon: '👨‍👩‍👧',
      gradient: 'linear-gradient(135deg, #0a1a0a, #1a3a1a, #2d5a2d)',
      scenes: [
        {
          id: 'fm-vintage',
          name: 'Vintage Portrait',
          gradient: 'linear-gradient(135deg, #3d2200, #1a0d00)',
          prompt: 'A person in an elegant vintage family portrait style photograph, warm sepia tones, classic studio backdrop, wearing period-appropriate elegant clothing, professional studio lighting, ultra photorealistic, 8k, timeless classic portrait photography',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        },
        {
          id: 'fm-garden',
          name: 'English Garden',
          gradient: 'linear-gradient(135deg, #1a3300, #0d1a00)',
          prompt: 'A person in a beautiful English country garden during spring, blooming roses and flowers everywhere, lush green hedges, warm afternoon sunlight, elegant countryside aesthetic, ultra photorealistic, 8k, lifestyle portrait photography',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        },
        {
          id: 'fm-studio',
          name: 'Premium Studio',
          gradient: 'linear-gradient(135deg, #1a1a1a, #333333)',
          prompt: 'A person in a high-end professional photo studio, clean white backdrop, dramatic Rembrandt lighting setup, premium portrait photography, magazine editorial quality, ultra photorealistic, 8k, fashion photography',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        },
        {
          id: 'fm-picnic',
          name: 'Luxury Picnic',
          gradient: 'linear-gradient(135deg, #1a3300, #2d5500)',
          prompt: 'A person at a luxury picnic in a lush green park, beautiful floral arrangements, elegant picnic spread with fruits and flowers, golden afternoon light filtering through trees, ultra photorealistic, 8k, lifestyle photography',
          negative: 'cartoon, anime, painting, illustration, blur, low quality, deformed'
        }
      ]
    }
  ]
};

// Export for use
if (typeof module !== 'undefined') module.exports = TEMPLATES;
