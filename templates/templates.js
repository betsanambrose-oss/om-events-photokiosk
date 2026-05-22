// OM Events Photo Kiosk — All 12 Categories, 48 Scenes
// Prompts optimized for Flux Kontext Pro
// [GENDER] is replaced at runtime with detected gender

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
          prompt: 'Transform this [GENDER] into a Hollywood A-list celebrity at a glamorous movie premiere red carpet. Keep their exact face, skin tone, hair and body unchanged. Dress them in designer evening wear. Surround them with bright paparazzi camera flashes, velvet ropes, and a luxury movie premiere backdrop with film studio logos. Dramatic cinematic night lighting with warm golden spotlights. Shot on Canon EF 85mm f/1.4, shallow depth of field, bokeh background. Ultra photorealistic, Vogue editorial quality, 8k.'
        },
        {
          id: 'hw-oscar',
          name: 'Oscar Night',
          gradient: 'linear-gradient(135deg, #C9A84C, #5a3a00)',
          prompt: 'Transform this [GENDER] into an Oscar Award winner on the grand Academy Awards stage. Keep their exact face, skin tone and features completely unchanged. Dress them in formal gala attire, holding a golden Oscar trophy, standing in a dramatic golden spotlight on the Dolby Theatre stage with the grand theater and audience in background. Shot on Sony A7R IV 50mm, ultra photorealistic, cinematic lighting, 8k.'
        },
        {
          id: 'hw-billboard',
          name: 'Times Square Star',
          gradient: 'linear-gradient(135deg, #001a4d, #003399)',
          prompt: 'Transform this [GENDER] into a world-famous celebrity featured on a massive Times Square New York City billboard at night. Keep their exact face and features completely unchanged. Show their portrait on a giant illuminated billboard surrounded by NYC neon lights, yellow taxis and traffic below, iconic NYC skyline visible. Ultra photorealistic, editorial photography style, 8k.'
        },
        {
          id: 'hw-director',
          name: 'Hollywood Director',
          gradient: 'linear-gradient(135deg, #1a1a1a, #3d3d3d)',
          prompt: 'Transform this [GENDER] into a legendary Hollywood film director on a professional movie set. Keep their exact face and features completely unchanged. Show them sitting in a directors chair with their name on it, wearing stylish casual attire, professional ARRI cinema cameras and film crew visible in background, clapperboard in foreground, dramatic studio lighting. Ultra photorealistic, 8k.'
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
          prompt: 'Transform this [GENDER] into royalty seated on an ornate golden throne. Keep their exact face, skin tone and features completely unchanged. Dress them in royal crown and magnificent regal clothing with jewels, place them in a grand European palace hall with majestic crystal chandeliers, velvet drapes, marble floors with gold inlay and royal guards flanking. Shot on Hasselblad medium format, ultra photorealistic, regal dramatic lighting, 8k.'
        },
        {
          id: 'rl-king',
          name: 'The King',
          gradient: 'linear-gradient(135deg, #8B6914, #2d2200)',
          prompt: 'Transform this [GENDER] into a powerful medieval king. Keep their exact face, skin tone and features completely unchanged. Dress them in a magnificent jeweled crown and royal robe with ermine fur trim, holding a golden scepter, standing in a grand stone castle with dramatic light streaming through tall stained glass windows, stone archways and royal banner behind. Ultra photorealistic, cinematic royal portrait, 8k.'
        },
        {
          id: 'rl-queen',
          name: 'The Queen',
          gradient: 'linear-gradient(135deg, #800040, #2d0015)',
          prompt: 'Transform this [GENDER] into a magnificent queen in a grand palace ballroom. Keep their exact face, skin tone and features completely unchanged. Dress them in an elaborate royal ball gown with intricate embroidery and diamond tiara, surrounded by crystal chandeliers, golden baroque architecture with rose bouquet and courtiers in background. Ultra photorealistic, cinematic royal portrait, 8k.'
        },
        {
          id: 'rl-mughal',
          name: 'Mughal Emperor',
          gradient: 'linear-gradient(135deg, #4d2600, #1a0d00)',
          prompt: 'Transform this [GENDER] into a Mughal emperor in the grand Mughal palace. Keep their exact face, skin tone and features completely unchanged. Dress them in ornate royal Indian Mughal attire with a jeweled turban, pearl necklaces and gold jewelry, standing in a grand Mughal palace courtyard with intricate marble inlay architecture and garden with fountains visible. Ultra photorealistic, majestic royal portrait, 8k.'
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
          prompt: 'Transform this [GENDER] into a star corporate award winner on a grand annual day event stage. Keep their exact face, skin tone and features completely unchanged. Show them standing confidently on an elegantly decorated stage holding an award trophy, with bright professional spotlights, large applauding corporate audience in background and beautiful LED backdrop. Ultra photorealistic, professional event photography, 8k.'
        },
        {
          id: 'ad-award',
          name: 'Award Winner',
          gradient: 'linear-gradient(135deg, #C9A84C, #4d3d00)',
          prompt: 'Transform this [GENDER] into a prestigious award recipient at a corporate ceremony. Keep their exact face, skin tone and features completely unchanged. Show them on an elegant stage receiving a gleaming trophy with golden confetti falling around them, professional audience applauding, warm spotlight and a sophisticated event backdrop. Ultra photorealistic, professional event photography, 8k.'
        },
        {
          id: 'ad-ceo',
          name: 'CEO Keynote',
          gradient: 'linear-gradient(135deg, #1a2a1a, #0d3d1a)',
          prompt: 'Transform this [GENDER] into a powerful CEO delivering a keynote speech at a prestigious corporate event. Keep their exact face, skin tone and features completely unchanged. Show them speaking confidently at a podium on a modern stage with a large LED screen showing company branding behind them, wearing professional business attire and dramatic stage lighting with large corporate audience. Ultra photorealistic, corporate photography, 8k.'
        },
        {
          id: 'ad-celebration',
          name: 'Celebration',
          gradient: 'linear-gradient(135deg, #2d0066, #110033)',
          prompt: 'Transform this [GENDER] celebrating at a grand corporate annual day party. Keep their exact face, skin tone and features completely unchanged. Show them surrounded by colorful confetti and balloons falling, holding a champagne flute with a joyful expression, professional event lighting and company branding in background. Ultra photorealistic, event photography, 8k.'
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
          prompt: 'Transform this [GENDER] into a luxury traveler relaxing at a Maldives overwater bungalow resort. Keep their exact face, skin tone and features completely unchanged. Show them on the deck of a luxury overwater villa with crystal clear turquoise lagoon all around, white sand beach visible, palm trees and a golden sunset sky reflecting on water, wearing elegant resort wear. Shot on Canon 5D Mark IV, ultra photorealistic, paradise lifestyle photography, 8k.'
        },
        {
          id: 'sm-yacht',
          name: 'Luxury Yacht',
          gradient: 'linear-gradient(135deg, #001433, #003399)',
          prompt: 'Transform this [GENDER] into a luxury yacht owner on a superyacht. Keep their exact face, skin tone and features completely unchanged. Show them standing on the deck of a massive luxury superyacht in the Mediterranean sea, wearing designer sunglasses and an elegant summer outfit, with a golden hour sunset and other yachts visible in background. Ultra photorealistic, luxury lifestyle photography, 8k.'
        },
        {
          id: 'sm-beach',
          name: 'Beach Party',
          gradient: 'linear-gradient(135deg, #ff6600, #cc2200)',
          prompt: 'Transform this [GENDER] at a glamorous luxury beach club at golden sunset. Keep their exact face, skin tone and features completely unchanged. Show them holding a cocktail at a tropical beach club, professional DJ setup visible behind, beautiful turquoise ocean in background, vibrant festive atmosphere with stylish summer outfit. Ultra photorealistic, lifestyle photography, 8k.'
        },
        {
          id: 'sm-safari',
          name: 'African Safari',
          gradient: 'linear-gradient(135deg, #5c3d00, #1a1000)',
          prompt: 'Transform this [GENDER] on an African safari adventure. Keep their exact face, skin tone and features completely unchanged. Show them sitting on top of a luxury safari jeep at golden sunset in the African savanna, with giraffes and elephants silhouetted in the background, vast golden grasslands and wearing safari gear. Shot on Nikon D850 200mm lens, ultra photorealistic, nature photography, 8k.'
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
          prompt: 'Transform this [GENDER] into a mountain adventurer at the Swiss Alps peak. Keep their exact face, skin tone and features completely unchanged. Show them standing triumphantly on a snow-covered Alpine mountain peak with a dramatic blue sky, stunning snow-capped mountain range all around, wearing premium ski wear and goggles with breath visible in cold air. Shot on Canon R5, ultra photorealistic, adventure photography, 8k.'
        },
        {
          id: 'wn-aurora',
          name: 'Northern Lights',
          gradient: 'linear-gradient(135deg, #001a33, #003322)',
          prompt: 'Transform this [GENDER] standing under the breathtaking Northern Lights in Iceland. Keep their exact face, skin tone and features completely unchanged. Show them in a snow landscape with vibrant green and purple aurora borealis filling the entire sky above, wearing warm winter clothing with a small wooden cabin visible in background and a magical atmosphere. Ultra photorealistic, dramatic night photography, 8k.'
        },
        {
          id: 'wn-xmas',
          name: 'Winter Wonderland',
          gradient: 'linear-gradient(135deg, #1a0033, #330066)',
          prompt: 'Transform this [GENDER] in a magical Christmas winter wonderland. Keep their exact face, skin tone and features completely unchanged. Show them surrounded by thousands of warm fairy lights on snow-covered trees, with gentle snow falling and a giant beautifully decorated Christmas tree nearby, wearing an elegant winter coat in a warm festive atmosphere. Ultra photorealistic, holiday photography, 8k.'
        },
        {
          id: 'wn-palace',
          name: 'Ice Palace',
          gradient: 'linear-gradient(135deg, #003366, #000d1a)',
          prompt: 'Transform this [GENDER] inside a magnificent ice palace. Keep their exact face, skin tone and features completely unchanged. Show them surrounded by towering blue crystalline ice walls and intricate ice sculptures, ethereal soft blue magical lighting, wearing elegant winter formal attire with breath visible. Ultra photorealistic, fantasy editorial photography, 8k.'
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
          prompt: 'Transform this [GENDER] into an elegant vintage photography portrait. Keep their exact face, skin tone and features completely unchanged. Show them in a classic studio portrait with warm sepia tones, wearing period-appropriate elegant clothing with professional studio lighting and dramatic shadows on a timeless backdrop. Shot on medium format film camera aesthetic, ultra photorealistic, classic portrait photography, 8k.'
        },
        {
          id: 'fm-garden',
          name: 'English Garden',
          gradient: 'linear-gradient(135deg, #1a3300, #0d1a00)',
          prompt: 'Transform this [GENDER] in a beautiful English country garden. Keep their exact face, skin tone and features completely unchanged. Show them surrounded by blooming roses and colorful flowers, lush green manicured hedges, golden afternoon sunlight filtering through, wearing elegant countryside attire. Shot on Canon 85mm f/1.2, ultra photorealistic, lifestyle portrait photography, 8k.'
        },
        {
          id: 'fm-studio',
          name: 'Premium Studio',
          gradient: 'linear-gradient(135deg, #1a1a1a, #333333)',
          prompt: 'Transform this [GENDER] in a high-end professional fashion photography studio. Keep their exact face, skin tone and features completely unchanged. Show them against a seamless white backdrop with dramatic Rembrandt lighting setup, wearing premium fashion attire, magazine editorial quality. Shot on Hasselblad H6D, ultra photorealistic, Vogue fashion photography, 8k.'
        },
        {
          id: 'fm-picnic',
          name: 'Luxury Picnic',
          gradient: 'linear-gradient(135deg, #1a3300, #2d5500)',
          prompt: 'Transform this [GENDER] at an elegant luxury garden picnic. Keep their exact face, skin tone and features completely unchanged. Show them in a lush green park with beautiful floral arrangements, elegant picnic spread with fruits, flowers and fine china, golden afternoon light filtering through trees, wearing stylish casual attire. Ultra photorealistic, lifestyle photography, 8k.'
        }
      ]
    },
    {
      id: 'space',
      name: 'Sci-Fi Space',
      icon: '🚀',
      gradient: 'linear-gradient(135deg, #000033, #000066, #0000aa)',
      scenes: [
        {
          id: 'sf-astronaut',
          name: 'NASA Astronaut',
          gradient: 'linear-gradient(135deg, #000033, #001a66)',
          prompt: 'Transform this [GENDER] into a NASA astronaut inside a space station. Keep their exact face, skin tone and features completely unchanged. Show them wearing a NASA spacesuit inside the International Space Station with Earth visible through a large oval window, zero-gravity environment with equipment floating and NASA insignia visible. Ultra photorealistic, cinematic space photography, 8k.'
        },
        {
          id: 'sf-mars',
          name: 'Mars Explorer',
          gradient: 'linear-gradient(135deg, #4d1a00, #8B2500)',
          prompt: 'Transform this [GENDER] into a Mars explorer on the surface of Mars. Keep their exact face, skin tone and features completely unchanged. Show them wearing a futuristic space exploration suit, standing on dramatic red rocky Martian terrain with an orange dusty sky and NASA habitat in background, with Earth faintly visible. Ultra photorealistic, cinematic sci-fi photography, 8k.'
        },
        {
          id: 'sf-spaceship',
          name: 'Spaceship Pilot',
          gradient: 'linear-gradient(135deg, #000022, #000044)',
          prompt: 'Transform this [GENDER] into a spaceship pilot in a futuristic cockpit. Keep their exact face, skin tone and features completely unchanged. Show them sitting in a sleek sci-fi spacecraft cockpit with a star field and nebula visible through the windshield, holographic control panels, dramatic blue and white lighting, wearing a futuristic pilot suit. Ultra photorealistic, cinematic sci-fi, 8k.'
        },
        {
          id: 'sf-alien',
          name: 'Alien World',
          gradient: 'linear-gradient(135deg, #1a0033, #330066)',
          prompt: 'Transform this [GENDER] on a breathtaking alien planet. Keep their exact face, skin tone and features completely unchanged. Show them standing on an exotic alien world with a purple and pink sky, strange luminescent rock formations, two moons visible, wearing a sci-fi explorer suit with bioluminescent plants around. Ultra photorealistic, cinematic sci-fi photography, 8k.'
        }
      ]
    },
    {
      id: 'warriors',
      name: 'Warriors',
      icon: '⚔️',
      gradient: 'linear-gradient(135deg, #1a0a00, #3d1a00, #5c2a00)',
      scenes: [
        {
          id: 'wr-spartan',
          name: 'Spartan Warrior',
          gradient: 'linear-gradient(135deg, #4d1a00, #1a0800)',
          prompt: 'Transform this [GENDER] into a powerful Spartan warrior. Keep their exact face, skin tone and features completely unchanged. Dress them in authentic Spartan bronze armor with a crested helmet, holding a spear and round shield, standing on an ancient Greek battlefield at dramatic sunset with temple ruins in background and a cinematic war epic atmosphere. Ultra photorealistic, epic cinematic photography, 8k.'
        },
        {
          id: 'wr-samurai',
          name: 'Samurai',
          gradient: 'linear-gradient(135deg, #1a0a0a, #3d1a1a)',
          prompt: 'Transform this [GENDER] into an elite Japanese samurai. Keep their exact face, skin tone and features completely unchanged. Dress them in ornate traditional samurai armor with a kabuto helmet, holding a katana sword, standing in a cherry blossom garden with Mount Fuji visible in background, dramatic golden hour lighting with falling sakura petals. Ultra photorealistic, cinematic Japanese epic, 8k.'
        },
        {
          id: 'wr-viking',
          name: 'Viking Warrior',
          gradient: 'linear-gradient(135deg, #0a1a2e, #1a3a5c)',
          prompt: 'Transform this [GENDER] into a fierce Viking warrior. Keep their exact face, skin tone and features completely unchanged. Dress them in Viking fur and iron armor, holding an axe, standing on the prow of a Viking longship on a dramatic stormy Norse sea with grey sky and coastal cliffs. Ultra photorealistic, epic cinematic photography, 8k.'
        },
        {
          id: 'wr-knight',
          name: 'Medieval Knight',
          gradient: 'linear-gradient(135deg, #1a1a1a, #2a2a3a)',
          prompt: 'Transform this [GENDER] into a noble medieval knight. Keep their exact face, skin tone and features completely unchanged. Dress them in gleaming full plate armor with a royal crest, holding a sword, standing in a dramatic medieval castle courtyard with stone architecture, torchlight and a royal banner waving behind. Ultra photorealistic, cinematic medieval epic, 8k.'
        }
      ]
    },
    {
      id: 'music',
      name: 'Music & Concert',
      icon: '🎵',
      gradient: 'linear-gradient(135deg, #1a0033, #33004d, #4d0066)',
      scenes: [
        {
          id: 'mu-rockstar',
          name: 'Rock Star',
          gradient: 'linear-gradient(135deg, #1a0033, #2d0044)',
          prompt: 'Transform this [GENDER] into a rock star performing on a massive concert stage. Keep their exact face, skin tone and features completely unchanged. Show them on a huge stadium concert stage with pyrotechnics exploding around them, tens of thousands of fans with phones and lighters raised, dramatic laser light show, wearing iconic rock star attire. Ultra photorealistic, concert photography, 8k.'
        },
        {
          id: 'mu-dj',
          name: 'Celebrity DJ',
          gradient: 'linear-gradient(135deg, #001a33, #002d4d)',
          prompt: 'Transform this [GENDER] into a world-famous DJ performing. Keep their exact face, skin tone and features completely unchanged. Show them behind a professional DJ setup in a luxury nightclub with colorful laser lights and smoke effects, massive crowd below, wearing stylish DJ attire with hands on the mixing deck. Ultra photorealistic, nightclub photography, 8k.'
        },
        {
          id: 'mu-grammy',
          name: 'Grammy Winner',
          gradient: 'linear-gradient(135deg, #C9A84C, #4d3a00)',
          prompt: 'Transform this [GENDER] into a Grammy Award winner. Keep their exact face, skin tone and features completely unchanged. Show them on the Grammy Awards stage holding a golden Grammy trophy above their head with a dramatic spotlight, grand arena in background, wearing glamorous award show attire with confetti falling. Ultra photorealistic, award show photography, 8k.'
        },
        {
          id: 'mu-video',
          name: 'Music Video Star',
          gradient: 'linear-gradient(135deg, #1a1a00, #3d3d00)',
          prompt: 'Transform this [GENDER] into the star of a high-end music video production. Keep their exact face, skin tone and features completely unchanged. Show them on a premium music video set with professional lighting rigs, camera cranes, wearing designer fashion attire with luxury set design and neon lights on a dramatic backdrop. Ultra photorealistic, fashion music video photography, 8k.'
        }
      ]
    },
    {
      id: 'sports',
      name: 'Sports',
      icon: '🏆',
      gradient: 'linear-gradient(135deg, #003300, #006600, #009900)',
      scenes: [
        {
          id: 'sp-cricket',
          name: 'Cricket World Cup',
          gradient: 'linear-gradient(135deg, #003300, #005500)',
          prompt: 'Transform this [GENDER] into a cricket World Cup champion. Keep their exact face, skin tone and features completely unchanged. Show them wearing Indian cricket whites, holding the ICC Cricket World Cup trophy aloft in a stadium filled with fans, confetti falling with dramatic floodlights. Ultra photorealistic, sports photography, 8k.'
        },
        {
          id: 'sp-ipl',
          name: 'IPL Champion',
          gradient: 'linear-gradient(135deg, #1a0033, #00004d)',
          prompt: 'Transform this [GENDER] into an IPL cricket star. Keep their exact face, skin tone and features completely unchanged. Show them wearing an IPL cricket jersey, celebrating with the IPL trophy in a colorful IPL stadium packed with fans at night under floodlights. Ultra photorealistic, sports photography, 8k.'
        },
        {
          id: 'sp-football',
          name: 'FIFA World Cup',
          gradient: 'linear-gradient(135deg, #002200, #004400)',
          prompt: 'Transform this [GENDER] into a FIFA World Cup champion. Keep their exact face, skin tone and features completely unchanged. Show them holding the golden FIFA World Cup trophy, wearing a national team jersey in a packed World Cup stadium with fans, confetti and fireworks with dramatic floodlights. Ultra photorealistic, sports photography, 8k.'
        },
        {
          id: 'sp-f1',
          name: 'Formula 1 Champion',
          gradient: 'linear-gradient(135deg, #330000, #660000)',
          prompt: 'Transform this [GENDER] into a Formula 1 world champion. Keep their exact face, skin tone and features completely unchanged. Show them standing on the F1 podium in a racing suit holding a trophy, with champagne spraying, packed Formula 1 circuit grandstands behind and the team celebrating with race cars visible. Ultra photorealistic, motorsport photography, 8k.'
        }
      ]
    },
    {
      id: 'indian',
      name: 'Indian Special',
      icon: '🇮🇳',
      gradient: 'linear-gradient(135deg, #FF9933, #138808)',
      scenes: [
        {
          id: 'in-bollywood',
          name: 'Bollywood Premiere',
          gradient: 'linear-gradient(135deg, #4d1a00, #8B0000)',
          prompt: 'Transform this [GENDER] into a Bollywood celebrity at a grand Mumbai movie premiere. Keep their exact face, skin tone and features completely unchanged. Show them on the red carpet with camera flashes from paparazzi, Filmfare and film studio backdrops, wearing glamorous Indian designer attire with traditional elements and cinematic Indian cinema glamour. Ultra photorealistic, Bollywood photography, 8k.'
        },
        {
          id: 'in-isro',
          name: 'ISRO Scientist',
          gradient: 'linear-gradient(135deg, #001a33, #003366)',
          prompt: 'Transform this [GENDER] into an ISRO space scientist. Keep their exact face, skin tone and features completely unchanged. Show them inside the ISRO mission control room with large screens showing rocket launch data, wearing ISRO scientist attire, with Chandrayaan and Mangalyaan mission screens visible and the Indian Tricolor displayed. Ultra photorealistic, documentary photography, 8k.'
        },
        {
          id: 'in-maharaja',
          name: 'Maharaja',
          gradient: 'linear-gradient(135deg, #4d2600, #8B4500)',
          prompt: 'Transform this [GENDER] into an Indian Maharaja or Maharani in a royal palace. Keep their exact face, skin tone and features completely unchanged. Dress them in ornate traditional Indian royal attire with gold jewelry, a jeweled turban or crown, standing in a grand Rajasthani palace with intricate architecture and peacock motifs. Ultra photorealistic, royal portrait photography, 8k.'
        },
        {
          id: 'in-republic',
          name: 'Republic Day',
          gradient: 'linear-gradient(135deg, #FF9933, #004d00)',
          prompt: 'Transform this [GENDER] at the Republic Day parade in New Delhi. Keep their exact face, skin tone and features completely unchanged. Show them standing proudly at Kartavya Path with India Gate visible, military parade passing, Tricolor Indian flags everywhere, wearing formal Indian traditional attire with a proud patriotic expression. Ultra photorealistic, documentary photography, 8k.'
        }
      ]
    },
    {
      id: 'luxury',
      name: 'Luxury Life',
      icon: '💎',
      gradient: 'linear-gradient(135deg, #1a1a00, #3d3d00, #C9A84C)',
      scenes: [
        {
          id: 'lx-jet',
          name: 'Private Jet',
          gradient: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
          prompt: 'Transform this [GENDER] in a private luxury jet. Keep their exact face, skin tone and features completely unchanged. Show them seated in the plush leather interior of a private Boeing Business Jet, holding a champagne glass, with oval windows showing clouds below, wearing designer casual luxury attire in an ultra premium cabin. Shot on Leica Q2, ultra photorealistic, luxury lifestyle photography, 8k.'
        },
        {
          id: 'lx-penthouse',
          name: 'Penthouse',
          gradient: 'linear-gradient(135deg, #0a0a1a, #1a1a33)',
          prompt: 'Transform this [GENDER] in a luxury Manhattan penthouse. Keep their exact face, skin tone and features completely unchanged. Show them standing on a rooftop penthouse infinity pool with a stunning NYC skyline at night all around, wearing designer evening wear, holding a champagne flute with ultra modern luxury furniture. Ultra photorealistic, luxury lifestyle photography, 8k.'
        },
        {
          id: 'lx-supercar',
          name: 'Supercar',
          gradient: 'linear-gradient(135deg, #1a0000, #330000)',
          prompt: 'Transform this [GENDER] with an exotic supercar. Keep their exact face, skin tone and features completely unchanged. Show them leaning against a red Lamborghini Aventador or Ferrari 488 on a dramatic racetrack or luxury showroom, wearing designer clothes with dramatic sunset or studio lighting. Shot on Canon 1DX Mark III, ultra photorealistic, automotive luxury photography, 8k.'
        },
        {
          id: 'lx-fashion',
          name: 'Fashion Week',
          gradient: 'linear-gradient(135deg, #1a001a, #2d002d)',
          prompt: 'Transform this [GENDER] as a fashion model at Paris Fashion Week. Keep their exact face, skin tone and features completely unchanged. Show them walking a grand runway at a Paris Fashion Week show, wearing an elaborate haute couture gown or suit, with dramatic runway lighting, front row celebrities watching and the Eiffel Tower visible through a window. Ultra photorealistic, high fashion photography, 8k.'
        }
      ]
    }
  ]
};

if (typeof module !== 'undefined') module.exports = TEMPLATES;
