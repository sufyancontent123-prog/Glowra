import { ColorThemePreset, ColorSettings, SoundTheme, SiteCustomization } from './types';

export interface ThemePresetOption {
  id: ColorThemePreset;
  name: string;
  tagline: string;
  primary: string;
  secondary: string;
  canvas: string;
  heading: string;
  body: string;
  colors: ColorSettings;
}

export const COLOR_THEME_PRESETS: ThemePresetOption[] = [
  {
    id: 'blush-rose',
    name: 'Blush Rosé',
    tagline: 'Romantic beauty glow with delicate pinks and berry accents',
    primary: '#db2777',
    secondary: '#f472b6',
    canvas: '#fff5f7',
    heading: '#18181b',
    body: '#3f3f46',
    colors: {
      preset: 'blush-rose',
      headingColor: '#18181b',
      bodyTextColor: '#3f3f46',
      mutedTextColor: '#71717a',
      primaryAccentColor: '#db2777',
      secondaryAccentColor: '#f472b6',
      canvasBgColor: '#fff5f7',
      cardBgColor: '#ffffff',
      heroBgGradientStart: '#ec4899',
      heroBgGradientEnd: '#e11d48',
      promoBanner1Bg: '#fce7f3',
      promoBanner2Bg: '#f43f5e',
      badgeBgColor: '#fdf2f8',
      badgeTextColor: '#db2777'
    }
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Champagne & Gold',
    tagline: 'High-end prestigious aesthetic with rich warm metallics and charcoal',
    primary: '#d97706',
    secondary: '#fbbf24',
    canvas: '#fdfbf7',
    heading: '#1c1917',
    body: '#44403c',
    colors: {
      preset: 'luxury-gold',
      headingColor: '#1c1917',
      bodyTextColor: '#44403c',
      mutedTextColor: '#78716c',
      primaryAccentColor: '#d97706',
      secondaryAccentColor: '#fbbf24',
      canvasBgColor: '#fdfbf7',
      cardBgColor: '#ffffff',
      heroBgGradientStart: '#b45309',
      heroBgGradientEnd: '#78350f',
      promoBanner1Bg: '#fef3c7',
      promoBanner2Bg: '#92400e',
      badgeBgColor: '#fffbeb',
      badgeTextColor: '#b45309'
    }
  },
  {
    id: 'royal-violet',
    name: 'Royal Amethyst & Orchid',
    tagline: 'Majestic purple hues with lavender luminescence',
    primary: '#7c3aed',
    secondary: '#a78bfa',
    canvas: '#faf5ff',
    heading: '#18181b',
    body: '#3f3f46',
    colors: {
      preset: 'royal-violet',
      headingColor: '#18181b',
      bodyTextColor: '#3f3f46',
      mutedTextColor: '#71717a',
      primaryAccentColor: '#7c3aed',
      secondaryAccentColor: '#a78bfa',
      canvasBgColor: '#faf5ff',
      cardBgColor: '#ffffff',
      heroBgGradientStart: '#8b5cf6',
      heroBgGradientEnd: '#6d28d9',
      promoBanner1Bg: '#f3e8ff',
      promoBanner2Bg: '#5b21b6',
      badgeBgColor: '#faf5ff',
      badgeTextColor: '#7c3aed'
    }
  },
  {
    id: 'emerald-spa',
    name: 'Botanical Emerald & Sage',
    tagline: 'Pure organic herbal freshness with calming eucalyptus tones',
    primary: '#059669',
    secondary: '#34d399',
    canvas: '#f0fdf4',
    heading: '#064e3b',
    body: '#1f2937',
    colors: {
      preset: 'emerald-spa',
      headingColor: '#064e3b',
      bodyTextColor: '#1f2937',
      mutedTextColor: '#4b5563',
      primaryAccentColor: '#059669',
      secondaryAccentColor: '#34d399',
      canvasBgColor: '#f0fdf4',
      cardBgColor: '#ffffff',
      heroBgGradientStart: '#059669',
      heroBgGradientEnd: '#065f46',
      promoBanner1Bg: '#dcfce7',
      promoBanner2Bg: '#047857',
      badgeBgColor: '#ecfdf5',
      badgeTextColor: '#059669'
    }
  },
  {
    id: 'sunset-coral',
    name: 'Sunset Coral & Peach',
    tagline: 'Sun-drenched Mediterranean warmth with radiant coral energy',
    primary: '#ea580c',
    secondary: '#fb923c',
    canvas: '#fff7ed',
    heading: '#18181b',
    body: '#3f3f46',
    colors: {
      preset: 'sunset-coral',
      headingColor: '#18181b',
      bodyTextColor: '#3f3f46',
      mutedTextColor: '#71717a',
      primaryAccentColor: '#ea580c',
      secondaryAccentColor: '#fb923c',
      canvasBgColor: '#fff7ed',
      cardBgColor: '#ffffff',
      heroBgGradientStart: '#f97316',
      heroBgGradientEnd: '#c2410c',
      promoBanner1Bg: '#ffedd5',
      promoBanner2Bg: '#ea580c',
      badgeBgColor: '#fff7ed',
      badgeTextColor: '#ea580c'
    }
  },
  {
    id: 'ocean-breeze',
    name: 'Oceanic Sapphire & Glacier',
    tagline: 'Crisp, refreshing marine hydration aesthetic',
    primary: '#0284c7',
    secondary: '#38bdf8',
    canvas: '#f0f9ff',
    heading: '#0c4a6e',
    body: '#334155',
    colors: {
      preset: 'ocean-breeze',
      headingColor: '#0c4a6e',
      bodyTextColor: '#334155',
      mutedTextColor: '#64748b',
      primaryAccentColor: '#0284c7',
      secondaryAccentColor: '#38bdf8',
      canvasBgColor: '#f0f9ff',
      cardBgColor: '#ffffff',
      heroBgGradientStart: '#0ea5e9',
      heroBgGradientEnd: '#0369a1',
      promoBanner1Bg: '#e0f2fe',
      promoBanner2Bg: '#0284c7',
      badgeBgColor: '#f0f9ff',
      badgeTextColor: '#0284c7'
    }
  },
  {
    id: 'midnight-luxe',
    name: 'Midnight Luxe & Ruby',
    tagline: 'Deep dark elegance with crimson highlights and sleek contrast',
    primary: '#e11d48',
    secondary: '#fb7185',
    canvas: '#0f172a',
    heading: '#f8fafc',
    body: '#cbd5e1',
    colors: {
      preset: 'midnight-luxe',
      headingColor: '#f8fafc',
      bodyTextColor: '#cbd5e1',
      mutedTextColor: '#94a3b8',
      primaryAccentColor: '#e11d48',
      secondaryAccentColor: '#fb7185',
      canvasBgColor: '#0f172a',
      cardBgColor: '#1e293b',
      heroBgGradientStart: '#881337',
      heroBgGradientEnd: '#0f172a',
      promoBanner1Bg: '#1e293b',
      promoBanner2Bg: '#be123c',
      badgeBgColor: '#1e293b',
      badgeTextColor: '#fb7185'
    }
  },
  {
    id: 'minimal-mono',
    name: 'Modern Atelier Monochrome',
    tagline: 'Editorial high-fashion minimalist black & white with slate tones',
    primary: '#18181b',
    secondary: '#71717a',
    canvas: '#fafafa',
    heading: '#09090b',
    body: '#27272a',
    colors: {
      preset: 'minimal-mono',
      headingColor: '#09090b',
      bodyTextColor: '#27272a',
      mutedTextColor: '#71717a',
      primaryAccentColor: '#18181b',
      secondaryAccentColor: '#52525b',
      canvasBgColor: '#fafafa',
      cardBgColor: '#ffffff',
      heroBgGradientStart: '#27272a',
      heroBgGradientEnd: '#09090b',
      promoBanner1Bg: '#f4f4f5',
      promoBanner2Bg: '#18181b',
      badgeBgColor: '#f4f4f5',
      badgeTextColor: '#18181b'
    }
  }
];

export const SOUND_THEMES_INFO: {
  id: SoundTheme;
  name: string;
  badge: string;
  description: string;
  icon: string;
}[] = [
  {
    id: 'crystal',
    name: 'Soft Crystal Chimes',
    badge: 'Signature',
    description: 'Delicate celestial glass bells and warm harmonic chimes. Elegant and luxurious.',
    icon: '✨'
  },
  {
    id: 'modern',
    name: 'Modern Chic UI',
    badge: 'Clean',
    description: 'Snappy acoustic pops, tactile micro-taps and aerodynamic swooshes. Highly responsive.',
    icon: '💎'
  },
  {
    id: 'spa',
    name: 'ASMR Zen & Spa',
    badge: 'Relaxing',
    description: '432Hz harmonic Tibetan bowls, soothing resonant tones, and gentle ocean swells.',
    icon: '🌸'
  },
  {
    id: 'playful',
    name: 'Playful & Vibrant',
    badge: 'Upbeat',
    description: 'Bubbly cheerful pops, energetic celebratory chimes, and joyous feedback.',
    icon: '🎈'
  },
  {
    id: 'minimal',
    name: 'Subtle & Minimal',
    badge: 'Whisper',
    description: 'Ultra-low profile micro-clicks for a quiet, distraction-free environment.',
    icon: '🍃'
  },
  {
    id: 'muted',
    name: 'Silent / Off',
    badge: 'Muted',
    description: 'Completely disable all audio sound effects across the website.',
    icon: '🔇'
  }
];

export interface CuratedImagePreset {
  id: string;
  title: string;
  category: string;
  url: string;
  tag: string;
}

export const CURATED_IMAGE_LIBRARY: CuratedImagePreset[] = [
  // Hero Models
  {
    id: 'hero-model-1',
    title: 'Glow Beauty Model with Serum',
    category: 'Hero & Models',
    url: '/images/hero_beauty_model_1786879155700.png',
    tag: 'Default Hero'
  },
  {
    id: 'hero-model-2',
    title: 'Natural Daylight Radiant Skin',
    category: 'Hero & Models',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=900&auto=format&fit=crop',
    tag: 'Natural Dew'
  },
  {
    id: 'hero-model-3',
    title: 'High-Fashion Glam Portrait',
    category: 'Hero & Models',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=900&auto=format&fit=crop',
    tag: 'Glamour'
  },
  {
    id: 'hero-model-4',
    title: 'Minimalist Clean Skincare Model',
    category: 'Hero & Models',
    url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=900&auto=format&fit=crop',
    tag: 'Clean Girl'
  },
  {
    id: 'hero-model-5',
    title: 'Golden Hour Sunset Glow',
    category: 'Hero & Models',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=900&auto=format&fit=crop',
    tag: 'Warm Amber'
  },

  // Skincare & Droppers
  {
    id: 'skin-dropper-1',
    title: 'Peach Extract Dropper Bottle',
    category: 'Skincare Serums',
    url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=900&auto=format&fit=crop',
    tag: 'Peach 70'
  },
  {
    id: 'skin-dropper-2',
    title: 'Botanical Vitamin C Pipette',
    category: 'Skincare Serums',
    url: 'https://images.unsplash.com/photo-1608248597359-005cb2346743?q=80&w=900&auto=format&fit=crop',
    tag: 'Brightening'
  },
  {
    id: 'skin-dropper-3',
    title: 'Amber Glass Anti-Aging Elixir',
    category: 'Skincare Serums',
    url: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=900&auto=format&fit=crop',
    tag: 'Luxury Dropper'
  },
  {
    id: 'skin-dropper-4',
    title: 'Soothing Facial Cleanser & Toner',
    category: 'Skincare Serums',
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=900&auto=format&fit=crop',
    tag: 'Sensitive Care'
  },

  // Promo Banners & Bundles
  {
    id: 'banner-bottle-1',
    title: 'Cosmetic Bottles & Gold Accents',
    category: 'Banners & Bundles',
    url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=900&auto=format&fit=crop',
    tag: 'Promo Collection'
  },
  {
    id: 'banner-bundle-1',
    title: 'Complete 5-Piece Skincare Routine Kit',
    category: 'Banners & Bundles',
    url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=900&auto=format&fit=crop',
    tag: 'Essentials Kit'
  },
  {
    id: 'banner-launch-1',
    title: 'Rose Quartz & Peptide Cream Launch',
    category: 'Banners & Bundles',
    url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=900&auto=format&fit=crop',
    tag: 'Biggest Launch'
  },
  {
    id: 'banner-botanical-1',
    title: 'Rose Petals & Botanical Extracts',
    category: 'Banners & Bundles',
    url: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=900&auto=format&fit=crop',
    tag: 'Glow Secrets'
  },

  // Before & After
  {
    id: 'before-acne',
    title: 'Skin Before (Texture & Spots)',
    category: 'Before & After',
    url: '/images/skin_before_acne_1786879205572.jpg',
    tag: 'Before 1'
  },
  {
    id: 'after-glow',
    title: 'Skin After (14-Day Glass Glow)',
    category: 'Before & After',
    url: '/images/skin_after_glow_1786879190967.jpg',
    tag: 'After 1'
  },
  {
    id: 'before-dry',
    title: 'Dry Dull Skin Profile',
    category: 'Before & After',
    url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=900&auto=format&fit=crop',
    tag: 'Before 2'
  },
  {
    id: 'after-luminous',
    title: 'Luminous Hydrated Skin Profile',
    category: 'Before & After',
    url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=900&auto=format&fit=crop',
    tag: 'After 2'
  },

  // Mehndi & Bridal
  {
    id: 'mehndi-bridal',
    title: 'Royal Dulhan Bridal Henna Art',
    category: 'Mehndi & Bridal',
    url: '/images/mehndi_bridal_hands_1786879695626.jpg',
    tag: 'Bridal Henna'
  },
  {
    id: 'mehndi-arabic',
    title: 'Gulf Arabic Floral Henna',
    category: 'Mehndi & Bridal',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop',
    tag: 'Arabic Style'
  },
  {
    id: 'makeup-bridal',
    title: 'Royal Dulhan Bridal Transformation',
    category: 'Makeup & Makeovers',
    url: 'https://images.unsplash.com/photo-1583001809873-a128495da465?q=80&w=900&auto=format&fit=crop',
    tag: 'Bridal Makeup'
  },
  {
    id: 'makeup-glam',
    title: 'High-Impact Red Carpet Glam',
    category: 'Makeup & Makeovers',
    url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=900&auto=format&fit=crop',
    tag: 'Red Carpet'
  }
];

export const DEFAULT_CUSTOMIZATION: SiteCustomization = {
  colors: { ...COLOR_THEME_PRESETS[0].colors },
  images: {
    heroModelImage: '/images/hero_beauty_model_1786879155700.png',
    promoBanner1Image: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop',
    promoBanner2Image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=700&auto=format&fit=crop',
    naturalGlowSectionImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=900&auto=format&fit=crop',
    sensitiveSkinSectionImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
    antiPigmentationImage: 'https://images.unsplash.com/photo-1608248597359-005cb2346743?q=80&w=800&auto=format&fit=crop',
    essentialsKitImage: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=800&auto=format&fit=crop',
    biggestLaunchImage: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop',
    glowcareSecretImage: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=800&auto=format&fit=crop',
    beforeImage: '/images/skin_before_acne_1786879205572.jpg',
    afterImage: '/images/skin_after_glow_1786879190967.jpg',
    multipleUsagesImage: 'https://images.unsplash.com/photo-1608248597359-009f7a77ec81?q=80&w=800&auto=format&fit=crop',
    makeoverBannerImage: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=900&auto=format&fit=crop',
    categoryImages: {
      'skin-care': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop',
      'hair-care': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600&auto=format&fit=crop',
      'body-care': 'https://images.unsplash.com/photo-1556760544-74068565f05c?q=80&w=600&auto=format&fit=crop',
      'makeup': 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=600&auto=format&fit=crop',
      'mehndi-designs': '/images/mehndi_bridal_hands_1786879695626.jpg',
      'health-wellness': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600&auto=format&fit=crop'
    }
  },
  sounds: {
    theme: 'crystal',
    enabled: true,
    volume: 0.6,
    triggers: {
      click: true,
      addToCart: true,
      wishlist: true,
      modalToggle: true,
      checkoutSuccess: true,
      filterChange: true
    }
  }
};
