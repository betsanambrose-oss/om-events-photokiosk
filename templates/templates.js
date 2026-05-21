// OM Events — Templates with Flux Kontext prompts
// Kontext takes the face photo + this prompt and generates the full scene

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
          prompt: 'Transform this person into a Hollywood celebrity at a glamorous movie premiere. Keep their exact face and identity. Place them standing on a red carpet surrounded by camera flashes and paparazzi, wearing elegant evening wear, dramatic night lighting, velvet ropes and movie premiere backdrop with logos behind them. Ultra photorealistic, cinematic, 8k quality.'
        },
        {
          id: 'hw-oscar',
          name: 'Oscar Night',
          gradient: 'linear-gradient(135deg, #C9A84C, #5a3a00)',
          prompt: 'Transform this person into an Oscar winner on stage. Keep their exact face and identity. Place them holding a golden Oscar Academy Award trophy on the grand ceremony stage, wearing formal gala attire, golden spotlight shining on them, grand theater in background. Ultra photorealistic, cinematic lighting, 8k quality.'
        },
        {
          id: 'hw-billboard',
          name: 'Times Square Star',
          gradient: 'linear-gradient(135deg, #001a4d, #003399)',
          prompt: 'Transform this person into a celebrity featured on a massive Times Square billboard at night. Keep their exact face and identity. Show them on a giant illuminated billboard surrounded by New York City neon lights, iconic NYC skyline at night. Ultra photorealistic, editorial photography style, 8k quality.'
        },
        {
          id: 'hw-director',
          name: 'Hollywood Director',
          gradient: 'linear-gradient(135deg, #1a1a1a, #3d3d3d)',
          prompt: 'Transform this person into a famous Hollywood film director on a movie set. Keep their exact face and identity. Place them sitting in a directors chair with their name on it, professional cinema cameras and film crew in background, clapperboard visible, dramatic studio lighting. Ultra photorealistic, 8k quality.'
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
          prompt: 'Transform this person into royalty seated on a golden throne. Keep their exact face and identity. Place them on an ornate royal golden throne in a grand European palace hall, wearing royal crown and regal clothing, majestic chandelier overhead, velvet drapes and marble floors. Ultra photorealistic, regal lighting, 8k quality.'
        },
        {
          id: 'rl-king',
          name: 'The King',
          gradient: 'linear-gradient(135deg, #8B6914, #2d2200)',
          prompt: 'Transform this person into a powerful medieval king. Keep their exact face and identity. Dress them in magnificent crown and royal robe with fur trim, holding a golden scepter, standing in a grand stone castle with dramatic light through tall windows. Ultra photorealistic, cinematic royal portrait, 8k quality.'
        },
        {
          id: 'rl-queen',
          name: 'The Queen',
          gradient: 'linear-gradient(135deg, #800040, #2d0015)',
          prompt: 'Transform this person into a beautiful queen. Keep their exact face and identity. Dress them in an elaborate royal gown and diamond tiara, posing in a grand palace ballroom with crystal chandeliers, holding a bouquet of flowers. Ultra photorealistic, cinematic royal portrait photography, 8k quality.'
        },
        {
          id: 'rl-mughal',
          name: 'Mughal Emperor',
          gradient: 'linear-gradient(135deg, #4d2600, #1a0d00)',
          prompt: 'Transform this person into a Mughal emperor. Keep their exact face and identity. Dress them in ornate royal Indian attire with jeweled turban and pearl necklaces, standing in the grand Mughal palace courtyard with intricate architecture. Ultra photorealistic, majestic royal portrait, 8k quality.'
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
          prompt: 'Transform this person into a corporate award winner on stage. Keep their exact face and identity. Place them standing on a grand annual day event stage, holding an award trophy, bright spotlights on them, large applauding audience in background, beautiful stage decoration. Ultra photorealistic, event photography, 8k quality.'
        },
        {
          id: 'ad-award',
          name: 'Award Winner',
          gradient: 'linear-gradient(135deg, #C9A84C, #4d3d00)',
          prompt: 'Transform this person into a prestigious award recipient. Keep their exact face and identity. Show them receiving a trophy at a corporate ceremony stage, confetti falling around them, professional audience applauding, elegant event backdrop with company logo, dramatic spotlight. Ultra photorealistic, professional event photography, 8k quality.'
        },
        {
          id: 'ad-ceo',
          name: 'CEO Moment',
          gradient: 'linear-gradient(135deg, #1a2a1a, #0d3d1a)',
          prompt: 'Transform this person into a powerful CEO giving a keynote. Keep their exact face and identity. Show them speaking at a prestigious corporate annual event stage, modern stage with large LED screen behind, professional business attire, dramatic lighting. Ultra photorealistic, corporate photography, 8k quality.'
        },
        {
          id: 'ad-celebration',
          name: 'Celebration',
          gradient: 'linear-gradient(135deg, #2d0066, #110033)',
          prompt: 'Transform this person celebrating at a grand corporate annual day party. Keep their exact face and identity. Show them surrounded by colorful confetti and balloons, festive decorations, champagne toast, joyful celebration atmosphere. Ultra photorealistic, event photography, 8k quality.'
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
          prompt: 'Transform this person into a luxury traveler in the Maldives. Keep their exact face and identity. Place them relaxing at a luxury overwater bungalow resort, crystal clear turquoise ocean, white sand beach, palm trees, golden sunset sky, wearing resort wear. Ultra photorealistic, travel photography, 8k quality.'
        },
        {
          id: 'sm-yacht',
          name: 'Luxury Yacht',
          gradient: 'linear-gradient(135deg, #001433, #003399)',
          prompt: 'Transform this person into a luxury yacht owner. Keep their exact face and identity. Place them standing on the deck of a massive superyacht in the Mediterranean sea, blue ocean all around, wearing sunglasses and elegant summer outfit, golden hour lighting. Ultra photorealistic, luxury lifestyle photography, 8k quality.'
        },
        {
          id: 'sm-ibiza',
          name: 'Beach Party',
          gradient: 'linear-gradient(135deg, #ff6600, #cc2200)',
          prompt: 'Transform this person at a glamorous luxury beach club party. Keep their exact face and identity. Show them at a tropical beach setting, golden sunset, cocktails in hand, DJ stage in background, beautiful ocean view. Ultra photorealistic, lifestyle photography, vibrant colors, 8k quality.'
        },
        {
          id: 'sm-safari',
          name: 'African Safari',
          gradient: 'linear-gradient(135deg, #5c3d00, #1a1000)',
          prompt: 'Transform this person on an African safari adventure. Keep their exact face and identity. Place them sitting on top of a safari jeep at golden sunset in the savanna, giraffes and elephants visible in the background, vast golden grasslands. Ultra photorealistic, nature photography, 8k quality.'
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
          prompt: 'Transform this person into a mountain adventurer in the Swiss Alps. Keep their exact face and identity. Place them standing on a snow-covered mountain peak, dramatic winter landscape, blue sky, snow-capped mountains all around, wearing luxury ski wear. Ultra photorealistic, adventure photography, 8k quality.'
        },
        {
          id: 'wn-aurora',
          name: 'Northern Lights',
          gradient: 'linear-gradient(135deg, #001a33, #003322)',
          prompt: 'Transform this person standing under the Northern Lights in Iceland. Keep their exact face and identity. Show them in a magical aurora borealis scene with vibrant green and purple sky, snow landscape, warm winter clothing. Ultra photorealistic, dramatic night photography, 8k quality.'
        },
        {
          id: 'wn-xmas',
          name: 'Winter Wonderland',
          gradient: 'linear-gradient(135deg, #1a0033, #330066)',
          prompt: 'Transform this person in a magical Christmas winter wonderland. Keep their exact face and identity. Show them surrounded by thousands of fairy lights, snow falling gently, giant decorated Christmas tree, festive warm atmosphere. Ultra photorealistic, holiday photography, 8k quality.'
        },
        {
          id: 'wn-chateau',
          name: 'Ice Palace',
          gradient: 'linear-gradient(135deg, #003366, #000d1a)',
          prompt: 'Transform this person standing inside a magnificent ice palace. Keep their exact face and identity. Show them surrounded by blue crystalline ice walls and sculptures, magical icy atmosphere, soft blue lighting. Ultra photorealistic, fantasy editorial photography, 8k quality.'
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
          prompt: 'Transform this person into an elegant vintage portrait. Keep their exact face and identity. Show them in a classic studio portrait style, warm sepia tones, period-appropriate elegant clothing, professional studio lighting. Ultra photorealistic, timeless classic portrait photography, 8k quality.'
        },
        {
          id: 'fm-garden',
          name: 'English Garden',
          gradient: 'linear-gradient(135deg, #1a3300, #0d1a00)',
          prompt: 'Transform this person in a beautiful English country garden. Keep their exact face and identity. Show them surrounded by blooming roses and flowers, lush green hedges, warm afternoon sunlight, elegant countryside aesthetic. Ultra photorealistic, lifestyle portrait photography, 8k quality.'
        },
        {
          id: 'fm-studio',
          name: 'Premium Studio',
          gradient: 'linear-gradient(135deg, #1a1a1a, #333333)',
          prompt: 'Transform this person in a high-end professional photo studio. Keep their exact face and identity. Show them against a clean white backdrop with dramatic Rembrandt lighting, magazine editorial quality. Ultra photorealistic, fashion photography, 8k quality.'
        },
        {
          id: 'fm-picnic',
          name: 'Luxury Picnic',
          gradient: 'linear-gradient(135deg, #1a3300, #2d5500)',
          prompt: 'Transform this person at a luxury garden picnic. Keep their exact face and identity. Show them in a lush green park with beautiful floral arrangements, elegant picnic spread with fruits and flowers, golden afternoon light filtering through trees. Ultra photorealistic, lifestyle photography, 8k quality.'
        }
      ]
    }
  ]
};

if (typeof module !== 'undefined') module.exports = TEMPLATES;
