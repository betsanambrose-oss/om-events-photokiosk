// OM Events — All 12 Categories, 48 Scenes
// Thumbnails: assets/thumbnails/[scene-id].webp

const TEMPLATES = {
  categories: [
    // ── EXISTING ──
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
          prompt: `A [GENDER] standing confidently on a glamorous Hollywood movie premiere red carpet at night. Keep their exact face, skin tone, and physical features precisely. They are wearing elegant designer evening wear. Surrounding environment: bright camera flashes from paparazzi photographers, velvet ropes, luxury movie premiere backdrop with film studio logos, dramatic night lighting with warm golden spotlights. Shot on Canon EF 85mm f/1.4 lens, shallow depth of field, bokeh background, ultra photorealistic, cinematic, Vogue editorial quality, 8k resolution.`
        },
        {
          id: 'hw-oscar',
          name: 'Oscar Night',
          gradient: 'linear-gradient(135deg, #C9A84C, #5a3a00)',
          prompt: `A [GENDER] winning an Oscar Academy Award on the grand ceremony stage. Keep their exact face and features precisely. They are holding a golden Oscar trophy, wearing formal gala attire, standing in a dramatic golden spotlight on the Dolby Theatre stage with elegant theater in background. Shot on Sony A7R IV, 50mm lens, ultra photorealistic, cinematic lighting, 8k resolution.`
        },
        {
          id: 'hw-billboard',
          name: 'Times Square Star',
          gradient: 'linear-gradient(135deg, #001a4d, #003399)',
          prompt: `A [GENDER] featured as a celebrity on a massive Times Square New York City billboard at night. Keep their exact face precisely. Giant illuminated billboard showing their portrait, surrounded by iconic NYC neon lights, yellow taxis below, iconic NYC skyline. Ultra photorealistic, editorial photography style, 8k resolution.`
        },
        {
          id: 'hw-director',
          name: 'Hollywood Director',
          gradient: 'linear-gradient(135deg, #1a1a1a, #3d3d3d)',
          prompt: `A [GENDER] as a famous Hollywood film director on a professional movie set. Keep their exact face precisely. Sitting in a director's chair with their name on it, wearing stylish casual director attire, professional ARRI cinema cameras and film crew visible in background, clapperboard in foreground, dramatic studio lighting. Ultra photorealistic, 8k resolution.`
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
          prompt: `A [GENDER] seated on an ornate royal golden throne in a grand European palace hall. Keep their exact face precisely. Wearing royal crown and magnificent regal clothing with jewels, majestic crystal chandelier overhead, velvet drapes, marble floors with gold inlay, royal guards flanking. Shot on Hasselblad medium format, ultra photorealistic, regal dramatic lighting, 8k resolution.`
        },
        {
          id: 'rl-king',
          name: 'The King',
          gradient: 'linear-gradient(135deg, #8B6914, #2d2200)',
          prompt: `A [GENDER] as a powerful medieval king in a grand stone castle. Keep their exact face precisely. Wearing a magnificent jeweled crown and royal robe with ermine fur trim, holding a golden scepter, dramatic light streaming through tall stained glass windows, stone archways, royal banner behind. Ultra photorealistic, cinematic royal portrait, 8k resolution.`
        },
        {
          id: 'rl-queen',
          name: 'The Queen',
          gradient: 'linear-gradient(135deg, #800040, #2d0015)',
          prompt: `A [GENDER] as a magnificent queen in a grand palace ballroom. Keep their exact face precisely. Wearing an elaborate royal ball gown with intricate embroidery and diamond tiara, surrounded by crystal chandeliers, golden baroque architecture, rose bouquet, courtiers in background. Ultra photorealistic, cinematic royal portrait, 8k resolution.`
        },
        {
          id: 'rl-mughal',
          name: 'Mughal Emperor',
          gradient: 'linear-gradient(135deg, #4d2600, #1a0d00)',
          prompt: `A [GENDER] as a Mughal emperor in the grand Mughal palace. Keep their exact face precisely. Wearing ornate royal Indian Mughal attire with jeweled turban, pearl necklaces and gold jewelry, standing in grand Mughal palace courtyard with intricate marble inlay architecture, garden with fountains visible. Ultra photorealistic, majestic royal portrait, 8k resolution.`
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
          prompt: `A [GENDER] as a corporate award winner on a grand annual day event stage. Keep their exact face precisely. Standing confidently on an elegantly decorated stage, holding an award trophy, bright professional spotlights illuminating them, large applauding corporate audience in background, beautiful stage setup with LED backdrop. Ultra photorealistic, professional event photography, 8k resolution.`
        },
        {
          id: 'ad-award',
          name: 'Award Winner',
          gradient: 'linear-gradient(135deg, #C9A84C, #4d3d00)',
          prompt: `A [GENDER] receiving a prestigious award at a corporate ceremony. Keep their exact face precisely. Standing on an elegant stage receiving a gleaming trophy, golden confetti falling around them, professional audience applauding, warm spotlight, sophisticated event backdrop. Ultra photorealistic, professional event photography, 8k resolution.`
        },
        {
          id: 'ad-ceo',
          name: 'CEO Keynote',
          gradient: 'linear-gradient(135deg, #1a2a1a, #0d3d1a)',
          prompt: `A [GENDER] as a powerful CEO delivering a keynote speech at a prestigious corporate event. Keep their exact face precisely. Speaking confidently at a podium on a modern stage, large LED screen behind showing company branding, professional business attire, dramatic stage lighting, large corporate audience. Ultra photorealistic, corporate photography, 8k resolution.`
        },
        {
          id: 'ad-celebration',
          name: 'Celebration',
          gradient: 'linear-gradient(135deg, #2d0066, #110033)',
          prompt: `A [GENDER] celebrating at a grand corporate annual day party. Keep their exact face precisely. Surrounded by colorful confetti and balloons falling, holding a champagne flute, joyful celebration atmosphere, professional event lighting, company branding in background. Ultra photorealistic, event photography, 8k resolution.`
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
          prompt: `A [GENDER] as a luxury traveler at a Maldives overwater bungalow resort. Keep their exact face precisely. Relaxing on the deck of a luxury overwater villa, crystal clear turquoise lagoon all around, white sand beach visible, palm trees, golden sunset sky reflecting on water, wearing elegant resort wear. Shot on Canon 5D Mark IV, ultra photorealistic, paradise lifestyle photography, 8k resolution.`
        },
        {
          id: 'sm-yacht',
          name: 'Luxury Yacht',
          gradient: 'linear-gradient(135deg, #001433, #003399)',
          prompt: `A [GENDER] as a luxury yacht owner on a superyacht. Keep their exact face precisely. Standing on the deck of a massive luxury superyacht, Mediterranean blue sea all around, wearing designer sunglasses and elegant summer outfit, golden hour sunset lighting, other yachts visible in background. Ultra photorealistic, luxury lifestyle photography, 8k resolution.`
        },
        {
          id: 'sm-beach',
          name: 'Beach Party',
          gradient: 'linear-gradient(135deg, #ff6600, #cc2200)',
          prompt: `A [GENDER] at a glamorous luxury beach club. Keep their exact face precisely. At a tropical beach club at golden sunset, cocktail in hand, professional DJ setup visible, beautiful turquoise ocean behind, vibrant festive atmosphere, stylish summer outfit. Ultra photorealistic, lifestyle photography, 8k resolution.`
        },
        {
          id: 'sm-safari',
          name: 'African Safari',
          gradient: 'linear-gradient(135deg, #5c3d00, #1a1000)',
          prompt: `A [GENDER] on an African safari adventure. Keep their exact face precisely. Sitting on top of a luxury safari jeep at golden sunset in the African savanna, giraffes and elephants silhouetted in background, vast golden grasslands, wearing safari gear. Shot on Nikon D850 with 200mm lens, ultra photorealistic, nature photography, 8k resolution.`
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
          prompt: `A [GENDER] as a mountain adventurer at the Swiss Alps peak. Keep their exact face precisely. Standing triumphantly on a snow-covered Alpine mountain peak, dramatic blue sky, stunning snow-capped mountain range all around, wearing premium ski wear and goggles, breath visible in cold air. Shot on Canon R5, ultra photorealistic, adventure photography, 8k resolution.`
        },
        {
          id: 'wn-aurora',
          name: 'Northern Lights',
          gradient: 'linear-gradient(135deg, #001a33, #003322)',
          prompt: `A [GENDER] standing under the breathtaking Northern Lights in Iceland. Keep their exact face precisely. Standing in a snow landscape with vibrant green and purple aurora borealis filling the entire sky above, wearing warm winter clothing, small wooden cabin visible in background, magical atmosphere. Ultra photorealistic, dramatic night photography, 8k resolution.`
        },
        {
          id: 'wn-xmas',
          name: 'Winter Wonderland',
          gradient: 'linear-gradient(135deg, #1a0033, #330066)',
          prompt: `A [GENDER] in a magical Christmas winter wonderland. Keep their exact face precisely. Surrounded by thousands of warm fairy lights on snow-covered trees, gentle snow falling, giant beautifully decorated Christmas tree, wearing elegant winter coat, warm festive atmosphere. Ultra photorealistic, holiday photography, 8k resolution.`
        },
        {
          id: 'wn-palace',
          name: 'Ice Palace',
          gradient: 'linear-gradient(135deg, #003366, #000d1a)',
          prompt: `A [GENDER] standing inside a magnificent ice palace. Keep their exact face precisely. Surrounded by towering blue crystalline ice walls and intricate ice sculptures, ethereal soft blue magical lighting, wearing elegant winter formal attire, breath visible. Ultra photorealistic, fantasy editorial photography, 8k resolution.`
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
          prompt: `A [GENDER] in an elegant vintage photography portrait. Keep their exact face precisely. Classic studio portrait with warm sepia tones, wearing period-appropriate elegant clothing, professional studio lighting with dramatic shadows, timeless backdrop. Shot on medium format film camera aesthetic, ultra photorealistic, classic portrait photography, 8k resolution.`
        },
        {
          id: 'fm-garden',
          name: 'English Garden',
          gradient: 'linear-gradient(135deg, #1a3300, #0d1a00)',
          prompt: `A [GENDER] in a beautiful English country garden. Keep their exact face precisely. Surrounded by blooming roses and colorful flowers, lush green manicured hedges, golden afternoon sunlight filtering through, wearing elegant countryside attire. Shot on Canon 85mm f/1.2, ultra photorealistic, lifestyle portrait photography, 8k resolution.`
        },
        {
          id: 'fm-studio',
          name: 'Premium Studio',
          gradient: 'linear-gradient(135deg, #1a1a1a, #333333)',
          prompt: `A [GENDER] in a high-end professional fashion photography studio. Keep their exact face precisely. Against a seamless white backdrop, dramatic Rembrandt lighting setup, wearing premium fashion attire, magazine editorial quality. Shot on Hasselblad H6D, ultra photorealistic, Vogue fashion photography, 8k resolution.`
        },
        {
          id: 'fm-picnic',
          name: 'Luxury Picnic',
          gradient: 'linear-gradient(135deg, #1a3300, #2d5500)',
          prompt: `A [GENDER] at an elegant luxury garden picnic. Keep their exact face precisely. In a lush green park with beautiful floral arrangements, elegant picnic spread with fruits, flowers and fine china, golden afternoon light filtering through trees, wearing stylish casual attire. Ultra photorealistic, lifestyle photography, 8k resolution.`
        }
      ]
    },

    // ── NEW CATEGORIES ──
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
          prompt: `A [GENDER] as a NASA astronaut inside a space station. Keep their exact face precisely. Wearing a NASA spacesuit, floating inside the International Space Station, Earth visible through a large oval window, zero-gravity environment with equipment floating, NASA insignia visible. Ultra photorealistic, cinematic space photography, 8k resolution.`
        },
        {
          id: 'sf-mars',
          name: 'Mars Explorer',
          gradient: 'linear-gradient(135deg, #4d1a00, #8B2500)',
          prompt: `A [GENDER] as a Mars explorer on the surface of Mars. Keep their exact face precisely. Wearing a futuristic space exploration suit, standing on dramatic red rocky Martian terrain, orange dusty sky, NASA habitat in background, Earth faintly visible. Ultra photorealistic, cinematic sci-fi photography, 8k resolution.`
        },
        {
          id: 'sf-spaceship',
          name: 'Spaceship Pilot',
          gradient: 'linear-gradient(135deg, #000022, #000044)',
          prompt: `A [GENDER] as a spaceship pilot in a futuristic cockpit. Keep their exact face precisely. Sitting in a sleek sci-fi spacecraft cockpit, star field and nebula visible through the windshield, holographic control panels, dramatic blue and white lighting, wearing a futuristic pilot suit. Ultra photorealistic, cinematic sci-fi, 8k resolution.`
        },
        {
          id: 'sf-alien',
          name: 'Alien World',
          gradient: 'linear-gradient(135deg, #1a0033, #330066)',
          prompt: `A [GENDER] on a breathtaking alien planet. Keep their exact face precisely. Standing on an exotic alien world with purple and pink sky, strange luminescent rock formations, two moons visible, wearing a sci-fi explorer suit, bioluminescent plants around. Ultra photorealistic, cinematic sci-fi photography, 8k resolution.`
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
          prompt: `A [GENDER] as a powerful Spartan warrior. Keep their exact face precisely. Wearing authentic Spartan bronze armor, crested helmet, holding a spear and round shield, standing on an ancient Greek battlefield at dramatic sunset, temple ruins in background, cinematic war epic atmosphere. Ultra photorealistic, epic cinematic photography, 8k resolution.`
        },
        {
          id: 'wr-samurai',
          name: 'Samurai',
          gradient: 'linear-gradient(135deg, #1a0a0a, #3d1a1a)',
          prompt: `A [GENDER] as an elite Japanese samurai. Keep their exact face precisely. Wearing ornate traditional samurai armor with kabuto helmet, holding a katana sword, standing in a cherry blossom garden, Mount Fuji visible in background, dramatic golden hour lighting, falling sakura petals. Ultra photorealistic, cinematic Japanese epic, 8k resolution.`
        },
        {
          id: 'wr-viking',
          name: 'Viking Warrior',
          gradient: 'linear-gradient(135deg, #0a1a2e, #1a3a5c)',
          prompt: `A [GENDER] as a fierce Viking warrior. Keep their exact face precisely. Wearing Viking fur and iron armor, holding an axe, standing on the prow of a Viking longship on a dramatic stormy Norse sea, grey sky, coastal cliffs, epic cinematic atmosphere. Ultra photorealistic, epic cinematic photography, 8k resolution.`
        },
        {
          id: 'wr-knight',
          name: 'Medieval Knight',
          gradient: 'linear-gradient(135deg, #1a1a1a, #2a2a3a)',
          prompt: `A [GENDER] as a noble medieval knight. Keep their exact face precisely. Wearing gleaming full plate armor with a royal crest, holding a sword, standing in a dramatic medieval castle courtyard, stone architecture, torchlight, royal banner waving behind. Ultra photorealistic, cinematic medieval epic, 8k resolution.`
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
          prompt: `A [GENDER] as a rock star performing on a massive concert stage. Keep their exact face precisely. On a huge stadium concert stage, pyrotechnics exploding around them, tens of thousands of fans with phones and lighters raised, dramatic laser light show, wearing rock star attire. Ultra photorealistic, concert photography, 8k resolution.`
        },
        {
          id: 'mu-dj',
          name: 'Celebrity DJ',
          gradient: 'linear-gradient(135deg, #001a33, #002d4d)',
          prompt: `A [GENDER] as a world-famous DJ performing. Keep their exact face precisely. Behind a professional DJ setup in a luxury nightclub, colorful laser lights and smoke effects, massive crowd below, wearing stylish DJ attire, hands on mixing deck. Ultra photorealistic, nightclub photography, 8k resolution.`
        },
        {
          id: 'mu-grammy',
          name: 'Grammy Winner',
          gradient: 'linear-gradient(135deg, #C9A84C, #4d3a00)',
          prompt: `A [GENDER] winning a Grammy Award. Keep their exact face precisely. On the Grammy Awards stage holding a golden Grammy trophy above their head, dramatic spotlight, grand Crypto.com Arena in background, wearing glamorous award show attire, confetti falling. Ultra photorealistic, award show photography, 8k resolution.`
        },
        {
          id: 'mu-video',
          name: 'Music Video Star',
          gradient: 'linear-gradient(135deg, #1a1a00, #3d3d00)',
          prompt: `A [GENDER] as the star of a high-end music video production. Keep their exact face precisely. On a premium music video set with professional lighting rigs, camera cranes, wearing designer fashion attire, luxury set design with neon lights and dramatic backdrop. Ultra photorealistic, fashion music video photography, 8k resolution.`
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
          prompt: `A [GENDER] as a cricket champion at the World Cup. Keep their exact face precisely. Wearing Team India cricket whites, holding the ICC Cricket World Cup trophy aloft, stadium filled with fans in background, confetti falling, dramatic floodlights. Ultra photorealistic, sports photography, 8k resolution.`
        },
        {
          id: 'sp-ipl',
          name: 'IPL Champion',
          gradient: 'linear-gradient(135deg, #1a0033, #00004d)',
          prompt: `A [GENDER] as an IPL cricket star. Keep their exact face precisely. Wearing IPL cricket jersey, celebrating with the IPL trophy, colorful IPL stadium packed with fans at night, floodlights, team colors and banners visible. Ultra photorealistic, sports photography, 8k resolution.`
        },
        {
          id: 'sp-football',
          name: 'FIFA World Cup',
          gradient: 'linear-gradient(135deg, #002200, #004400)',
          prompt: `A [GENDER] as a FIFA World Cup champion. Keep their exact face precisely. Holding the golden FIFA World Cup trophy, wearing national team jersey, packed World Cup stadium with fans, confetti and fireworks, dramatic floodlights. Ultra photorealistic, sports photography, 8k resolution.`
        },
        {
          id: 'sp-f1',
          name: 'Formula 1 Champion',
          gradient: 'linear-gradient(135deg, #330000, #660000)',
          prompt: `A [GENDER] as a Formula 1 world champion. Keep their exact face precisely. Standing on the F1 podium in a racing suit, holding a trophy, champagne spraying, packed Formula 1 circuit grandstands behind, team celebrating, race cars visible. Ultra photorealistic, motorsport photography, 8k resolution.`
        }
      ]
    },
    {
      id: 'indian',
      name: 'Indian Special',
      icon: '🇮🇳',
      gradient: 'linear-gradient(135deg, #FF9933, #FFFFFF, #138808)',
      scenes: [
        {
          id: 'in-bollywood',
          name: 'Bollywood Premiere',
          gradient: 'linear-gradient(135deg, #4d1a00, #8B0000)',
          prompt: `A [GENDER] at a Bollywood movie premiere in Mumbai. Keep their exact face precisely. On the red carpet of a grand Bollywood premiere, camera flashes from paparazzi, Filmfare and film studio backdrops, wearing glamorous Indian designer attire with traditional elements, cinematic Indian cinema glamour. Ultra photorealistic, Bollywood photography, 8k resolution.`
        },
        {
          id: 'in-isro',
          name: 'ISRO Scientist',
          gradient: 'linear-gradient(135deg, #001a33, #003366)',
          prompt: `A [GENDER] as an ISRO space scientist. Keep their exact face precisely. Inside the ISRO mission control room, large screens showing rocket launch data, wearing ISRO scientist attire, Chandrayaan and Mangalyaan mission screens visible, Indian Tricolor visible, proud expression. Ultra photorealistic, documentary photography, 8k resolution.`
        },
        {
          id: 'in-maharaja',
          name: 'Maharaja',
          gradient: 'linear-gradient(135deg, #4d2600, #8B4500)',
          prompt: `A [GENDER] as an Indian Maharaja or Maharani in a royal palace. Keep their exact face precisely. Wearing ornate traditional Indian royal attire with gold jewelry, jeweled turban or crown, standing in a grand Rajasthani palace with intricate architecture, peacock motifs, luxury Indian royal grandeur. Ultra photorealistic, royal portrait photography, 8k resolution.`
        },
        {
          id: 'in-republic',
          name: 'Republic Day',
          gradient: 'linear-gradient(135deg, #FF9933, #004d00)',
          prompt: `A [GENDER] at the Republic Day parade in New Delhi. Keep their exact face precisely. Standing proudly at Kartavya Path with India Gate visible, military parade passing, Tricolor Indian flags, wearing formal Indian traditional attire, proud patriotic expression. Ultra photorealistic, documentary photography, 8k resolution.`
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
          prompt: `A [GENDER] in a private luxury jet. Keep their exact face precisely. Seated in the plush leather interior of a private Boeing Business Jet, champagne glass in hand, oval windows showing clouds below, wearing designer casual luxury attire, ultra premium cabin decor. Shot on Leica Q2, ultra photorealistic, luxury lifestyle photography, 8k resolution.`
        },
        {
          id: 'lx-penthouse',
          name: 'Penthouse',
          gradient: 'linear-gradient(135deg, #0a0a1a, #1a1a33)',
          prompt: `A [GENDER] in a luxury Manhattan penthouse. Keep their exact face precisely. Standing on a rooftop penthouse infinity pool, stunning NYC skyline at night all around, wearing designer evening wear, champagne flute, ultra modern luxury furniture, cinematic atmosphere. Ultra photorealistic, luxury lifestyle photography, 8k resolution.`
        },
        {
          id: 'lx-supercar',
          name: 'Supercar',
          gradient: 'linear-gradient(135deg, #1a0000, #330000)',
          prompt: `A [GENDER] with an exotic supercar. Keep their exact face precisely. Leaning against a red Lamborghini Aventador or Ferrari 488 on a dramatic racetrack or luxury showroom, wearing designer clothes, dramatic studio or sunset lighting. Shot on Canon 1DX Mark III, ultra photorealistic, automotive luxury photography, 8k resolution.`
        },
        {
          id: 'lx-fashion',
          name: 'Fashion Week',
          gradient: 'linear-gradient(135deg, #1a001a, #2d002d)',
          prompt: `A [GENDER] as a fashion model at Paris Fashion Week. Keep their exact face precisely. Walking the runway at a grand Paris Fashion Week show, wearing an elaborate haute couture gown or suit, dramatic runway lighting, front row celebrities watching, Eiffel Tower visible through window. Ultra photorealistic, high fashion photography, 8k resolution.`
        }
      ]
    }
  ]
};

if (typeof module !== 'undefined') module.exports = TEMPLATES;
