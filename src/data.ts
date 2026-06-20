/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Import generated imagery to display on the page
import ayumiAvatar from "@/src/assets/images/ayumi_avatar_1781930483691.jpg";
import ugcPandaHat from "@/src/assets/images/ugc_panda_hat_1781930501623.jpg";
import gothStarBlade from "@/src/assets/images/goth_star_blade_1781930519791.jpg";
import gameThumbnail from "@/src/assets/images/game_thumbnail_1781930537198.jpg";

export interface SocialLink {
  platform: string;
  username: string;
  url: string;
  iconName: string;
}

export interface UgcProduct {
  id: string;
  name: string;
  description: string;
  category: "Head" | "Face" | "Back" | "Accessory" | "Worn";
  price: number;
  image: string;
  status: "Available" | "Limited Edition" | "Featured" | "Upcoming";
  link: string;
  salesCount: string;
}

export interface ModelAsset {
  id: string;
  name: string;
  category: "Weapons" | "Environment" | "Props" | "Characters";
  polygonCount: string;
  software: string[];
  description: string;
  image: string;
  interactiveDetails?: {
    textures: string;
    rigged: boolean;
    animated: boolean;
  };
}

export interface GameProject {
  id: string;
  title: string;
  role: string;
  genre: string;
  visits: string;
  activePlayers: string;
  rating: string;
  platforms: string[];
  description: string;
  thumbnail: string;
  features: string[];
  playLink: string;
}

export interface GfxItem {
  id: string;
  title: string;
  category: "Game Thumbnail" | "Game Icon" | "Logo Design" | "Render";
  resolution: string;
  image: string;
  softwareUsed: string[];
  description: string;
}

export interface SfxSample {
  id: string;
  title: string;
  duration: string;
  category: "UI Sync" | "Combat" | "Magic" | "Ambient";
  description: string;
  // Synthesizer parameters for runtime playback
  soundConfig: {
    type: "sine" | "square" | "sawtooth" | "triangle";
    frequency: number;
    delay: number;
    duration: number;
    effects?: "vibrato" | "echo" | "phaser" | "none";
  }[];
}

export interface CommissionTier {
  id: string;
  name: string;
  priceRange: string;
  timeframe: string;
  description: string;
  deliverables: string[];
  status: "Open" | "Waitlist" | "Closed";
}

export const USER_INFO = {
  name: "AyumiHeartPanda",
  title: "UGC Creator • Game Developer • 3D Modeler • SFX & GFX Artist",
  tagline: "Bridging cute aesthetics with sharp goth edges across avatars, games, and experiences.",
  avatar: ayumiAvatar,
  aboutLeft: "Hey there! I am Ayumi, a versatile Roblox-focused creator specializing in designing eye-catching, highly optimized 3D assets, custom game components, SFX, and promotional GFX. I combine adorable, cozy panda elements with a clean black-and-white, dark, star-encrusted goth aesthetic.",
  aboutRight: "With over 6 years of experience working in Blender and Roblox Studio, my work has powered numerous trending experiences, earning millions of play-sessions. Whether you're looking for ultra-optimized UGC accessories, high-fidelity map design, tailor-made sounds, or jaw-dropping icons—I make it happen.",
  metrics: [
    { value: "N/A", label: "Total UGC Sales" },
    { value: "8M+", label: "Partner Game Visits" },
    { value: "100+", label: "Accessory Catalog Items" },
    { value: "99.2%", label: "Client Satisfaction" }
  ],
  ugcTitle: "Virtual Accessory Studio",
  ugcDesc: "Browsing virtual Roblox catalog items manufactured, skinned, and distributed by Ayumi. Tap any item to inspect its polygons and details.",
  modelTitle: "3D Asset Vault",
  modelDesc: "Showcase of low-poly character attachments, environment props, and assets custom modeled, UV unwrapped, and handpainted or baked in Substance.",
  gameTitle: "Roblox Game Development",
  gameDesc: "Immersive, high-performance virtual experiences programmed, scripted, or visually directed within the Luau Luau ecosystem.",
  gfxTitle: "GFX Marketing Design",
  gfxDesc: "Eye-catching graphic representations of virtual characters. Crafted with raytraced path lighting in Blender Cycles and painted in Photoshop.",
  sfxTitle: "Dynamic SFX Lounge",
  sfxDesc: "A studio lounge displaying original soundscapes, button sound bites, UI interface clicks, character feedback vocals, and atmospheric environment loops."
};

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: "Twitter / X", username: "@AyumiHeartPanda", url: "https://x.com/AyumiHeartPanda", iconName: "Twitter" },
  { platform: "Roblox", username: "AyumiHeartPanda", url: "https://www.roblox.com/users/3485534721/profile", iconName: "User" },
  { platform: "Gmail / Contact", username: "davevenzon789@gmail.com", url: "mailto:davevenzon789@gmail.com", iconName: "Mail" }
];

export const UGC_PRODUCTS: UgcProduct[] = [
  {
    id: "ugc-1",
    name: "Midnight Panda Star Beanie",
    description: "A cozy ribbed black-colored beanie displaying cute panda ears lined with glowing celestial stars and velvet ribbons.",
    category: "Head",
    price: 85,
    image: ugcPandaHat,
    status: "Featured",
    link: "https://www.roblox.com/catalog",
    salesCount: "120K+"
  },
  {
    id: "ugc-2",
    name: "Heart-Bond Cyber Wings",
    description: "Futuristic neon-rimmed back accessories that pulse gently to the beat. Inspired by virtual cyber-goth runways.",
    category: "Back",
    price: 120,
    image: "https://picsum.photos/seed/cyberwings/300/300",
    status: "Available",
    link: "https://www.roblox.com/catalog",
    salesCount: "45K+"
  },
  {
    id: "ugc-3",
    name: "Cute-Goth Studded Medical Mask",
    description: "An essential anti-viral mask, detailed with soft leather panda nose emblems and metal star rivets.",
    category: "Face",
    price: 65,
    image: "https://picsum.photos/seed/punkmask/300/300",
    status: "Available",
    link: "https://www.roblox.com/catalog",
    salesCount: "89K+"
  },
  {
    id: "ugc-4",
    name: "Dark Cosmic Teddy Headpiece",
    description: "Limited collector series containing a stitched black velvet teddy bear head nesting amongst sparkling stars.",
    category: "Head",
    price: 250,
    image: "https://picsum.photos/seed/gothbear/300/300",
    status: "Limited Edition",
    link: "https://www.roblox.com/catalog",
    salesCount: "12K+"
  },
  {
    id: "ugc-5",
    name: "Lumina Goth Hair Ornaments",
    description: "Dangling high-contrast hairpins with starry chain charms that swing accurately with Roblox physics.",
    category: "Accessory",
    price: 70,
    image: "https://picsum.photos/seed/starhairpins/300/300",
    status: "Available",
    link: "https://www.roblox.com/catalog",
    salesCount: "98K+"
  },
  {
    id: "ugc-6",
    name: "Onyx Panda Shoulder Pal",
    description: "A tiny shoulder-perching panda companion, complete with custom anims to peer curiously around your character.",
    category: "Accessory",
    price: 90,
    image: "https://picsum.photos/seed/shoulderpanda/300/300",
    status: "Upcoming",
    link: "https://www.roblox.com/catalog",
    salesCount: "Reservations Open"
  }
];

export const MODEL_ASSETS: ModelAsset[] = [
  {
    id: "model-1",
    name: "Midnight Eclipse Blade",
    category: "Weapons",
    polygonCount: "2,420 Tris (Highly Optimized)",
    software: ["Blender", "Substance Painter"],
    description: "A gorgeous cyber-fantasy blade inspired by stellar eclipses, styled with clean mesh-flow, custom specular highlights, and an active neon edge glow texture.",
    image: gothStarBlade,
    interactiveDetails: {
      textures: "4K PBR (Ambient Occlusion, Roughness, Metallic, Emissive)",
      rigged: true,
      animated: true
    }
  },
  {
    id: "model-2",
    name: "Lofi Panda Bedroom Set",
    category: "Environment",
    polygonCount: "8,950 Tris (Modular)",
    software: ["Blender", "ZBrush"],
    description: "A modular, isometric furniture set containing low-poly gaming chairs, panda rugs, star-projecting lava lamps, and customized console setups optimized for high-performance roleplay games.",
    image: "https://picsum.photos/seed/lofistudio/400/400",
    interactiveDetails: {
      textures: "2K Atlased (Single-drawcall optimized)",
      rigged: false,
      animated: false
    }
  },
  {
    id: "model-3",
    name: "Eclipsed Celestial Crown",
    category: "Characters",
    polygonCount: "980 Tris",
    software: ["Blender", "Photoshop"],
    description: "An ethereal star corona crown. Utilizes carefully painted gradients to mimic realistic reflections without heavy raytracing overlays.",
    image: "https://picsum.photos/seed/stellarwings/400/400",
    interactiveDetails: {
      textures: "1K Handpainted",
      rigged: true,
      animated: false
    }
  },
  {
    id: "model-4",
    name: "Stellar Goth Streetlamp",
    category: "Props",
    polygonCount: "1,150 Tris",
    software: ["Blender"],
    description: "A gothic lanterns model adapted for park and city layouts, utilizing warm candle-flicker animations and custom iron scrollwork detailing.",
    image: "https://picsum.photos/seed/streetlamp/400/400",
    interactiveDetails: {
      textures: "512px Tileable",
      rigged: false,
      animated: true
    }
  }
];

export const GAME_PROJECTS: GameProject[] = [
  {
    id: "game-1",
    title: "Lumina Chronicles: Goth World",
    role: "Co-Owner, Lead UI Developer & Environment Artist",
    genre: "Survival Fantasy Action RPG",
    visits: "42.5M+",
    activePlayers: "1.2K+ Concurrent",
    rating: "94.5% 👍",
    platforms: ["PC", "Mobile", "Console", "VR"],
    description: "An action-adventure RPG set in an ethereal glowing forest overrun by shadowy celestial monsters. Players craft legendary panda gear, learn cosmic spells, and construct customized sanctuaries.",
    thumbnail: gameThumbnail,
    features: [
      "Dynamic day/night system with physics-affected starlight glows.",
      "Fully customized, animated inventory/shop HUD with sleek visual transitions.",
      "Custom procedural weapons modularly customized by 3D asset parts."
    ],
    playLink: "https://www.roblox.com/games"
  },
  {
    id: "game-2",
    title: "Panda Goth Hangout & Runway",
    role: "Solo Creator (Scripts, Custom Assets, UI/GFX)",
    genre: "Social Hangout & Fashion Catalog",
    visits: "18.2M+",
    activePlayers: "500+ Concurrent",
    rating: "96.2% 👍",
    platforms: ["PC", "Mobile", "Console"],
    description: "A safe-space social hub where Roblox players try out UGC items, showcase customized goth-panda avatars, compete in friendly runway pageants, and socialize with custom spatial voice chat.",
    thumbnail: "https://picsum.photos/seed/robloxhall/800/450",
    features: [
      "In-game multi-item fitting room connecting directly to Roblox Purchase Prompt system API.",
      "Interactive DJ table allowing full custom sequence generation through spatial volume grids.",
      "Rich particle effects systems displaying trailing stardust trails on player avatars."
    ],
    playLink: "https://www.roblox.com/games"
  }
];

export const GFX_GALLERY: GfxItem[] = [
  {
    id: "gfx-1",
    title: "Celestial Quest Game Thumbnail",
    category: "Game Thumbnail",
    resolution: "1920x1080 (Cinema-HD)",
    image: gameThumbnail,
    softwareUsed: ["Blender (Cycles Premium)", "Adobe Photoshop", "Lightroom"],
    description: "An epic, highly cinematic title screen display. Highlights deep contrasting moonlit ambiance, soft volume fog, and striking neon spellcraft highlights."
  },
  {
    id: "gfx-2",
    title: "Panda Goth App Icon branding",
    category: "Game Icon",
    resolution: "512x512",
    image: ayumiAvatar,
    softwareUsed: ["Blender", "Adobe Illustrator", "Photoshop"],
    description: "A bold, graphic mascot branding render. High-contrast white and dark tones, framed key outlines, optimal for roblox explorer icon recognition."
  },
  {
    id: "gfx-3",
    title: "Void-born Scythe showcase graphic",
    category: "Render",
    resolution: "1080x1350 (Social Showcase)",
    image: gothStarBlade,
    softwareUsed: ["Blender Cycles", "Photoshop CC"],
    description: "Social media conceptual advertisement showing the high-poly wireframes melting digitally into finished custom weapon designs."
  }
];

export const SFX_SAMPLES: SfxSample[] = [
  {
    id: "sfx-1",
    title: "Ethereal Star Sparkle Pop",
    duration: "1.2s",
    category: "Magic",
    description: "A cozy high-pitch starlight shimmer audio cue for item pickups, quest completion pops, and interface menu opens.",
    soundConfig: [
      { type: "sine", frequency: 1200, delay: 0, duration: 0.1 },
      { type: "triangle", frequency: 2400, delay: 0.05, duration: 0.2 },
      { type: "sine", frequency: 3200, delay: 0.1, duration: 0.3 }
    ]
  },
  {
    id: "sfx-2",
    title: "Cosmic Blade Slash (Neon)",
    duration: "0.8s",
    category: "Combat",
    description: "A sweeping energy wind-cutter surge. Blends high sawtooth pitch transitions with low-frequency wind gusts.",
    soundConfig: [
      { type: "sawtooth", frequency: 180, delay: 0, duration: 0.3 },
      { type: "sawtooth", frequency: 650, delay: 0, duration: 0.4 },
      { type: "sine", frequency: 90, delay: 0.1, duration: 0.3 }
    ]
  },
  {
    id: "sfx-3",
    title: "Sub-harmonic Void Pulse",
    duration: "2.1s",
    category: "Ambient",
    description: "A deep atmospheric space hum. Ideal for transitions, loading screens, and entering custom goth-haunted dungeons.",
    soundConfig: [
      { type: "sine", frequency: 55, delay: 0, duration: 1.5 },
      { type: "triangle", frequency: 110, delay: 0.1, duration: 1.8 }
    ]
  },
  {
    id: "sfx-4",
    title: "Retro Goth Pixel Blip",
    duration: "0.4s",
    category: "UI Sync",
    description: "A classic retro game UI hover sound. A clean square-wave double pulse that signals action triggers.",
    soundConfig: [
      { type: "square", frequency: 620, delay: 0, duration: 0.05 },
      { type: "square", frequency: 840, delay: 0.04, duration: 0.12 }
    ]
  }
];

export const COMMISSION_TIERS: CommissionTier[] = [
  {
    id: "tier-1",
    name: "UGC Accessory Model",
    priceRange: "R$ 15,000 - 30,000 / $120 - 250",
    timeframe: "3 - 5 Business Days",
    description: "Single accessory model optimized specifically for Roblox's strict UGC limits (<4K tris, 1 texture map). Comes with full custom mesh creation and paint layouts.",
    deliverables: [
      "Custom-tailored .FBX mesh file",
      "1024x1024 PNG Texture map",
      "Roblox accessory asset wrapper setup",
      "Up to 2 style refinements"
    ],
    status: "Open"
  },
  {
    id: "tier-2",
    name: "High-End Weapon & Rig Set",
    priceRange: "R$ 40,000 - 80,000 / $300 - 600",
    timeframe: "7 - 10 Business Days",
    description: "Premium fantasy or scifi melee or ranged weapons modeled, unwrapped, textured, skinned, and fully custom-rigged for active combat games.",
    deliverables: [
      "Detailed .FBX model with complete joint rig hierarchy",
      "2K / 4K PBR material set (PBR and Mobile-Compatible maps)",
      "Unwrap UV layouts for seamless recoloring",
      "Basic Slash/Sheathe preview animation loops"
    ],
    status: "Waitlist"
  },
  {
    id: "tier-3",
    name: "Custom GFX Branding Suite",
    priceRange: "R$ 25,000+ / $200+",
    timeframe: "5 - 7 Business Days",
    description: "Branding suite for game projects. Includes 1 Cinematic High-Res Cover thumbnail, 1 Mascot Profile Icon, and customized UI button template assets.",
    deliverables: [
      "16:9 4K resolution cinematic scene GFX",
      "1:1 circularized mascot profile emblem GFX",
      "Fully layered Adobe Photoshop .PSD source files",
      "Custom font styling guides"
    ],
    status: "Open"
  }
];
