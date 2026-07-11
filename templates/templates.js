// GAME ON Photo Kiosk — Templates
// Prompts optimized for Nano Banana 2 (Gemini) — identity-locked, group-aware, action scenes
// [GENDER] replaced at runtime with detected gender

const TEMPLATES = {
  categories: [
    {
      id: 'trending',
      name: 'Trending Now',
      icon: '🔥',
      gradient: 'linear-gradient(135deg, #b3000c, #ff6a00, #1a0000)',
      scenes: [
        {
          id: 'tr-podium',
          name: 'Racing Podium',
          gradient: 'linear-gradient(135deg, #b3000c, #2b0000)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is a champion racing driver celebrating on the podium. For [GENDER], replace booth clothing with a professional racing suit — a fire-resistant racing overall in bold red and white with generic sponsor-style patches (no real brand logos or team names).

CRITICAL: Helmets are OFF and held under an arm or set aside — heads bare, real faces fully visible, lit and sharp. Never cover a face with a helmet or visor.

ACTION: They stand on the podium spraying champagne, one hand raised holding a gleaming trophy, mouths open in celebration, spray arcing through the air — faces turned toward the camera, fully visible and sharp.

SCENE: A race-track podium, huge cheering crowd blurred below, confetti and champagne spray catching the sunlight, race cars visible on the track behind, bright sunny day.

STYLE: Motorsport photography, dynamic celebration framing, champagne droplets frozen in the light, sharp faces, vivid saturated grade.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'tr-festival',
          name: 'Music Festival',
          gradient: 'linear-gradient(135deg, #6a00b3, #00b3a4)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is the headline act on stage at a huge music festival. For [GENDER], replace booth clothing with bold stage wear — a statement jacket, layered festival styling, sunglasses pushed up on the head (never covering the eyes).

ACTION: They stand at the front of the stage with arms thrown up, microphone in hand, heads back mid-shout of joy — but faces turned toward the camera, fully visible, lit and sharp.

SCENE: A colossal night festival crowd stretching into the darkness, a sea of raised hands and phone lights, laser beams cutting through haze, towering LED screens, pyrotechnic jets, confetti raining down.

STYLE: Live-music photography, wide lens from the stage, dramatic coloured stage lighting on the faces, haze and lasers, sharp faces with blurred crowd.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'tr-cover',
          name: 'Magazine Cover',
          gradient: 'linear-gradient(135deg, #1a1a1a, #d4a017)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is on the cover of a high-fashion magazine. For [GENDER], replace booth clothing with striking editorial fashion — a bold tailored outfit with dramatic silhouette and texture, high-fashion styling.

ACTION: They pose with poise and attitude, strong confident expressions, chins level, looking directly into the lens — faces large in the frame, fully visible, immaculately lit and sharp.

SCENE: A clean studio backdrop in a rich saturated colour, dramatic fashion lighting with a strong key light and controlled shadows, subtle haze.

STYLE: High-fashion editorial photography, medium-format look, crisp detail, flawless studio lighting that still preserves real skin texture — never airbrushed or plastic.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'tr-esports',
          name: 'Esports Champions',
          gradient: 'linear-gradient(135deg, #0a0a2e, #00b3a4)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is an esports champion lifting the trophy in a packed arena. For [GENDER], replace booth clothing with a professional esports team jersey — a sleek black and neon-accented jersey (no real brand or team logos).

ACTION: They stand on the arena stage holding a large glowing trophy aloft together, fists raised, roaring in celebration — faces turned toward the camera, fully visible, lit and sharp.

SCENE: A darkened esports arena, an enormous crowd blurred in the stands with phone lights glittering, gigantic LED screens glowing behind, laser beams and haze, confetti falling through neon light.

STYLE: Esports event photography, dramatic neon stage lighting on the faces, cyan and magenta accents, sharp faces with blurred arena behind.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'tr-rockstar',
          name: 'Rockstar Concert',
          gradient: 'linear-gradient(135deg, #b3000c, #ff6a00)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is a rockstar mid-performance in a packed stadium. For [GENDER], replace booth clothing with rock stage wear — a leather jacket over a band-style tee, ripped jeans, boots, layered chains.

ACTION: One person leans back mid-guitar-riff, another grips a microphone stand roaring into it — but every face is turned toward the camera, fully visible, lit and sharp. Energy in the bodies, clarity in the faces.

SCENE: A stadium stage at night, towering amplifier stacks, pyrotechnic flames jetting up behind them, a vast crowd blurred in the darkness with countless raised hands, spotlights raking through smoke.

STYLE: Live rock photography, dramatic stage lighting and pyro glow on the faces, high contrast, sharp faces with motion and haze around them.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'tr-century',
          name: 'Cricket Century',
          gradient: 'linear-gradient(135deg, #0a5c2e, #003318)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is a cricketer celebrating a match-winning century. For [GENDER], replace booth clothing with cricket whites or a coloured one-day kit — plain jersey and trousers, pads and gloves, no brand logos or national crests.

CRITICAL: Helmets are OFF and held in a hand or raised — heads bare, real faces fully visible, lit and sharp. Never cover a face with a helmet or grille.

ACTION: One person raises their bat and helmet to the sky in the classic century salute, head back in celebration but face turned toward the camera and fully visible. Any others run in to celebrate, faces visible and toward the camera.

SCENE: A packed floodlit cricket stadium at night, a roaring crowd blurred in the stands, the pitch and stumps behind, confetti and camera flashes sparkling through the stands.

STYLE: Cricket sports photography, telephoto compression, floodlight glow, sharp faces with blurred jubilant crowd.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
{
          id: 'tn-withcm',
          name: 'Photo with CM',
          gradient: 'linear-gradient(135deg, #8B0000, #2d0000)',
          referenceImage: 'assets/references/tn-withcm.png',
          prompt: `You are given TWO photos. PHOTO A shows the real guest(s) captured just now at a photo booth — this may be one person or several people. PHOTO B shows Tamil Nadu Chief Minister Vijay standing in his official government office.

SCENE TO CREATE: A warm, natural greeting moment where the guest(s) from PHOTO A are meeting and being greeted by the Chief Minister inside his office from PHOTO B — as if they have come to see him and are sharing a friendly, respectful moment together. It should look like a genuine candid photograph taken during that meeting, not a stiff line-up.

USE THE GUEST'S REAL FACE — CRITICAL: Every guest you place MUST be the exact same real human(s) from PHOTO A. Copy each of their real faces precisely — same facial structure, eyes, nose, mouth, jaw, skin tone, skin texture, hair, glasses if any, gender and body build. Do NOT invent, replace, beautify or substitute a different person. Keep the same number of guests as in PHOTO A. Each must be recognisably the SAME person — a real photograph of THEM.

THE GREETING: Show a natural interaction — the guest(s) and the Chief Minister warmly greeting each other. This can be a handshake, the CM offering a welcoming gesture, or the guest(s) presenting a pink rose bouquet and a sweet box to him. Everyone looks happy and at ease, mostly facing the camera as if posing together during the meeting.

PRESERVE THE CHIEF MINISTER EXACTLY: Keep Vijay's face, skin tone, hair, beard, white shirt and body pixel-identical to PHOTO B. Do not alter him.

PRESERVE THE OFFICE EXACTLY from PHOTO B: Tamil Nadu government emblem on the wall, Indian tricolour flag, dark wood-panelled walls, Chief Minister nameplate on the desk, framed portrait — keep everything identical.

Warm office lighting, natural blending, believable shadows and contact, no halo, no cut-out edges, ultra photorealistic. The guests' real faces are the single most important element — preserve them above all.`
        }
      ]
    },
    {
      id: 'girls',
      name: 'For Her',
      icon: '🌸',
      gradient: 'linear-gradient(135deg, #d4145a, #fbb03b, #4a0025)',
      scenes: [
        {
          id: 'gl-saree',
          name: 'Traditional Saree',
          gradient: 'linear-gradient(135deg, #a8003c, #d4a017)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every woman from the photo is dressed in an exquisite traditional Tamil silk saree.

ATTIRE: A rich Kanchipuram silk saree in a deep jewel tone — crimson, emerald or royal blue — with an intricate woven gold zari border and pallu, draped in the classic Tamil style over the shoulder. Traditional gold temple jewellery: jhumka earrings, a delicate necklace, bangles, a maang tikka. Hair styled in a neat braid or bun adorned with fresh white jasmine flowers. A small bindi. Elegant, dignified and completely modest — fully and traditionally covered.

POSE: Standing gracefully with a warm, serene smile, hands folded in a gentle namaste or resting naturally, chin softly lifted, looking directly at the camera — face fully visible, beautifully lit and sharp.

SCENE: The courtyard of a traditional South Indian home or temple at golden hour — carved stone pillars, a brass lamp glowing, marigold and jasmine garlands, a kolam pattern on the floor, warm sunlight filtering through, soft green foliage beyond.

STYLE: Ultra-realistic portrait photography, 85mm f/1.8, warm golden-hour light, exquisite fabric and jewellery detail, true photographic skin texture, shallow depth of field. Elegant, timeless, culturally authentic.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'gl-rain',
          name: 'Free as a Bird',
          gradient: 'linear-gradient(135deg, #1e88a8, #0a3d52)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every woman from the photo is joyfully playing in the rain, utterly free and alive.

ATTIRE: A flowing modest cotton kurti or a simple elegant dress in a bright colour, damp from the rain, sleeves comfortable, fully and modestly covered. Hair loose and wet, strands clinging naturally.

POSE: Arms flung wide, head tipped back, spinning or dancing in the downpour, laughing with pure unguarded joy — eyes closed or open, but the face fully visible, well-lit and sharp. Water droplets catch the light around her, splashing up from puddles beneath her feet.

SCENE: A monsoon downpour on a quiet street or open green field, rain falling in visible silver streaks, puddles rippling and reflecting the sky, lush wet greenery, a soft grey-and-silver sky glowing with diffused light breaking through the clouds. Raindrops frozen mid-air, catching light like glass beads.

STYLE: Ultra-realistic photography, fast shutter freezing individual raindrops, soft diffused monsoon light, rich saturated greens, water droplets sharp on skin and fabric, true photographic skin texture. Joyful, cinematic, liberating.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'gl-fantasy',
          name: 'Fantasy Warrior',
          gradient: 'linear-gradient(135deg, #6a00b3, #d4145a)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every woman from the photo is a powerful fantasy warrior queen in an epic comic-book scene.

ATTIRE: Magnificent ornate fantasy armour — sculpted breastplate and pauldrons in burnished gold and deep violet with glowing arcane runes, a flowing cape, elegant gauntlets. Fully and modestly covered, powerful and regal rather than revealing. A circlet or crown. Hair flowing dramatically.

CRITICAL: No helmet, no mask — the head is bare and the real face fully visible, lit and sharp.

POSE: Standing tall and commanding, one hand raised channelling brilliant violet and gold energy that swirls around her, the other gripping an ornate glowing sword or staff. Cape and hair lifted by the surging power. Chin high, fearless, looking directly at the camera — face fully visible and sharp.

SCENE: An epic fantasy realm — a shattered ancient temple on a floating island, storm clouds churning, shafts of golden light breaking through, glowing runes in the air, embers and magical particles streaming past, a vast mystical landscape far below.

STYLE: Epic fantasy blockbuster still, dramatic coloured rim lighting from the magic, glowing accents, volumetric light, ultra-realistic photographic faces on a fantasy scene — the face remains fully photographic, never illustrated. Powerful, majestic, awe-inspiring.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'gl-lover',
          name: 'Romantic Moment',
          gradient: 'linear-gradient(135deg, #d4145a, #6b0030)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every woman from the photo is sharing a warm, happy romantic moment with a partner.

IMPORTANT — CREATE THE PARTNER: For EACH woman in the photo, add ONE handsome young man beside her as her partner. Each man must have a COMPLETELY NEW, INVENTED face — never copy, clone or reuse the face of anyone from the photo. If there are two women, create two different men. If three, create three different men. Each couple stands together as a pair.

ATTIRE: The women wear elegant modest dresses or stylish kurtis in soft romantic tones. The men wear smart casual shirts and jackets. Tasteful, warm and completely modest.

POSE: Each couple stands close together in a sweet, natural, respectful moment — perhaps he is offering her a red rose, or they stand side by side laughing together, or gently holding hands. Everyone is smiling warmly and looking toward the camera — every real face fully visible, beautifully lit and sharp.

SCENE: A dreamy romantic setting at golden hour — a garden path lined with blooming flowers and warm fairy lights strung through the trees, soft bokeh, rose petals drifting in the air, a glowing sunset sky behind.

STYLE: Ultra-realistic romantic portrait photography, 85mm f/1.8, warm golden-hour light, soft dreamy bokeh, true photographic skin texture. Sweet, warm, joyful.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'gl-beach',
          name: 'Beach Getaway',
          gradient: 'linear-gradient(135deg, #00b3a4, #f7c873)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every woman from the photo is relaxing happily on a beautiful tropical beach.

ATTIRE: An elegant flowing summer maxi dress or a stylish modest kaftan in white or a soft pastel, fabric billowing gently in the sea breeze. A wide-brimmed sun hat held in one hand or worn tilted BACK so the face stays fully lit and visible. Sunglasses pushed up on the head, never over the eyes. Completely modest, tasteful resort styling.

POSE: Standing barefoot at the water's edge or walking along the sand, laughing with relaxed happiness, hair and dress catching the wind, one hand shading the eyes or holding the hat — face fully visible, beautifully lit and sharp, turned toward the camera.

SCENE: A stunning tropical beach at golden hour — powder-white sand, crystal turquoise water, gentle foaming waves, palm trees leaning, a warm glowing sun low over the ocean, soft clouds catching pink and gold. Light glittering on the water.

STYLE: Ultra-realistic travel photography, 85mm f/2, warm golden-hour light, gentle sea breeze motion in fabric and hair, true photographic skin texture, vivid turquoise and gold palette. Serene, joyful, aspirational.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        }
      ]
    },
    {
      id: 'kollywood',
      name: 'Kollywood',
      icon: '🎥',
      gradient: 'linear-gradient(135deg, #7a1010, #d4a017, #2b0000)',
      scenes: [
        {
          id: 'kw-massentry',
          name: 'Mass Hero Entry',
          gradient: 'linear-gradient(135deg, #b31217, #2b0000)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is the lead hero of a Tamil action film, making a mass entry. For [GENDER], replace booth clothing with sharp Tamil-cinema hero styling — crisp shirt or kurta with a jacket, dark sunglasses pushed up on the head (never covering the eyes — eyes and face must be fully visible), stylish boots.

ACTION: They walk toward the camera in a confident slow-motion stride, coat and clothing billowing in the wind, chin up, intense heroic expression — faces sharp, fully visible and directly toward the camera. If several people, they walk side by side in a hero line-up.

SCENE: Dramatic backlight flaring behind them, dust and embers drifting through the air, a burning-orange sky, silhouetted crowd or vehicles far behind, lens flare.

STYLE: Tamil-cinema action still, anamorphic wide lens, heavy backlight and rim light, cinematic teal-and-orange grade, sharp faces.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'kw-retroposter',
          name: 'Retro Tamil Poster',
          gradient: 'linear-gradient(135deg, #d4a017, #6b3b00)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is the star of a vintage Tamil film poster from the golden era. For [GENDER], replace booth clothing with retro Tamil-cinema styling — classic shirt or saree, period hairstyle cues kept subtle so the real face and hair are still recognisable.

ACTION: They pose in classic film-poster fashion — bold, confident, looking straight out at the viewer with dramatic expression. Faces large in the frame, fully visible and sharp.

SCENE: A hand-painted retro film-poster aesthetic — rich saturated colours, painterly background of dramatic skies and stylised scenery, ornate decorative borders. IMPORTANT: the painted look applies ONLY to the background and borders — the people's faces must remain fully photographic and real, never painted or illustrated.

STYLE: Vintage Indian film-poster composition with photographic faces composited in, warm saturated palette, film grain.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'kw-action',
          name: 'Action Sequence',
          gradient: 'linear-gradient(135deg, #8a2b06, #2b0a00)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is the hero in the middle of a Tamil-cinema action sequence. For [GENDER], replace booth clothing with rugged action-hero wear — a torn or dust-streaked shirt, sturdy trousers and boots, a little grime and sweat for realism (but never obscuring the face).

ACTION: They stride or run toward the camera as an explosion erupts behind them — determined, fearless expression, faces turned toward the camera, fully visible, lit and razor-sharp. Never look back at the blast.

SCENE: A huge fireball and debris blooming behind them, sparks and dust in the air, a wrecked street or industrial yard, low camera angle making them tower.

STYLE: Blockbuster action still, anamorphic lens, warm firelight on the faces, high contrast, sharp on subjects with debris motion behind.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'kw-village',
          name: 'Village Blockbuster',
          gradient: 'linear-gradient(135deg, #6b5000, #1a2600)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is the hero of a rural Tamil blockbuster. For [GENDER], replace booth clothing with rustic Tamil styling — a veshti or lungi with a shirt, or a cotton saree, simple and authentic, a towel over the shoulder.

ACTION: They stand tall and heroic in the frame, chins raised, powerful and rooted expressions, facing the camera directly — every face fully visible and sharp.

SCENE: A dramatic Tamil Nadu village at golden hour — vast paddy fields, coconut palms, a temple gopuram far behind, an enormous sky with towering clouds lit orange and gold, dust drifting in the low sun.

STYLE: Tamil-cinema village-drama still, wide anamorphic lens, warm golden-hour light, low camera angle, cinematic grade, sharp faces.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'kw-poster',
          name: 'Modern Film Poster',
          gradient: 'linear-gradient(135deg, #1a1a2e, #7a1010)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is the star on a modern Tamil film poster. For [GENDER], replace booth clothing with contemporary stylish hero or heroine wear — a sharp jacket and shirt, or an elegant modern outfit.

ACTION: They pose as a poster ensemble — the lead front and centre, any others arranged around them, all looking directly at the camera with intense, confident expressions. Faces large, fully visible and sharp.

SCENE: A moody cinematic poster background — deep shadows, a stylised city skyline or abstract dramatic backdrop, strong rim lighting outlining each person, atmospheric haze and light beams.

STYLE: Modern film-poster composition, dramatic key light on the faces, teal-and-orange cinematic grade, high production value.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        }
      ]
    },
    {
      id: 'hollywood',
      name: 'Hollywood',
      icon: '🎬',
      gradient: 'linear-gradient(135deg, #2d1b00, #5c3317, #8B0000)',
      scenes: [
        {
          id: 'hw-action',
          name: 'Action Blockbuster',
          gradient: 'linear-gradient(135deg, #8a2b06, #1a0a00)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is the star of a Hollywood action blockbuster. For [GENDER], replace booth clothing with rugged action-hero wear — a fitted jacket or tactical vest over a torn shirt, sturdy trousers and boots, streaks of dust and sweat for realism (never obscuring the face).

ACTION: They run toward the camera as a huge explosion erupts behind them — determined, fearless expressions, faces turned toward the camera, fully visible, well-lit and razor-sharp. They never look back at the blast.

SCENE: A fireball and debris blooming behind them, sparks and burning embers in the air, a wrecked city street, overturned vehicles, low camera angle making them tower.

STYLE: Blockbuster action still, anamorphic lens, warm firelight on the faces, high contrast, sharp on subjects with motion in the debris.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'hw-spy',
          name: 'Spy Thriller',
          gradient: 'linear-gradient(135deg, #0a1428, #2b2b4a)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is the lead in a sleek Hollywood spy thriller. For [GENDER], replace booth clothing with immaculate formal wear — a perfectly tailored black tuxedo with bow tie, or an elegant floor-length evening gown.

ACTION: They stand poised and composed, one hand adjusting a cuff or resting in a pocket, cool and unreadable expressions, looking directly into the camera — faces fully visible, lit and sharp.

SCENE: A glamorous casino at night — green baize tables, glittering chandeliers, blurred well-dressed patrons behind, warm golden light with deep shadows, a hint of a city skyline through tall windows.

STYLE: Cinematic spy-thriller still, shallow depth of field, elegant key light on the faces, rich golden and deep-blue grade.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'hw-western',
          name: 'Western Standoff',
          gradient: 'linear-gradient(135deg, #8a6b1f, #3d2200)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is a gunslinger in a classic Hollywood Western standoff. For [GENDER], replace booth clothing with Western wear — a long duster coat, waistcoat, leather boots, a wide-brimmed hat tilted BACK so the face is fully lit and never shadowed.

ACTION: They stand ready in the dusty street, hands hovering near their belts, coats flaring in the wind, jaws set, eyes locked on the camera — faces fully visible, well-lit and sharp.

SCENE: A dusty frontier town at golden hour, wooden storefronts either side, tumbleweed, dust drifting in low golden sunlight, long shadows stretching down the street, distant mountains.

STYLE: Classic Western cinema still, wide anamorphic lens, warm golden-hour light, low camera angle, sharp faces, film grain.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'hw-noir',
          name: 'Noir Detective',
          gradient: 'linear-gradient(135deg, #1a1a1a, #4a4a4a)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is a detective in a 1940s Hollywood film noir. For [GENDER], replace booth clothing with period noir styling — a trench coat and fedora worn tilted BACK so the face is fully lit and unshadowed, or an elegant period dress and coat.

ACTION: They stand in a shadowed office or rain-soaked street, collars turned up, cigarette smoke curling nearby, sharp watchful expressions, looking directly at the camera — faces fully visible, well-lit and sharp.

SCENE: Hard venetian-blind shadows striping the wall and across the scene (but never falling across a face), rain streaking a window, a desk lamp pooling light, smoke drifting through the beam, a rain-slicked street beyond.

STYLE: Film noir, high-contrast black-and-white with deep blacks and bright highlights, dramatic side key light on the faces, heavy atmosphere, film grain. Faces remain photographic and sharp.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'hw-heist',
          name: 'Heist Crew',
          gradient: 'linear-gradient(135deg, #1f1f2e, #6b1010)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is a member of a slick Hollywood heist crew. For [GENDER], replace booth clothing with sharp modern heist styling — a tailored dark suit or fitted black outfit, sunglasses pushed up on the head (never over the eyes — eyes and face fully visible).

ACTION: The crew walks toward the camera together in a confident line, in step, coats flaring, cool and unbothered expressions — every face turned toward the camera, fully visible, lit and sharp.

SCENE: A gleaming marble casino or bank lobby behind them, dramatic overhead lighting, glass and gold surfaces, blurred figures in the background, a faint haze in the air.

STYLE: Slick modern heist-film still, wide lens, low camera angle, cool cinematic grade with warm highlights, sharp faces.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        }
      ]
    },
    {
      id: 'football',
      name: 'Football Season',
      icon: '⚽',
      gradient: 'linear-gradient(135deg, #00305c, #0a7d3f, #001a33)',
      scenes: [
        {
          id: 'fb-goal',
          name: 'Striking the Goal',
          gradient: 'linear-gradient(135deg, #0a7d3f, #00301a)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is a star footballer in a packed stadium at the decisive moment of the match. For [GENDER], replace booth clothing with a professional football kit of a distinctive invented design — a bold jersey with a diagonal sash and geometric shoulder panels in strong team colours, matching shorts, long socks and boots. Design it as a real modern kit would look, but invented — no real club crests, no federation badges, no brand logos.

ACTION: One person is striking the ball toward goal — planted foot, striking leg extended, ball just leaving the boot with a spray of grass, body leaning into the shot — but their head is turned toward the camera and their face is fully visible and sharp. Any other people are teammates sprinting in support behind, faces visible and turned toward the camera.

SCENE: Floodlit night stadium, deep green pitch with mowing stripes, goal and net ahead, tens of thousands of blurred fans in the stands, flags and colour in the crowd, stadium lights flaring. Motion is in the ball, grass and background — never on the faces.

STYLE: Sports photography, Canon 400mm f/2.8, fast shutter freezing the action, shallow depth of field with sharp subjects and blurred crowd.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'fb-trophy',
          name: 'Trophy Lift',
          gradient: 'linear-gradient(135deg, #c9a227, #4a3800)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is a champion footballer lifting the trophy after winning the final. For [GENDER], replace booth clothing with a professional football kit of a distinctive invented design — a bold jersey with a diagonal sash and geometric shoulder panels in strong team colours, matching shorts, long socks and boots. Design it as a real modern kit would look, but invented — no real club crests, no federation badges, no brand logos.

ACTION: The group lifts a large golden trophy together above their heads, mouths open mid-roar of celebration, arms raised — all faces clearly visible, lit and turned toward the camera. If only one person, they hold the trophy aloft alone.

SCENE: Packed stadium at night under floodlights, gold and silver confetti and streamers raining down through the light beams, a wall of blurred cheering fans, camera flashes sparkling in the crowd, pitch beneath them.

STYLE: Sports photography, wide-angle hero shot from slightly below, confetti caught in the air, warm floodlight glow.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'fb-slide',
          name: 'Knee-Slide Celebration',
          gradient: 'linear-gradient(135deg, #0a7d3f, #00251a)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is a footballer celebrating a goal with the classic knee-slide. For [GENDER], replace booth clothing with a professional football kit of a distinctive invented design — a bold jersey with a diagonal sash and geometric shoulder panels in strong team colours, matching shorts, long socks and boots. Design it as a real modern kit would look, but invented — no real club crests, no federation badges, no brand logos.

ACTION: One person slides on their knees across the grass with arms spread wide and head thrown up in joy — but the face is turned toward the camera, fully visible and sharp. Any others run behind with arms raised, faces visible and toward the camera.

SCENE: Grass spraying up from the slide, floodlit stadium at night, the crowd behind erupting in a blur of colour, corner flag, deep green pitch.

STYLE: Sports photography, low camera angle at pitch level, fast shutter freezing the grass spray, blurred ecstatic crowd behind.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'fb-lineup',
          name: 'Team Line-Up',
          gradient: 'linear-gradient(135deg, #00305c, #001428)',
          prompt: `Every person from the photo is a national-team footballer standing in the line-up for the national anthem before kick-off.

KIT: For [GENDER], replace booth clothing with a professional football kit of a distinctive invented design — a bold jersey with a diagonal sash and geometric shoulder panels in strong team colours, matching shorts, long socks and boots. Design it as a real modern kit would look, but invented — no real club crests, no national federation badges, no brand logos.

ACTION — ADAPT TO THE NUMBER OF PEOPLE:
If ONE person: they stand alone at the front of the line, hand over heart, chin lifted, singing the anthem with pride, eyes forward — face fully visible, lit and sharp. Teammates with completely different invented faces stand in the line beside and behind them, arms linked, slightly out of focus.
If SEVERAL people: they stand shoulder to shoulder in the anthem line, arms linked or hands over hearts, chins lifted, all singing — every real face fully visible, lit and sharp, evenly spaced across the frame. Add further teammates with new invented faces to extend the line if needed.

SCENE: On the pitch before kick-off in a vast floodlit stadium at night. The line of players stands at the halfway line, a match official and a blurred wall of photographers ahead. Packed stands rise behind, a sea of blurred colour and flags. Floodlights blaze, mist drifts in the beams. Deep green pitch with mowing stripes.

STYLE: Sports photography, straight-on line-up framing, crisp sharp faces, cinematic floodlight, shallow depth of field on the crowd.`
        },
        {
          id: 'fb-stripes',
          name: 'Blue & White Stripes',
          gradient: 'linear-gradient(135deg, #75aadb, #0d3b66)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is a footballer in a sky-blue and white vertically striped kit — the classic South American look — celebrating on the pitch. For [GENDER], replace booth clothing with this striped jersey, black or white shorts, socks and boots. Plain kit only — no brand logos, no club or federation crests.

ACTION: They celebrate together, arms in the air, mid-cheer, some pointing to the sky — every face clearly visible, well-lit and turned toward the camera.

SCENE: Floodlit stadium at night, a sea of blue-and-white fans blurred in the stands, flags waving, confetti in the air, green pitch underfoot.

STYLE: Sports photography, energetic celebration framing, sharp on the subjects, crowd softly blurred.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'fb-penalty',
          name: 'Penalty Shootout',
          gradient: 'linear-gradient(135deg, #1a1a2e, #0a2540)',
          prompt: `Every person from the photo is a footballer at the tensest moment of a penalty shootout.

KIT: For [GENDER], replace booth clothing with a professional football kit of a distinctive invented design — a bold jersey with a diagonal sash and geometric shoulder panels in strong team colours, matching shorts, socks and boots. No real crests, badges or brand logos.

ACTION — ADAPT TO THE NUMBER OF PEOPLE:
If ONE person: they are the taker, standing over the ball at the penalty spot, planting the foot and striking the ball toward goal — but their head is turned toward the camera and their face is fully visible, lit and sharp. A goalkeeper with a completely new invented face dives across the goal behind them.
If SEVERAL people: ONE of them is the taker at the spot, mid-strike, face turned toward the camera and fully visible. The OTHERS stand together on the edge of the penalty area as defenders and teammates — arms linked, bodies tense, watching intently — every real face fully visible, lit and turned toward the camera. A goalkeeper with a new invented face guards the goal.

SCENE: A night stadium under harsh blazing floodlights, the ball on the penalty spot, the goal and net ahead, an enormous blurred crowd holding its breath, long shadows stretching across the grass, haze in the light beams.

STYLE: Sports photography, dramatic tension, cinematic floodlight, shallow depth of field, razor-sharp faces.`
        }
      ]
    },
    {
      id: 'superhero',
      name: 'Superheroes',
      icon: '🦸',
      gradient: 'linear-gradient(135deg, #b3000c, #d4a017, #1a0000)',
      scenes: [
        {
          id: 'sh-armor',
          name: 'Armored Tech Hero',
          gradient: 'linear-gradient(135deg, #b3000c, #d4a017)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is an armoured high-tech superhero. For [GENDER], replace booth clothing with a sleek original powered exo-suit in deep red and gold — segmented armour plating, a glowing circular power core in the chest, glowing thrusters in the palms. Original design only — do not copy any existing branded or trademarked character or costume.

CRITICAL: The helmet is OFF or retracted — the head is bare and the real face is fully visible, lit and sharp. Never cover the face with a mask, visor or helmet.

ACTION: They hover in mid-air above the city, one palm angled down with thrusters glowing, the other raised, bodies powerful and poised — faces turned toward the camera, fully visible and sharp.

SCENE: High above a glittering city at dusk, skyscrapers below, clouds around them, blue-white thruster glow lighting their armour from beneath, warm sunset on the horizon.

STYLE: Blockbuster superhero still, cinematic lighting, glowing tech accents, sharp photorealistic faces.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'sh-landing',
          name: 'Hero Landing',
          gradient: 'linear-gradient(135deg, #0a2540, #b3000c)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is a caped superhero at the moment of a dramatic landing. For [GENDER], replace booth clothing with an original heroic suit — a fitted armoured bodysuit with a flowing cape, a bold emblem of an original abstract design on the chest. Original design only — never copy an existing branded or trademarked hero costume.

CRITICAL: No mask, no cowl, no helmet — the head is bare and the real face is fully visible, well-lit and sharp.

ACTION: They land in the classic hero pose — one knee and one fist driven into the ground, cape billowing, cracks radiating outward through the asphalt, dust and debris bursting up around them — heads raised and faces turned toward the camera, fully visible and sharp.

SCENE: A city street at night, cracked road beneath them, a shockwave of dust, neon signs and streetlights glowing, skyscrapers rising behind.

STYLE: Blockbuster superhero still, low dramatic camera angle, rim lighting, dust and debris frozen in air, sharp photorealistic faces.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'sh-shield',
          name: 'Shield Defender',
          gradient: 'linear-gradient(135deg, #0a4d8c, #b3000c)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is a battle-hardened defender hero. For [GENDER], replace booth clothing with an original tactical hero suit — reinforced armour in blue and red with metallic accents, utility straps. One person carries a large round metal shield of an original design (concentric rings and a central star motif is acceptable only as a generic shape — no existing branded emblem or trademarked design).

CRITICAL: No mask or helmet — the head is bare and the real face is fully visible, well-lit and sharp.

ACTION: They stand braced in a defensive stance, the shield raised against an unseen force, debris flying past them, jaws set, faces turned toward the camera and fully visible.

SCENE: A ruined city street mid-battle, dust and sparks in the air, smoke, rubble, dramatic shafts of light breaking through.

STYLE: Blockbuster superhero still, gritty cinematic grade, hard rim light, debris frozen mid-air, sharp photorealistic faces.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'sh-cosmic',
          name: 'Cosmic Warrior',
          gradient: 'linear-gradient(135deg, #4a00b3, #00b3a4)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is a cosmic superhero channelling raw energy. For [GENDER], replace booth clothing with an original cosmic hero suit — a sleek dark bodysuit threaded with glowing energy lines in violet and cyan. Original design only.

CRITICAL: No mask or helmet — heads bare, real faces fully visible, lit by the energy glow, and sharp.

ACTION: They float in space with arms outstretched, brilliant energy surging from their hands and swirling around their bodies, hair and clothing lifted by the power — faces turned toward the camera, fully visible and sharp, expressions powerful and calm.

SCENE: Deep space — a vast nebula in violet, blue and gold, distant stars, a glowing planet far below, energy particles streaming past.

STYLE: Blockbuster cosmic superhero still, dramatic coloured rim light from the energy, glowing accents, sharp photorealistic faces.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'sh-vigilante',
          name: 'Night Vigilante',
          gradient: 'linear-gradient(135deg, #12121f, #2b2b4a)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is a brooding night vigilante hero. For [GENDER], replace booth clothing with an original dark tactical suit — matte black armoured plating, a long dark coat or cape, utility belt. Original design only — never copy an existing branded hero costume.

CRITICAL: No mask, no cowl, no helmet — heads bare and the real faces fully visible, lit and sharp against the night.

ACTION: They stand on a rooftop ledge overlooking the city, coats and capes snapping in the wind, one foot forward, watchful and resolute — faces turned toward the camera, fully visible and sharp.

SCENE: A rain-slicked rooftop at night high above a neon city, glowing signage and traffic far below, mist and light rain drifting, moody blue moonlight with warm neon spill lighting the faces.

STYLE: Dark cinematic superhero still, moody blue-and-neon grade, strong rim light, rain caught in the light, sharp photorealistic faces.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
        },
        {
          id: 'sh-team',
          name: 'Hero Team-Up',
          gradient: 'linear-gradient(135deg, #b3000c, #0a4d8c, #d4a017)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The photo shows one or more REAL people. Preserve EVERY person's exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye colour, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. Each must look like the SAME REAL PERSON — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate new or different faces. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear.

GROUP RULE: Keep the SAME NUMBER of people as in the photo — do not add or remove anyone. Every person in the photo must appear in the scene, each with their own real preserved face.

FACES MUST STAY VISIBLE: Even in dynamic action, every person's face must remain clearly visible, well-lit and unobstructed, turned toward the camera. Never hide a face behind motion blur, an arm, equipment, a helmet visor, a mask or hair. The action is the backdrop — the faces are the subject.

TASK: Place these exact people into the scene below. Their faces and identities stay completely locked — only clothing, pose and environment change.

Every person from the photo is a member of a superhero team, assembled together. For [GENDER], give each person a DIFFERENT original hero suit so the team looks varied — one armoured and metallic, one caped, one with glowing energy accents, one in dark tactical gear. All original designs — never copy any existing branded or trademarked hero costume.

CRITICAL: No masks, no helmets, no visors — every head is bare and every real face is fully visible, well-lit and sharp. Keep the same number of people as in the photo.

ACTION: The team stands together in a powerful line-up, feet planted, capes and coats billowing, ready for battle — all faces turned toward the camera, fully visible and sharp, confident and resolute.

SCENE: A city skyline at dusk behind them, smoke and light beams rising, dramatic clouds, debris drifting, a shaft of golden light breaking through.

STYLE: Epic blockbuster team hero shot, wide anamorphic lens, low heroic camera angle, dramatic rim lighting, sharp photorealistic faces.

ABSOLUTE PRIORITY: Preserve every person's real facial identity above everything else. Faces must be photorealistic and pixel-faithful — unmistakably the same people from the photo, never painted or generated. Ultra photorealistic, sharp facial detail, natural skin texture, 8K.`
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
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as Indian cricket World Cup champions celebrating on the field. For [GENDER], replace booth outfit with the Indian cricket team uniform — current-style BCCI blue jersey, white trousers, spiked cricket shoes. One subject holds the ICC Cricket World Cup trophy aloft. All subjects celebrate together, full body visible.

Packed international cricket stadium at night under floodlights — lush green outfield, blue and orange confetti and metallic streamers raining from the floodlight towers, 100,000 Indian fans waving Tricolor flags in the stands, LED advertising hoardings flashing congratulations around the boundary. Powerful stadium floodlights overhead create multiple hard light sources with complex overlapping shadows on the green grass below subjects. Confetti in the air catches the floodlight. Trophy surface reflects stadium lights as bright metallic highlights.

Canon 1DX Mark III 300mm f/2.8, ultra photorealistic, professional cricket sports photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'sp-ipl',
          name: 'IPL Champion',
          gradient: 'linear-gradient(135deg, #1a0033, #00004d)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as IPL cricket superstars celebrating a championship victory. For [GENDER], replace booth outfit with an IPL team jersey — Mumbai Indians blue or Chennai Super Kings yellow. Subjects celebrate with the IPL trophy in a group, full body visible.

IPL stadium during trophy presentation at night — IPL team colored flags and banners everywhere, characteristic branded ground hoardings lit around the boundary, cheerleaders performing, championship stage set up in the ground, stands packed with 50,000+ fans, confetti cannons firing multicolored paper into the air. Stage uplights in team colors (blue or yellow) create colored light pools on subjects from below and sides. Overhead floodlights provide hard white key illumination. Characteristic IPL championship lighting — vivid colors, hard shadows on green outfield.

Nikon D6 400mm f/2.8, ultra photorealistic, IPL sports photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'sp-football',
          name: 'FIFA World Cup',
          gradient: 'linear-gradient(135deg, #002200, #004400)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as FIFA World Cup champion footballers celebrating on the pitch. For [GENDER], replace booth outfit with a national football team jersey — blue or white, national crest, shorts and football boots. One subject holds the golden FIFA World Cup trophy above their head. Full body visible.

Packed FIFA World Cup final stadium at night after the final whistle — vivid green pitch under brilliant floodlights, multicolored fireworks exploding above the stadium rim in bursts of red, gold, white and blue, 80,000 fans erupting with national flags and scarves in the air, gold and silver confetti raining down.

Sony A1 600mm f/4.0, ultra photorealistic, FIFA World Cup sports photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
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
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo inside a Boeing Business Jet private luxury aircraft. For [GENDER], replace booth outfit with designer casual luxury travel attire — a cashmere sweater, tailored trousers or elegant travel dress, premium leather accessories. Each subject holds a crystal champagne flute or reclines naturally in the seat. Full body visible.

Ultra-luxury BBJ private aircraft interior — hand-stitched ivory and gold leather club seats, burled walnut wood veneers on all surfaces, thick monogram-patterned wool carpet, entertainment screens, fresh flowers in crystal vases, gourmet food and drink service tray. Oval aircraft windows show brilliant blue sky and white clouds at cruising altitude. Warm amber overhead LED mood lighting — characteristic private aviation interior look — with cool daylight from oval windows creating secondary cool fill light from the side.

Leica Q2 28mm f/1.7, ultra photorealistic, luxury lifestyle aviation photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'lx-penthouse',
          name: 'Penthouse',
          gradient: 'linear-gradient(135deg, #0a0a1a, #1a1a33)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo in a luxury Manhattan penthouse with an infinity pool overlooking the New York City skyline at night. For [GENDER], replace booth outfit with designer evening luxury wear — a sleek tailored suit or elegant cocktail dress in black or navy. Each subject holds a crystal champagne flute. Full body visible.

Rooftop penthouse terrace in Manhattan at night — infinity edge pool glowing electric blue at the terrace edge, ultra-modern white and chrome outdoor furniture, NYC skyline at night with Empire State Building, One World Trade Center and Chrysler Building all lit up stretching in every direction, city's millions of lights reflecting on the pool water surface.

Sony A7R V 35mm f/1.4, ultra photorealistic, luxury lifestyle architectural photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'lx-fashion',
          name: 'Fashion Week',
          gradient: 'linear-gradient(135deg, #1a001a, #2d002d)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo walking the runway at Paris Fashion Week as headline models. For [GENDER], replace booth outfit with an extraordinary haute couture runway look — an elaborate sculptural garment from a top Parisian fashion house (Dior, Chanel or Valentino aesthetic) with dramatic design elements. Subjects walk naturally down the runway with professional model posture. Full body visible.

Grand finale of Paris Haute Couture Fashion Week at the Grand Palais — long white reflective runway floor in an ornate historic Parisian venue with baroque architecture and glass ceiling overhead, front row celebrities and fashion editors seated, banks of press photographers at the runway end firing flashes, Eiffel Tower visible through large windows, all models on the runway simultaneously.

Nikon Z9 85mm f/1.8, ultra photorealistic, Vogue Paris Fashion Week runway photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
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
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as royalty seated on an ornate golden throne in a grand European palace. For [GENDER], replace booth outfit with magnificent regal royal robes — deep purple velvet with ermine fur trim, gold brocade, jeweled accessories and a royal crown. All subjects seated together on the grand throne, full body visible.

Ornate golden throne with red velvet cushioning, soaring marble columns with gold leaf, enormous crystal chandeliers, royal purple velvet drapes, marble floors with gold inlay, ceremonial royal guards flanking both sides. Warm chandelier candlelight from above and cooler natural light from tall arched windows — mixed warm-cool light reflects on royal fabric, jewels and skin. Hard shadows from subjects extend onto the marble floor. No halo, no edge artifacts.

Hasselblad H6D-100c 80mm f/2.8, ultra photorealistic, regal formal portrait lighting, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'rl-king',
          name: 'The King',
          gradient: 'linear-gradient(135deg, #8B6914, #2d2200)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as powerful medieval kings and queens in a grand stone castle. For [GENDER], replace booth outfit with a jeweled crown, magnificent royal robe with ermine fur trim, holding a golden scepter. All subjects stand together confidently, full body visible.

Grand medieval castle great hall — tall stone archways, massive stained glass windows casting colored light pools on the stone floor, royal banners on iron brackets, burning torch sconces, massive stone fireplace with roaring fire. Warm amber firelight and torchlight from multiple angles with dramatic shafts of colored light from stained glass windows. Rich warm and colored shadows on subjects. Firelight reflects on royal robes, crown jewels, skin and face. Subjects cast realistic shadows onto the stone floor. No halo, no edge artifacts.

Canon EOS R5 50mm f/1.8, ultra photorealistic, cinematic medieval portrait lighting, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'rl-queen',
          name: 'The Queen',
          gradient: 'linear-gradient(135deg, #800040, #2d0015)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as magnificent royalty in a grand Versailles-style palace ballroom. For [GENDER], replace booth outfit with an elaborate royal ball gown with gold embroidery and diamond tiara, or a formal royal military dress uniform. Each subject holds a bouquet of roses. Full body visible.

Enormous mirrored walls reflecting the room infinitely, gilded baroque archways, multiple massive crystal chandeliers ablaze with candles, polished herringbone parquet floor gleaming, courtiers in formal dress in the background. Warm soft chandelier candlelight from multiple overhead sources creates natural shadows directly beneath each subject on the parquet floor. Golden chandelier light reflects on embroidery, diamond tiara facets, silk fabric and skin. Mirror walls show approximate reflections of subjects. No halo, no edge artifacts.

Nikon Z9 85mm f/1.4, ultra photorealistic, baroque grand portrait lighting, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
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
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as luxury travelers at a Maldives overwater bungalow resort. For [GENDER], replace booth outfit with elegant resort wear — linen shirts, sundresses or premium swim cover-ups. All subjects stand or sit relaxed on the bungalow deck, full body visible.

Wooden sun deck over perfectly transparent turquoise lagoon with white sandy seafloor visible beneath, thatched roof villa behind, sun loungers, distant white sand beach with palm trees, vast tropical sky with golden sunset light. Golden hour tropical sunlight at low angle floods everything in warm amber-gold, creating long soft shadows across the wooden deck planks. Turquoise water below reflects rippling blue-green light upward onto subjects' lower bodies. Sunlight catchlights in subjects' eyes. No halo, no edge artifacts.

Canon 5D Mark IV 35mm f/4.0, ultra photorealistic, luxury travel lifestyle photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'sm-yacht',
          name: 'Luxury Yacht',
          gradient: 'linear-gradient(135deg, #001433, #003399)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as luxury superyacht owners on the deck of a massive private yacht. For [GENDER], replace booth outfit with designer nautical luxury wear — crisp white linen, designer sunglasses, casual blazer or elegant summer outfit. All subjects stand confidently on the yacht deck, full body visible.

Main deck of a 60-meter luxury superyacht in the Mediterranean — gleaming white fiberglass with teak wood accents, stainless steel railings, designer outdoor furniture, jacuzzi visible on upper deck, deep blue Mediterranean sea to the horizon in late afternoon golden light. Mediterranean afternoon sun from behind creates warm rim light on subjects' hair and shoulders. Cool blue sky fills shadow sides. Subjects cast crisp shadows on the white teak deck. Polished deck and railings show subtle specular reflections of subjects.

Leica SL2 50mm f/2.0, ultra photorealistic, luxury lifestyle photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'sm-beach',
          name: 'Beach Party',
          gradient: 'linear-gradient(135deg, #ff6600, #cc2200)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo at a glamorous luxury beach club during golden hour. For [GENDER], replace booth outfit with stylish beach party attire — tropical prints, beach chic clothing or elegant resort fashion. Each subject holds a colorful cocktail glass. Full body visible.

White sand underfoot, professional DJ stage with Pioneer CDJ setup and massive speakers behind, bar counter to one side, string lights and lanterns between palm trees overhead, stylish guests in the middle distance, turquoise ocean with blazing orange-pink-gold sunset sky beyond. Warm orange-gold sunset light from low angle behind creates rim lighting on subjects' hair and shoulders. White sand reflection and string lights provide warm front fill. Cocktail glasses catch strong specular highlights. Subjects' feet and shadows visible on white sand with sand grains disturbed beneath them.

Sony A7 IV 35mm f/2.8, ultra photorealistic, lifestyle beach photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'sm-safari',
          name: 'African Safari',
          gradient: 'linear-gradient(135deg, #5c3d00, #1a1000)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo on an African safari adventure atop a luxury vehicle in the savanna. For [GENDER], replace booth outfit with premium safari gear — khaki bush shirt, cargo trousers, wide-brimmed hat, binoculars around the neck. All subjects sit together on top of an open-roof Land Cruiser, full body visible.

East African savanna at golden hour — vast golden grassland to the horizon, acacia trees silhouetted against the blazing orange-pink sky, herd of giraffes and elephants in the middle distance. African golden hour sun at the horizon behind subjects creates dramatic natural rim light — warm orange-gold edging on hair, hat brims and shoulders. Front-facing sky provides cool blue-purple fill. Subjects' shadows extend forward across the vehicle roof. Golden dust haze subtly softens the background.

Nikon D850 200mm f/2.8, ultra photorealistic, National Geographic wildlife photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
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
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as mountain adventurers triumphantly standing on a Swiss Alpine summit. For [GENDER], replace booth outfit with premium ski or mountaineering wear — insulated ski jacket and trousers, goggles on forehead, insulated gloves and ski boots. Visible cold-weather breath vapor from mouths. Full body visible.

Dramatic Swiss Alpine summit in winter — snow-capped peak with 360-degree panorama of snow-covered Alps in all directions, crisp deep blue high-altitude sky with wispy cirrus clouds, tiny Swiss village with chalet rooftops visible in the valley far below. Brilliant high-altitude direct sunlight creates sharp crisp shadows extending from subjects across the snow — snow shadows have distinctive cold blue tint from sky fill. Sunlight catches on jacket materials as realistic fabric specularity.

Canon R5 35mm f/5.6, ultra photorealistic, alpine adventure photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'wn-aurora',
          name: 'Northern Lights',
          gradient: 'linear-gradient(135deg, #001a33, #003322)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo in an Icelandic winter landscape under a spectacular Northern Lights display. For [GENDER], replace booth outfit with a heavy insulated parka, knit hat, scarf and gloves. Visible breath vapor from extreme cold. Subjects stand together, faces turned upward in wonder, full body visible.

Wide snow-covered field, a small traditional turf-roofed Icelandic cabin with warm amber light glowing from windows, bare black birch trees. Entire sky filled with vivid aurora borealis — sweeping curtains of electric green and magenta-purple aurora, faintly reflected on the snow surface. Aurora is the dominant light source — diffused green and purple color cast falls on subjects' heads, shoulders and hats from above. Cabin window amber light provides warm secondary fill from one side.

Sony A7S III 20mm f/1.8 ISO 3200, ultra photorealistic, long-exposure aurora night photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'wn-xmas',
          name: 'Winter Wonderland',
          gradient: 'linear-gradient(135deg, #1a0033, #330066)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo in a magical Christmas winter wonderland outdoor scene. For [GENDER], replace booth outfit with an elegant winter coat in deep red or forest green, knit scarf and gloves. Snowflakes settle lightly on hair, shoulders and coat fabric. Full body visible.

Large snow-covered conifer trees densely covered in thousands of warm golden fairy lights stretching in all directions, gentle snowfall with large soft snowflakes drifting down, a massive beautifully decorated 20-foot Christmas tree to one side, ground covered in fresh pristine white snow with faint footprints. Dominant warm golden fairy lights — thousands of individual point lights create a beautiful warm ambient golden glow bathing subjects from all sides. This warm golden light reflects on winter coat fabric, hair and skin.

Canon R6 50mm f/1.4, ultra photorealistic, Christmas lifestyle photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'wn-palace',
          name: 'Ice Palace',
          gradient: 'linear-gradient(135deg, #003366, #000d1a)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo inside a breathtaking fantasy ice palace. For [GENDER], replace booth outfit with elegant winter formal attire — a structured white or ice-blue formal coat or gown with silver accents. Visible breath vapor. Full body visible.

Towering walls of perfectly translucent blue crystalline ice rising to vaulted ceilings, enormous ice columns with organic crystal formations, intricate ice sculptures carved from the walls, perfectly smooth dark blue-black polished ice floor reflective as a mirror. Bioluminescent blue and pale cyan light emanates from within the ice walls and columns, filling the space with ethereal blue-white glow from all sides simultaneously — almost no hard shadows. Subjects' reflections appear on the polished ice floor below. Breath vapor catches the blue light.

Sony A7R V 35mm f/2.8, ultra photorealistic, fantasy ice editorial photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
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
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as subjects in an elegant classic studio portrait in the style of mid-20th century fine photography. For [GENDER], replace booth outfit with classic vintage formal wear — a tailored suit with pocket square or an elegant period dress with pearl accessories. All subjects pose together in a classic portrait grouping, full body visible.

Seamless warm grey studio backdrop, vintage props including a carved wooden chair and potted fern. Warm sepia and cream tones — warm-toned vintage color grade, not fully monochrome. Classic Rembrandt studio portrait lighting — single large diffused softbox key light at 45 degrees above creates a characteristic triangle catchlight on the far cheek. White reflector on the opposite side for soft fill.

Hasselblad 500cm 80mm f/5.6 medium format film aesthetic, subtle film grain, slight halation, ultra photorealistic vintage portrait photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'fm-garden',
          name: 'English Garden',
          gradient: 'linear-gradient(135deg, #1a3300, #0d1a00)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo in a beautiful English country garden during golden afternoon. For [GENDER], replace booth outfit with elegant English countryside attire — a floral summer dress or a linen suit in cream or sky blue with a pocket square. All subjects stand together naturally in the garden, full body visible.

Quintessential English country garden in full bloom — climbing roses in pink, white and red covering a stone wall behind subjects, formal box hedges and topiary framing the scene, gravel path underfoot, flowering lavender and peonies in abundance, old stone manor house softly out of focus in the background. Warm golden afternoon sunlight creates dappled light filtering through a tree canopy above — characteristic light and shadow patches across subjects and nearby plants.

Canon 85mm f/1.2L, ultra photorealistic, English countryside lifestyle portrait, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'fm-studio',
          name: 'Premium Studio',
          gradient: 'linear-gradient(135deg, #1a1a1a, #333333)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo in a high-end professional fashion photography studio as editorial models. For [GENDER], replace booth outfit with premium fashion editorial attire — sophisticated designer clothing, well-fitted and styled. All subjects stand together on the white seamless in natural editorial poses, full body visible.

Pure seamless white paper backdrop curving from floor to back wall with no visible join, Profoto B10 studio strobe lights on stands visible to the sides, large octabox overhead, clean white floor. Magazine-cover quality aesthetic. Dramatic high-fashion Rembrandt lighting — large overhead octabox creates defined downward shadows on facial planes and below noses and chins. Strip boxes fill from either side. Clean crisp three-dimensional lighting makes subjects look sculptural. Shadows from subjects onto white seamless floor are crisp and well-defined. No halo, no edge artifacts.

Hasselblad H6D-100c 110mm f/3.5, ultra photorealistic, Vogue fashion photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'fm-picnic',
          name: 'Luxury Picnic',
          gradient: 'linear-gradient(135deg, #1a3300, #2d5500)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo at a beautifully styled luxury garden picnic. For [GENDER], replace booth outfit with stylish casual garden attire — relaxed linen shirts, summer dresses or smart casual separates in soft pastel tones. All subjects sit or stand naturally together at the picnic, full body visible.

Exquisitely styled luxury garden picnic in a lush private park — large woven rattan basket, William Morris-style printed picnic blanket, artisan bread, charcuterie, cheeses, champagne in an ice bucket with crystal glasses, loose-arrangement bouquets of garden flowers in enamel vases, towering mature oak trees overhead. Warm golden afternoon sunlight filtered through tree canopy creates beautiful dappled light — patches of warm sunlight and cool leaf shadow alternating across subjects. Subjects sitting on blanket compress the fabric beneath them. Grass blades bent near seated positions.

Sony 90mm f/2.8, ultra photorealistic, luxury lifestyle photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
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
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as Spartan warriors on an ancient Greek battlefield. For [GENDER], replace booth outfit with authentic Spartan warrior armor — hammered bronze breastplate, bronze greaves, a Corinthian crested helmet pushed back revealing the face, round hoplon shield with lambda symbol, and a long spear. All subjects stand together in warrior formation, full body visible.

Rocky hillside with dry Mediterranean terrain, sparse olive trees, ruins of a Greek temple with Doric columns, smoke rising from distant fires on the horizon, deep orange-red sunset sky with volumetric rays cutting through dust and smoke haze. Dominant low-angle orange-red sunset light from one side creates dramatic rim lighting on bronze armor — hammered metal surfaces catch warm raking light as dramatic specular highlights.

Canon 1DX Mark III 85mm f/2.0, ultra photorealistic, 300-movie-style epic cinematic photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'wr-samurai',
          name: 'Samurai',
          gradient: 'linear-gradient(135deg, #1a0a0a, #3d1a1a)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as elite Japanese samurai in a cherry blossom garden. For [GENDER], replace booth outfit with ornate traditional samurai armor — full yoroi-style suit, kabuto helmet pushed up revealing the face, katana in hand and wakizashi at the hip. All subjects stand together, full body visible.

Traditional Japanese zen garden with cherry blossom trees in full bloom — pink sakura petals falling continuously, traditional wooden pavilion with curved roof eaves behind, raked gravel garden with stone lanterns, Mount Fuji's snow-capped peak visible through a gap in the trees in golden hour light. Warm golden hour sunlight filtered through cherry blossom canopy creates dappled warm amber light on subjects. The pink blossom canopy above reflects a subtle warm pink ambient onto subjects — characteristic sakura light quality.

Fujifilm GFX 100S 110mm f/2.0, ultra photorealistic, epic Kurosawa-inspired cinematic photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'wr-viking',
          name: 'Viking Warrior',
          gradient: 'linear-gradient(135deg, #0a1a2e, #1a3a5c)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as fierce Viking warriors on the prow of a Viking longship at sea. For [GENDER], replace booth outfit with Viking warrior battle attire — chainmail hauberk over wool tunic, leather bracers, fur cloak, iron helmet, holding a bearded axe or round painted shield. All subjects stand together on the ship's prow, full body visible.

Prow of a Viking drakkar longship at sea during a stormy Norse crossing — carved dragon head prow, round painted shields lining the gunwale, striped square sail billowing behind, dark grey-green sea with large swells, white foam and sea spray, dramatic storm clouds with cold silver light on the horizon, distant Norwegian coastal cliffs through the mist. Cold diffused overcast storm light from above — cool grey-silver ambient, no direct sun.

Nikon Z9 50mm f/4.0, ultra photorealistic, Vikings-series cinematic photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
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
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as rock stars performing on a massive stadium concert stage. For [GENDER], replace booth outfit with iconic rock star stage attire — leather jacket, ripped jeans, band tee or dramatic stage costume. Subjects perform naturally with a microphone stand or electric guitar. Full body visible.

Massive 80,000-person stadium concert at night — enormous stage with huge LED video walls, pyrotechnic towers erupting in columns of fire and sparks, tens of thousands of tiny phone lights stretching to the horizon, follow-spot light beams crisscrossing the stage, laser beams shooting through fog machine haze. Multiple powerful theatrical follow-spot lights create intense circular pools of white-hot light on subjects from above. Pyrotechnic fire columns to the sides blast orange-red light on subjects' faces from one side simultaneously.

Canon 1DX Mark III 400mm f/2.8, ultra photorealistic, professional concert photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'mu-dj',
          name: 'Celebrity DJ',
          gradient: 'linear-gradient(135deg, #001a33, #002d4d)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as world-famous DJs performing at a luxury nightclub. For [GENDER], replace booth outfit with stylish DJ stage attire — fashion-forward club wear, designer shirt or jacket, headphones around the neck. Subjects positioned behind a professional DJ setup actively mixing. Full body visible.

Pioneer CDJ-3000 players and DJM mixer on elevated stage with custom neon club branding, enormous crowd of clubbers on dancefloor with hands in the air, massive speaker arrays on either side, professional laser show cuts beams through smoke and haze, club LED strip lighting in neon pink and blue illuminates the booth architecture. DJ booth lit from below — neon LED strip lights on the booth face cast colored upward light (pink, blue, purple) on subjects from below creating dramatic nightclub underglow.

Sony A7S III 35mm f/1.4 ISO 6400, ultra photorealistic, professional nightclub photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
      ]
    }
  ]
};

if (typeof module !== 'undefined') module.exports = TEMPLATES;