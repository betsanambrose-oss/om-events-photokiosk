// OM Events Photo Kiosk - All 12 Categories, 48 Scenes
// Prompts optimized for FAL.ai Flux Kontext Pro - max 180 words each
// [GENDER] replaced at runtime with detected gender

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
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as Hollywood A-list celebrities arriving at a major movie premiere red carpet. For [GENDER], replace booth outfit with designer evening wear — a tailored tuxedo or elegant floor-length gown. All subjects stand confidently together, full body visible.

Deep red velvet carpet, velvet rope barriers, large step-and-repeat backdrop with film studio logos, paparazzi pit with cameras and bursting flashes, crowd behind barriers. Warm golden overhead spotlights combined with hard paparazzi camera flashes from the sides. These light sources cast natural shadows beneath each subject's feet onto the red carpet. Warm amber and white flash light reflects visibly on faces, shoulders and clothing. Subjects stand physically on the carpet — no floating, no halo, no edge artifacts.

Canon 85mm f/1.4, shallow DOF, cinematic bokeh, slight film grain, ultra photorealistic, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'hw-oscar',
          name: 'Oscar Night',
          gradient: 'linear-gradient(135deg, #C9A84C, #5a3a00)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as Oscar Award winners on the Academy Awards stage at the Dolby Theatre. For [GENDER], replace booth outfit with formal gala attire — a classic tuxedo or spectacular evening gown. Each subject holds a golden Oscar statuette. Full body visible.

Grand gold and white stage set design, Oscar motif backdrop, large digital screen, vast packed celebrity audience filling the auditorium. A single dramatic golden-white theatrical spotlight from directly above creates sharp shadows extending behind each subject onto the stage floor. Warm gold stage light reflects on faces, skin, hair and clothing. Subjects physically anchored on stage with contact shadows — no halo, no edge artifacts.

Sony A7R IV 50mm f/2.8, ultra photorealistic, cinematic award lighting, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'hw-director',
          name: 'Hollywood Director',
          gradient: 'linear-gradient(135deg, #1a1a1a, #3d3d3d)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as legendary Hollywood film directors on a professional movie production set. For [GENDER], replace booth outfit with stylish smart-casual director attire — dark jeans, shirt and jacket. Each subject sits in a canvas director's chair with their name on the back. Full body visible.

Large professional studio set with ARRI ALEXA cinema camera on dolly, film crew, tungsten and LED softbox lighting rigs overhead, clapperboard in foreground, partially built set and green screen sections in distance. Warm tungsten studio practicals and diffused softbox from above-and-side create Rembrandt-style shadows on faces. Hard contact shadows beneath chair legs and feet onto the concrete studio floor. Warm amber film-set light reflects on skin and clothing. No halo, no edge artifacts.

ARRI ALEXA Zeiss Master Prime 50mm, ultra photorealistic, cinematic production photography, 8K.

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
        {
          id: 'rl-mughal',
          name: 'Mughal Emperor',
          gradient: 'linear-gradient(135deg, #4d2600, #1a0d00)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as Mughal emperors and empresses in a grand Mughal imperial palace. For [GENDER], replace booth outfit with ornate Mughal imperial attire — richly embroidered sherwani or anarkali, jeweled turban with aigrette feather ornament, multiple pearl necklaces and kundan gemstone jewelry. Full body visible.

Grand Mughal imperial palace courtyard in the style of Red Fort or Fatehpur Sikri — intricate white marble pietra dura inlay floors, soaring arched iwans with elaborate jali screens, symmetrical water channels and fountains, cypress trees, ornate pillars. Warm golden dusk sunlight at a low angle creates long soft shadows across the intricate marble floor. Warm amber light reflects on jewels, gold embroidery, silk fabric, pearl necklaces and skin. Jali screens cast patterned light and shadow. No halo, no edge artifacts.

Hasselblad X2D 90mm f/2.5, ultra photorealistic, majestic imperial portrait lighting, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
      ]
    },
    {
      id: 'annual-day',
      name: 'Annual Day',
      icon: '🏆',
      gradient: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
      scenes: [
        {
          id: 'ad-award',
          name: 'Award Winner',
          gradient: 'linear-gradient(135deg, #C9A84C, #4d3d00)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as prestigious award recipients receiving a trophy at an elegant corporate ceremony. For [GENDER], replace booth outfit with formal evening corporate wear — a sharp tuxedo or elegant formal dress. Each subject holds a gleaming glass-and-metal trophy aloft. Full body visible.

Elegant stage with warm gold and champagne color palette, tasteful floral arrangements, branded event backdrop with golden metallic confetti raining down, audience in foreground seats mid-applause, warm ambient lighting throughout. Dominant warm golden spotlight from directly above creates glamorous downward shadows on faces and bodies. Confetti catches light midair. Subjects cast sharp shadows onto the stage floor. Confetti pieces land on shoulders and hair — physically present within the scene. No halo, no edge artifacts.

Sony A1 85mm f/1.8, ultra photorealistic, luxury event photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'ad-celebration',
          name: 'Celebration',
          gradient: 'linear-gradient(135deg, #2d0066, #110033)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo celebrating together at a grand corporate annual day party. For [GENDER], replace booth outfit with elegant party attire — a cocktail suit or party dress. Each subject holds a champagne flute with a natural joyful expression. Full body visible.

Grand corporate party venue at night — dramatic purple and blue uplighting, large company logo projected on one wall, balloon clusters and floral installations overhead, hundreds of guests celebrating in background, DJ setup to one side, multicolored confetti and metallic streamers mid-burst from confetti cannons around subjects. Purple and blue uplight from floor creates dramatic colored shadows on faces from below. Overhead warm spotlights provide key illumination. Confetti suspended at natural falling angles — some resting on shoulders and hair. No halo, no edge artifacts.

Nikon D6 35mm f/1.8, ultra photorealistic, corporate event party photography, 8K.

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
      id: 'space',
      name: 'Sci-Fi Space',
      icon: '🚀',
      gradient: 'linear-gradient(135deg, #000033, #000066, #0000aa)',
      scenes: [
        {
          id: 'sf-astronaut',
          name: 'NASA Astronaut',
          gradient: 'linear-gradient(135deg, #000033, #001a66)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as NASA astronauts aboard the International Space Station with Earth visible through the observation window. For [GENDER], replace booth outfit with a realistic NASA EMU spacesuit or blue NASA flight suit with mission patches and American flag on shoulder. All subjects float or stand together in the ISS, full body visible.

ISS Cupola observation module interior — curved white panels, handrails and equipment racks, laptops in bungee mounts, pouches floating loosely. The large oval Cupola window shows Earth from 400km — ocean curvature, white cloud formations, thin blue atmosphere line. Weightless posture — subjects floating slightly, hair gently lifted. Cool-white LED overhead panels provide even scientific white light.

Nikon D5 24mm f/2.8, ultra photorealistic, NASA documentary photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'sf-mars',
          name: 'Mars Explorer',
          gradient: 'linear-gradient(135deg, #4d1a00, #8B2500)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as Mars explorers standing on the Martian surface. For [GENDER], replace booth outfit with a realistic Mars exploration pressure suit — white and orange full-body suit with clear visor helmet, mission patches, air supply backpack and equipment pouches. Full body visible.

Red-orange rocky terrain with boulder fields and shallow craters, iron oxide dust. Sky is correctly dusty orange-pink — NOT blue. NASA habitat module and pressurized rover on the horizon. Mission flag planted nearby. Earth faintly visible as a pale blue dot in the sky. Subjects cast well-defined orange-tinted shadows across the red rocky soil behind them. Martian orange sky provides a distinctly warm orange ambient fill from above.

Canon R5 35mm f/5.6, ultra photorealistic, cinematic sci-fi photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'sf-spaceship',
          name: 'Spaceship Pilot',
          gradient: 'linear-gradient(135deg, #000022, #000044)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as pilots and crew in the cockpit of a futuristic interstellar spacecraft. For [GENDER], replace booth outfit with a sleek futuristic flight suit — charcoal grey with navy and white accents, mission insignia patches, thin communication earpiece. All subjects seated in pilot chairs or standing at control stations, full body visible.

Curved panoramic wraparound windshield showing deep space — dense star field with a purple-blue-gold nebula. Holographic navigation displays floating in mid-air with star charts and telemetry. Physical control panels with backlit buttons and joysticks. Interior: brushed aluminum and carbon fiber, blue-white accent lighting strips, ambient blue glow from displays. Cool blue-white ambient overhead strips and varying glow of holographic displays emit blue, green and white light reflecting on faces and suits.

ARRI ALEXA 35mm anamorphic, ultra photorealistic, cinematic sci-fi with subtle anamorphic lens flares, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'sf-alien',
          name: 'Alien World',
          gradient: 'linear-gradient(135deg, #1a0033, #330066)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as space explorers standing on the surface of an exotic alien planet. For [GENDER], replace booth outfit with a futuristic space explorer suit — sleek matte black and silver, helmet visor up showing face, mission insignia and breathing apparatus. Full body visible.

Towering crystalline mineral formations in translucent purple and cyan glowing faintly from within, deep violet-magenta sky with two distinct moons, strange bioluminescent plant-like organisms with glowing filaments, alien cityscape barely visible on the horizon. Three competing light sources: warm orange sunlight from the primary star on one side, cool blue-violet ambient sky fill from above, and bioluminescent cyan and magenta glow from nearby crystal formations. This three-way colored lighting reflects faithfully on all surfaces of subjects' suits and faces. Contact shadows under boots.

Sony A7R V 50mm f/2.0, ultra photorealistic, cinematic sci-fi world photography, 8K.

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
        {
          id: 'wr-knight',
          name: 'Medieval Knight',
          gradient: 'linear-gradient(135deg, #1a1a1a, #2a2a3a)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as noble medieval knights in a castle courtyard. For [GENDER], replace booth outfit with gleaming polished full Gothic plate armor — mirror-polished steel breastplate, pauldrons, gauntlets and greaves. Great helm tucked under one arm, broadsword in the other, surcoat with royal crest. Full body visible.

Grand medieval castle courtyard at dusk — stone cobblestone ground, towering grey stone castle walls with crenellations, iron torch brackets with burning torches, a stone well and armoury in the background, royal banner on the battlements, deep indigo blue dusk sky above. Warm orange torch flicker from wall sconces is the primary key light — creating warm amber light on polished plate armor with multiple bright specular reflections. The mirror-polished breastplate shows distorted reflections of the courtyard.

Sony A7 III 85mm f/1.8, ultra photorealistic, Kingdom of Heaven cinematic photography, 8K.

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
        {
          id: 'mu-grammy',
          name: 'Grammy Winner',
          gradient: 'linear-gradient(135deg, #C9A84C, #4d3a00)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as Grammy Award winners on the Grammy Awards stage. For [GENDER], replace booth outfit with glamorous award show attire — a designer gown or highly stylized suit. Each subject holds a golden gramophone Grammy trophy raised above their head in triumph. Full body visible.

Grammy Awards stage — large illuminated Grammy gramophone motif on backdrop, warm amber and gold stage design, vast arena audience of 20,000 musicians and celebrities on their feet applauding, gold and silver metallic confetti frozen in the air. A massive theatrical follow-spot from the lighting grid creates a brilliantly bright circle of light on subjects — extremely high contrast, subjects brilliantly lit with the stage behind relatively darker.

Canon 300mm f/2.8 telephoto, ultra photorealistic, premium award show photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'mu-video',
          name: 'Music Video Star',
          gradient: 'linear-gradient(135deg, #1a1a00, #3d3d00)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as the stars of a high-production music video shoot. For [GENDER], replace booth outfit with high-fashion music video attire — designer couture pieces, bold colors and statement accessories for a luxury music video. All subjects perform naturally to camera, full body visible.

Dramatic neon light installation of the artist name behind subjects, geometric LED tube light rigs and large circular neon hoops as set decor, a professional ARRI cinema camera on a dolly to one side, smoke machine haze hanging low, a Rolls Royce or Bentley parked to one side as prop, dark moody and editorial overall aesthetic. Large LED neon tubes in pink, blue and amber at various distances from subjects create multiple colored light fills.

ARRI ALEXA Mini LF anamorphic, ultra photorealistic, premium music video director of photography style, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
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
        {
          id: 'sp-f1',
          name: 'Formula 1 Champion',
          gradient: 'linear-gradient(135deg, #330000, #660000)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as Formula 1 World Championship winners on the F1 podium. For [GENDER], replace booth outfit with a Formula 1 nomex fireproof race suit in Ferrari red, Mercedes silver or McLaren orange, with sponsor logos, team cap and balaclava rolled down. Subjects on the podium holding a trophy with champagne being sprayed. Full body visible.

Three-tier podium with P1, P2, P3 positions, massive F1 sponsor backdrop, grandstands packed with tens of thousands of fans waving team flags, racing cars visible in pit lane behind. Magnum champagne bottles being sprayed — champagne mist and spray frozen in the air. Confetti cannons firing team colors.

Canon 1DX Mark III 200mm f/2.8, ultra photorealistic, Formula 1 official motorsport photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
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
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as Bollywood celebrities at a grand Mumbai movie premiere. For [GENDER], replace booth outfit with glamorous Bollywood premiere attire — Indian designer lehenga, saree or Indo-western fusion gown for women, or designer sherwani with Indian embroidery for men. All subjects stand together on the red carpet, full body visible.

Custom step-and-repeat backdrop with Filmfare and film studio logos, paparazzi pit with cameras firing continuously, TV entertainment channel cameras, film stars and celebrities in the background, intensely glamorous warm event lighting atmosphere. Warm amber event uplighting from the step-and-repeat creates warm glow on subjects from behind and sides. Multiple simultaneous paparazzi camera flashes create intense white burst lights from the front — characteristic Bollywood premiere photography. Indian fabric embroidery catches flash light on sequins and zari work.

Nikon D850 85mm f/1.8, ultra photorealistic, Bollywood entertainment photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'in-isro',
          name: 'ISRO Scientist',
          gradient: 'linear-gradient(135deg, #001a33, #003366)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as ISRO scientists at the ISRO Mission Control Center during a landmark mission. For [GENDER], replace booth outfit with ISRO scientist attire — dark navy ISRO logo jacket or white shirt with ISRO mission badge, formal trousers or saree/churidar for women. All subjects stand confidently at mission control consoles, full body visible.

ISRO Mission Control Centre at ISTRAC Bengaluru — rows of workstations with multiple screens showing telemetry, orbital plots and rocket trajectory visualizations, massive projection screen on far wall showing GSLV rocket launch, Chandrayaan-3 or Gaganyaan mission logo, India's map and real-time mission data, Indian Tricolor flag prominently displayed. Cool fluorescent white overhead lighting, augmented by intense blue-white glow from multiple monitor screens.

Canon R6 35mm f/2.8, ultra photorealistic, documentary journalism photography, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'in-maharaja',
          name: 'Maharaja',
          gradient: 'linear-gradient(135deg, #4d2600, #8B4500)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo as Maharajas and Maharanis in a grand Rajasthani palace. For [GENDER], replace booth outfit with ornate traditional Indian royal attire — richly embroidered sherwani with jeweled turban and pearl necklaces for men, or grand Benarasi silk saree with polki diamond jewelry, maang tikka and nath for women. Full body visible.

Grand Rajasthani royal palace in the style of Udaipur or Jaipur City Palace — ornate arched corridors with carved sandstone jali screens, walls covered in Rajput miniature painting murals, marble floors with inlaid patterns, massive brass oil lamps and crystal chandeliers, carved silver throne in background, view of a Rajasthani lake or fort through arched windows in golden light.

Nikon Z7 II 85mm f/1.8, ultra photorealistic, royal portrait photography in the tradition of Raja Ravi Varma, 8K.

ABSOLUTE PRIORITY: Preserve each person's real facial identity above everything else. The face must be photorealistic and pixel-faithful — unmistakably the same person from the photo, never painted or generated.`
        },
        {
          id: 'in-republic',
          name: 'Republic Day',
          gradient: 'linear-gradient(135deg, #FF9933, #004d00)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo at the Republic Day parade at Kartavya Path, New Delhi. For [GENDER], replace booth outfit with formal Indian traditional attire — a formal achkan or kurta-pyjama for men, formal silk salwar kameez or saree in saffron, white or green for women — with a proud, dignified bearing. Full body visible.

Kartavya Path, New Delhi on 26th January — India Gate prominently visible in the background against a clear blue winter sky, the wide ceremonial boulevard flanked by thousands of Indian citizens waving Tricolor flags, military parade passing in the distance with army contingents, tanks and missile systems, military bands playing. Tricolor flags everywhere.

Canon 1DX Mark III 135mm f/2.0, ultra photorealistic, Republic Day official photography, 8K.

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
          id: 'lx-supercar',
          name: 'Supercar',
          gradient: 'linear-gradient(135deg, #1a0000, #330000)',
          prompt: `CRITICAL IDENTITY INSTRUCTION — READ FIRST: The people in the provided photo are real individuals. Preserve their exact facial identity with absolute fidelity — keep each face IDENTICAL to the photo: same eye shape, eye color, eyebrows, nose shape and width, mouth and lip shape, jawline, cheekbones, chin, skin tone, real photographic skin texture with visible pores and natural detail, and hairstyle. This must look like the SAME REAL PERSON from the photo — a real photograph, NOT smooth, airbrushed, painted, illustrated, rendered or CGI. Do NOT generate a new or different face. Do NOT beautify, slim, smooth or change age. Match each person's gender and natural body build exactly as they appear. Retain the exact photographic likeness as if compositing the real face into the scene.

TASK: Place this exact person into the scene below. Their face and identity stay completely locked — only clothing, pose and environment change.

Place every person visible in this booth photo with an exotic supercar at a dramatic location. For [GENDER], replace booth outfit with high-end designer casual fashion — premium fitted clothing, designer sunglasses, luxury watch on wrist. Subjects lean confidently against or stand beside the supercar in natural poses. Full body visible.

A Lamborghini Huracán in brilliant rosso corsa red or a Ferrari SF90 Stradale, parked on a dramatic deserted mountain hairpin road at sunset — mirror-polished body panels to perfection, sweeping mountain valley visible far below, golden sunset sky with long dramatic clouds stretching to the horizon. Golden sunset rim light hits the mirror-polished car bodywork creating brilliant specular highlights and reflections of the orange sky. Subjects receive warm golden hour backlight rim and cooler sky fill from front.

Canon 1DX Mark III 50mm f/2.8, ultra photorealistic, premium automotive advertising photography, 8K.

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
      id: 'tamilnadu',
      name: 'Tamil Nadu',
      icon: '🌟',
      gradient: 'linear-gradient(135deg, #4d1a00, #8B0000, #FF9933)',
      scenes: [
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
        },
      ]
    }
  ]
};

if (typeof module !== 'undefined') module.exports = TEMPLATES;