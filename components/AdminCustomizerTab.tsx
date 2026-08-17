'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Palette,
  Image as ImageIcon,
  Volume2,
  Sparkles,
  Check,
  Upload,
  RefreshCw,
  Save,
  RotateCcw,
  Play,
  Layers,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Globe,
  HardDrive,
  X,
  Maximize2
} from 'lucide-react';
import {
  COLOR_THEME_PRESETS,
  SOUND_THEMES_INFO,
  CURATED_IMAGE_LIBRARY,
  DEFAULT_CUSTOMIZATION
} from '@/lib/customizationPresets';
import { SoundType, SoundTheme, SoundSettings, ColorThemePreset, SiteCustomization } from '@/lib/types';

interface ImageDefinition {
  key: string;
  title: string;
  section: string;
  badge: string;
  badgeColor: string;
  description: string;
  targetWidth: number;
  targetHeight: number;
  aspectRatioText: string;
  minWidth: number;
  minHeight: number;
  isCategory?: boolean;
}

export const WEBSITE_IMAGE_DEFINITIONS: ImageDefinition[] = [
  {
    key: 'heroModelImage',
    title: 'Hero Right-Side Model Visual',
    section: 'Hero Banner Section',
    badge: 'Hero Main',
    badgeColor: 'bg-pink-100 text-pink-700',
    description: 'Main beauty model featured prominently in the hero section alongside the headline.',
    targetWidth: 800,
    targetHeight: 1000,
    aspectRatioText: '4:5 (Portrait)',
    minWidth: 500,
    minHeight: 625
  },
  {
    key: 'promoBanner1Image',
    title: 'Promo Banner 1 (Flat 20% OFF)',
    section: 'Mid-Page Promo Section',
    badge: 'Promo Banner',
    badgeColor: 'bg-amber-100 text-amber-800',
    description: 'Promotional display for code GLOW20 showcasing product lineup.',
    targetWidth: 800,
    targetHeight: 600,
    aspectRatioText: '4:3 (Landscape)',
    minWidth: 600,
    minHeight: 450
  },
  {
    key: 'promoBanner2Image',
    title: 'Promo Banner 2 (Mega Sale 30% OFF)',
    section: 'Flash Sale Section',
    badge: 'Mega Sale',
    badgeColor: 'bg-rose-100 text-rose-800',
    description: 'Secondary high-impact discount banner with rich gradient background.',
    targetWidth: 700,
    targetHeight: 500,
    aspectRatioText: '7:5 (Landscape)',
    minWidth: 500,
    minHeight: 350
  },
  {
    key: 'naturalGlowSectionImage',
    title: 'Natural Glow (Peach 70 Niacin Serum)',
    section: 'Product Feature Section',
    badge: 'Feature Story',
    badgeColor: 'bg-pink-100 text-pink-700',
    description: 'Model photo featured in the Peach 70% extract clinical story.',
    targetWidth: 900,
    targetHeight: 1100,
    aspectRatioText: '4:5 (Portrait)',
    minWidth: 600,
    minHeight: 750
  },
  {
    key: 'sensitiveSkinSectionImage',
    title: 'Gentle Sensitive Skin Care Showcase',
    section: 'Clinical Care Section',
    badge: 'Derm Care',
    badgeColor: 'bg-teal-100 text-teal-800',
    description: 'Primary visual for dermatologist-tested sensitive skin formulations.',
    targetWidth: 800,
    targetHeight: 800,
    aspectRatioText: '1:1 (Square)',
    minWidth: 500,
    minHeight: 500
  },
  {
    key: 'antiPigmentationImage',
    title: 'Anti-Pigmentation Catalyst Serum',
    section: 'Catalyst Serum Section',
    badge: 'Hero Serum',
    badgeColor: 'bg-amber-100 text-amber-800',
    description: 'Product spotlight bottle image for the dark spot and pigmentation treatment.',
    targetWidth: 800,
    targetHeight: 800,
    aspectRatioText: '1:1 (Square)',
    minWidth: 500,
    minHeight: 500
  },
  {
    key: 'biggestLaunchImage',
    title: 'Biggest Launch (Elyra Editorial)',
    section: 'Biggest Launch Section',
    badge: 'Launch Banner',
    badgeColor: 'bg-purple-100 text-purple-800',
    description: 'High-fashion editorial model visual for our largest product launch.',
    targetWidth: 900,
    targetHeight: 1100,
    aspectRatioText: '4:5 (Portrait)',
    minWidth: 600,
    minHeight: 750
  },
  {
    key: 'glowcareSecretImage',
    title: 'Glowcare Secrets (Organic Formulations)',
    section: 'Secrets & Ingredients Section',
    badge: 'Premium Story',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    description: 'Model portrait with radiant glass skin in the organic ingredients section.',
    targetWidth: 900,
    targetHeight: 1100,
    aspectRatioText: '4:5 (Portrait)',
    minWidth: 600,
    minHeight: 750
  },
  {
    key: 'beforeImage',
    title: 'Clinical Results: Before Photo',
    section: '14-Day Comparison Slider',
    badge: 'Before Stage',
    badgeColor: 'bg-zinc-200 text-zinc-800',
    description: 'Before image showing visible redness, texture, and acne spots for slider.',
    targetWidth: 800,
    targetHeight: 800,
    aspectRatioText: '1:1 (Square / 4:3)',
    minWidth: 500,
    minHeight: 500
  },
  {
    key: 'afterImage',
    title: 'Clinical Results: After Photo',
    section: '14-Day Comparison Slider',
    badge: 'After Stage',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    description: 'After image showing smooth, glowing glass skin after 14 days.',
    targetWidth: 800,
    targetHeight: 800,
    aspectRatioText: '1:1 (Square / 4:3)',
    minWidth: 500,
    minHeight: 500
  },
  {
    key: 'essentialsKitImage',
    title: 'Curated Essentials Kit Bundle Box',
    section: 'Ultimate Bundle Section',
    badge: 'Curated Box',
    badgeColor: 'bg-indigo-100 text-indigo-800',
    description: 'Curated routine basket bundle image with skincare collection bottles.',
    targetWidth: 900,
    targetHeight: 675,
    aspectRatioText: '4:3 (Landscape)',
    minWidth: 600,
    minHeight: 450
  },
  {
    key: 'multipleUsagesImage',
    title: 'Multiple Usages Serum Spotlight',
    section: 'Versatile Care Orbit Section',
    badge: 'Orbit Center',
    badgeColor: 'bg-pink-100 text-pink-700',
    description: 'Center serum bottle inside the interactive circular orbit stage.',
    targetWidth: 800,
    targetHeight: 1000,
    aspectRatioText: '4:5 (Portrait)',
    minWidth: 500,
    minHeight: 625
  },
  // Categories
  {
    key: 'category:skin-care',
    title: 'Skin Care Category Card',
    section: 'Shop By Category Grid',
    badge: 'Category Card',
    badgeColor: 'bg-pink-50 text-pink-700 border border-pink-200',
    description: 'Card thumbnail shown on the homepage for Skin Care treatments.',
    targetWidth: 600,
    targetHeight: 750,
    aspectRatioText: '4:5 (Portrait)',
    minWidth: 400,
    minHeight: 500,
    isCategory: true
  },
  {
    key: 'category:hair-care',
    title: 'Hair Care Category Card',
    section: 'Shop By Category Grid',
    badge: 'Category Card',
    badgeColor: 'bg-pink-50 text-pink-700 border border-pink-200',
    description: 'Card thumbnail shown on the homepage for Hair Care services.',
    targetWidth: 600,
    targetHeight: 750,
    aspectRatioText: '4:5 (Portrait)',
    minWidth: 400,
    minHeight: 500,
    isCategory: true
  },
  {
    key: 'category:body-care',
    title: 'Body Care Category Card',
    section: 'Shop By Category Grid',
    badge: 'Category Card',
    badgeColor: 'bg-pink-50 text-pink-700 border border-pink-200',
    description: 'Card thumbnail shown on the homepage for Body Care treatments.',
    targetWidth: 600,
    targetHeight: 750,
    aspectRatioText: '4:5 (Portrait)',
    minWidth: 400,
    minHeight: 500,
    isCategory: true
  },
  {
    key: 'category:makeup',
    title: 'Makeup & Beauty Category Card',
    section: 'Shop By Category Grid',
    badge: 'Category Card',
    badgeColor: 'bg-pink-50 text-pink-700 border border-pink-200',
    description: 'Card thumbnail shown on the homepage for Makeup services.',
    targetWidth: 600,
    targetHeight: 750,
    aspectRatioText: '4:5 (Portrait)',
    minWidth: 400,
    minHeight: 500,
    isCategory: true
  },
  {
    key: 'category:mehndi-designs',
    title: 'Mehndi Designs Category Card',
    section: 'Shop By Category Grid',
    badge: 'Category Card',
    badgeColor: 'bg-pink-50 text-pink-700 border border-pink-200',
    description: 'Card thumbnail shown on the homepage for Bridal and Arabic Mehndi.',
    targetWidth: 600,
    targetHeight: 750,
    aspectRatioText: '4:5 (Portrait)',
    minWidth: 400,
    minHeight: 500,
    isCategory: true
  },
  {
    key: 'category:health-wellness',
    title: 'Health & Wellness Category Card',
    section: 'Shop By Category Grid',
    badge: 'Category Card',
    badgeColor: 'bg-pink-50 text-pink-700 border border-pink-200',
    description: 'Card thumbnail shown on the homepage for Wellness & Spa treatments.',
    targetWidth: 600,
    targetHeight: 750,
    aspectRatioText: '4:5 (Portrait)',
    minWidth: 400,
    minHeight: 500,
    isCategory: true
  }
];

export default function AdminCustomizerTab() {
  const {
    customization,
    updateCustomization,
    uploadImage,
    refreshSettings,
    playAudio,
    testAudio,
    addToast
  } = useStore();

  const [subTab, setSubTab] = useState<'images' | 'colors' | 'categories' | 'sounds'>('images');
  const [isSaving, setIsSaving] = useState(false);

  // Local draft state initialized with current customization and kept in sync
  const [prevCustomization, setPrevCustomization] = useState<SiteCustomization>(customization);
  const [draft, setDraft] = useState<SiteCustomization>(() => JSON.parse(JSON.stringify(customization)));

  if (customization !== prevCustomization) {
    setPrevCustomization(customization);
    setDraft(JSON.parse(JSON.stringify(customization)));
  }

  // Image Replacement Studio Modal State
  const [activeImageDef, setActiveImageDef] = useState<ImageDefinition | null>(null);
  const [newImageAddress, setNewImageAddress] = useState<string>('');
  const [inputSourceType, setInputSourceType] = useState<'url' | 'file' | 'library'>('url');
  const [analyzingImage, setAnalyzingImage] = useState<boolean>(false);
  const [detectedDimensions, setDetectedDimensions] = useState<{ width: number; height: number } | null>(null);
  const [dimensionStatus, setDimensionStatus] = useState<{
    matches: boolean;
    severity: 'success' | 'warning' | 'error' | null;
    message: string;
  }>({ matches: false, severity: null, message: '' });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper to get current image value from draft
  const getDraftImageUrl = (key: string): string => {
    if (key.startsWith('category:')) {
      const catKey = key.replace('category:', '');
      return draft.images.categoryImages?.[catKey] || '';
    }
    return (draft.images as any)[key] || '';
  };

  // Inspect image dimensions whenever newImageAddress changes
  const analyzeImageDimensions = (url: string, targetDef: ImageDefinition) => {
    if (!url.trim()) {
      setDetectedDimensions(null);
      setDimensionStatus({ matches: false, severity: null, message: '' });
      return;
    }

    setAnalyzingImage(true);
    const img = new Image();
    img.src = url;

    img.onload = () => {
      setAnalyzingImage(false);
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      setDetectedDimensions({ width: w, height: h });

      const actualRatio = w / h;
      const targetRatio = targetDef.targetWidth / targetDef.targetHeight;
      const ratioDifference = Math.abs(actualRatio - targetRatio) / targetRatio;

      const isTooSmall = w < targetDef.minWidth || h < targetDef.minHeight;
      const isRatioMismatched = ratioDifference > 0.22; // more than 22% aspect mismatch

      if (isRatioMismatched) {
        const orientation = actualRatio > 1.2 ? 'Landscape (horizontal)' : actualRatio < 0.85 ? 'Portrait (vertical)' : 'Square (1:1)';
        const targetOrientation = targetRatio > 1.2 ? 'Landscape' : targetRatio < 0.85 ? 'Portrait' : 'Square';

        setDimensionStatus({
          matches: false,
          severity: 'warning',
          message: `⚠️ Aspect ratio mismatch! Your image is ${w} × ${h} px (${orientation}), but this section requires ${targetDef.targetWidth} × ${targetDef.targetHeight} px (${targetDef.aspectRatioText}). It may appear cropped or stretched.`
        });
      } else if (isTooSmall) {
        setDimensionStatus({
          matches: false,
          severity: 'warning',
          message: `⚠️ Low Resolution: Image size (${w} × ${h} px) is smaller than recommended minimum (${targetDef.minWidth} × ${targetDef.minHeight} px). It may appear blurry.`
        });
      } else {
        setDimensionStatus({
          matches: true,
          severity: 'success',
          message: `✅ Perfect Size Match: ${w} × ${h} px corresponds to the recommended ${targetDef.targetWidth} × ${targetDef.targetHeight} px format.`
        });
      }
    };

    img.onerror = () => {
      setAnalyzingImage(false);
      setDetectedDimensions(null);
      setDimensionStatus({
        matches: false,
        severity: 'error',
        message: '❌ Unable to load image from this address. Please ensure the URL is accessible and points to a valid image (PNG, JPG, WebP).'
      });
    };
  };

  // Open the Image Replacement Studio for a specific image
  const handleOpenImageStudio = (def: ImageDefinition) => {
    setActiveImageDef(def);
    const currentUrl = getDraftImageUrl(def.key);
    setNewImageAddress(currentUrl);
    setInputSourceType('url');
    analyzeImageDimensions(currentUrl, def);
  };

  // Handle local file selection from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeImageDef) return;

    if (file.size > 8 * 1024 * 1024) {
      addToast('error', 'File Too Large', 'Please select an image smaller than 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setNewImageAddress(dataUrl);
      setInputSourceType('file');
      analyzeImageDimensions(dataUrl, activeImageDef);
    };
    reader.readAsDataURL(file);
  };

  // Perform replacement
  const handleConfirmImageReplacement = async () => {
    if (!activeImageDef || !newImageAddress.trim()) return;

    let targetUrl = newImageAddress.trim();

    setIsSaving(true);
    try {
      // If it's a locally loaded file or base64 data URL, upload to server database/filesystem
      if (targetUrl.startsWith('data:image')) {
        const uploadRes = await uploadImage(targetUrl, activeImageDef.key);
        if (uploadRes.success && uploadRes.url) {
          targetUrl = uploadRes.url;
        }
      }

      const key = activeImageDef.key;
      let updatedImages: Partial<SiteCustomization['images']>;

      if (key.startsWith('category:')) {
        const catKey = key.replace('category:', '');
        const newCatImages = {
          ...(draft.images.categoryImages || {}),
          [catKey]: targetUrl
        };
        updatedImages = {
          ...draft.images,
          categoryImages: newCatImages
        };
      } else {
        updatedImages = {
          ...draft.images,
          [key]: targetUrl
        };
      }

      const updatedCustomization: SiteCustomization = {
        ...draft,
        images: {
          ...draft.images,
          ...updatedImages
        }
      };

      setDraft(updatedCustomization);
      await updateCustomization(updatedCustomization);
      await refreshSettings();

      playAudio('checkoutSuccess');
      addToast(
        'success',
        'Image Replaced & Saved! 📸',
        `"${activeImageDef.title}" is now saved to database and live across all devices (Mobile & Laptop).`
      );
      setActiveImageDef(null);
      setNewImageAddress('');
    } catch (err: any) {
      addToast('error', 'Update Failed', err?.message || 'Failed to update image.');
    } finally {
      setIsSaving(false);
    }
  };

  // Apply a preset to draft and live site
  const handleApplyPreset = async (presetId: ColorThemePreset) => {
    const preset = COLOR_THEME_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      const updatedCustomization: SiteCustomization = {
        ...draft,
        colors: { ...preset.colors }
      };
      setDraft(updatedCustomization);
      await updateCustomization(updatedCustomization);
      playAudio('filterChange');
      addToast(
        'success',
        'Theme Preset Activated! 🎨',
        `"${preset.name}" is now live across the entire website.`
      );
    }
  };

  // Update specific color
  const handleColorChange = (key: keyof SiteCustomization['colors'], value: string) => {
    const newColors = {
      ...draft.colors,
      preset: 'custom' as ColorThemePreset,
      [key]: value
    };
    const updatedCustomization: SiteCustomization = {
      ...draft,
      colors: newColors
    };
    setDraft(updatedCustomization);
    updateCustomization(updatedCustomization);
  };

  // Sound theme select
  const handleSoundThemeSelect = async (themeId: SoundTheme) => {
    const newSounds: SoundSettings = {
      ...draft.sounds,
      theme: themeId
    };
    const updatedCustomization: SiteCustomization = {
      ...draft,
      sounds: newSounds
    };
    setDraft(updatedCustomization);
    await updateCustomization(updatedCustomization);
    testAudio(themeId, 'addToCart', draft.sounds.volume);
    const themeName = SOUND_THEMES_INFO.find((t) => t.id === themeId)?.name || themeId;
    addToast('success', 'Sound Theme Changed 🔊', `Audio effects set to "${themeName}".`);
  };

  // Sound toggle
  const handleSoundToggle = async () => {
    const newSounds: SoundSettings = {
      ...draft.sounds,
      enabled: !draft.sounds.enabled
    };
    const updatedCustomization: SiteCustomization = {
      ...draft,
      sounds: newSounds
    };
    setDraft(updatedCustomization);
    await updateCustomization(updatedCustomization);
    playAudio('click');
    addToast('info', 'Audio FX', newSounds.enabled ? 'Sound effects enabled' : 'Sound effects muted');
  };

  // Volume change
  const handleVolumeChange = (vol: number) => {
    const newSounds: SoundSettings = {
      ...draft.sounds,
      volume: vol
    };
    const updatedCustomization: SiteCustomization = {
      ...draft,
      sounds: newSounds
    };
    setDraft(updatedCustomization);
    updateCustomization(updatedCustomization);
  };

  // Save changes
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const ok = await updateCustomization(draft);
      await refreshSettings();
      if (ok) {
        playAudio('checkoutSuccess');
        addToast('success', 'Customizations Saved! ✨', 'All image replacements, color themes, and sound styles are saved in database and live across all devices (Mobile & Laptop).');
      } else {
        addToast('error', 'Save Failed', 'Could not sync settings to server.');
      }
    } catch (e) {
      addToast('error', 'Error', 'Failed to save customizations.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (confirm('Are you sure you want to reset all customizations and images to default?')) {
      setDraft(JSON.parse(JSON.stringify(DEFAULT_CUSTOMIZATION)));
      updateCustomization(DEFAULT_CUSTOMIZATION);
      playAudio('click');
      addToast('info', 'Reset Complete', 'Default images and theme restored.');
    }
  };

  // Test sound
  const handleTestSound = (type: SoundType) => {
    testAudio(draft.sounds.theme, type, draft.sounds.volume);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Persistence Bar */}
      <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 text-white flex items-center justify-center shadow-sm shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-zinc-900 text-lg">
                Website Media Management &amp; Customizer Studio
              </h4>
              <p className="text-xs text-zinc-500">
                Replace every image on your website with exact size validation, customize theme colors, and configure sound styles.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleResetToDefault}
            className="px-3.5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-2xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset all settings to default"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
            <span>Reset Default</span>
          </button>

          <button
            id="btn-save-customizations"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Customizations</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-pink-100 pb-3 overflow-x-auto">
        <button
          onClick={() => {
            setSubTab('images');
            playAudio('click');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            subTab === 'images'
              ? 'bg-pink-600 text-white shadow-xs'
              : 'bg-white text-zinc-600 hover:bg-pink-50 border border-zinc-200/70'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Website Images &amp; Banners ({WEBSITE_IMAGE_DEFINITIONS.filter((d) => !d.isCategory).length})</span>
        </button>

        <button
          onClick={() => {
            setSubTab('categories');
            playAudio('click');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            subTab === 'categories'
              ? 'bg-pink-600 text-white shadow-xs'
              : 'bg-white text-zinc-600 hover:bg-pink-50 border border-zinc-200/70'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Category Showcase Images ({WEBSITE_IMAGE_DEFINITIONS.filter((d) => d.isCategory).length})</span>
        </button>

        <button
          onClick={() => {
            setSubTab('colors');
            playAudio('click');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            subTab === 'colors'
              ? 'bg-pink-600 text-white shadow-xs'
              : 'bg-white text-zinc-600 hover:bg-pink-50 border border-zinc-200/70'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Theme &amp; Text Colors</span>
        </button>

        <button
          onClick={() => {
            setSubTab('sounds');
            playAudio('click');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            subTab === 'sounds'
              ? 'bg-pink-600 text-white shadow-xs'
              : 'bg-white text-zinc-600 hover:bg-pink-50 border border-zinc-200/70'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Sound Styles</span>
        </button>
      </div>

      {/* ================================================================ */}
      {/* 1. ALL WEBSITE IMAGES & BANNERS SECTION                          */}
      {/* ================================================================ */}
      {subTab === 'images' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h5 className="font-serif font-bold text-zinc-900 text-base">
                  Manage All Website Images &amp; Banners
                </h5>
                <p className="text-xs text-zinc-500">
                  Every image used on the website is displayed below with its exact recommended dimensions. Click <strong>&quot;Replace Image&quot;</strong> to upload from your device or provide a web URL with real-time size validation.
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-pink-50 text-pink-700 rounded-full border border-pink-200 shrink-0">
                12 Website Visual Slots
              </span>
            </div>

            {/* Grid of all website image cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {WEBSITE_IMAGE_DEFINITIONS.filter((d) => !d.isCategory).map((def) => {
                const currentUrl = getDraftImageUrl(def.key);
                return (
                  <div
                    key={def.key}
                    className="p-4 rounded-3xl border border-zinc-200/80 hover:border-pink-300 hover:shadow-md transition-all bg-white flex flex-col justify-between space-y-4 group"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div>
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${def.badgeColor} inline-block mb-1`}>
                            {def.badge}
                          </span>
                          <h6 className="font-serif font-bold text-sm text-zinc-900 leading-tight">
                            {def.title}
                          </h6>
                        </div>
                      </div>

                      {/* Image Preview Box */}
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 group-hover:border-pink-200 transition-colors mb-3">
                        <img
                          src={currentUrl}
                          alt={def.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2.5 flex items-center justify-between text-white text-[11px]">
                          <span className="font-bold flex items-center gap-1">
                            <Maximize2 className="w-3 h-3" />
                            {def.targetWidth} × {def.targetHeight} px
                          </span>
                          <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                            {def.aspectRatioText}
                          </span>
                        </div>
                      </div>

                      {/* Description & Current Address preview */}
                      <p className="text-xs text-zinc-600 line-clamp-2 mb-2 leading-relaxed font-light">
                        {def.description}
                      </p>

                      <div className="bg-zinc-50 rounded-xl p-2 border border-zinc-100 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[200px]" title={currentUrl}>
                          {currentUrl.startsWith('data:') ? 'Local Data File (Uploaded)' : currentUrl}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-600 shrink-0">
                          {def.section}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleOpenImageStudio(def)}
                      className="w-full py-2.5 bg-pink-50 hover:bg-pink-600 hover:text-white text-pink-700 font-bold text-xs rounded-2xl border border-pink-200 hover:border-transparent transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Replace Image &amp; Check Size</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* 2. CATEGORY SHOWCASE THUMBNAILS                                  */}
      {/* ================================================================ */}
      {subTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h5 className="font-serif font-bold text-zinc-900 text-base">
                  Shop By Category Showcase Images
                </h5>
                <p className="text-xs text-zinc-500">
                  Update the 6 primary service and category cards featured on the homepage. Recommended size for each is <strong>600 × 750 px (4:5 Aspect Ratio)</strong>.
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-pink-50 text-pink-700 rounded-full border border-pink-200 shrink-0">
                6 Service Categories
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {WEBSITE_IMAGE_DEFINITIONS.filter((d) => d.isCategory).map((def) => {
                const currentUrl = getDraftImageUrl(def.key);
                return (
                  <div
                    key={def.key}
                    className="p-4 rounded-3xl border border-zinc-200/80 hover:border-pink-300 hover:shadow-md transition-all bg-white flex flex-col justify-between space-y-4 group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif font-bold text-sm text-zinc-900">
                          {def.title}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                          {def.key.replace('category:', '')}
                        </span>
                      </div>

                      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 mb-3">
                        <img
                          src={currentUrl}
                          alt={def.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-2.5 flex items-center justify-between text-white text-[11px]">
                          <span className="font-bold">
                            {def.targetWidth} × {def.targetHeight} px
                          </span>
                          <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-full">
                            4:5 Portrait
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-500 font-light">
                        {def.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenImageStudio(def)}
                      className="w-full py-2.5 bg-pink-50 hover:bg-pink-600 hover:text-white text-pink-700 font-bold text-xs rounded-2xl border border-pink-200 hover:border-transparent transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Replace Category Image</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* 3. COLORS & TYPOGRAPHY SECTION                                   */}
      {/* ================================================================ */}
      {subTab === 'colors' && (
        <div className="space-y-6">
          {/* Preset Cards */}
          <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-serif font-bold text-zinc-900 text-base">
                  1-Click Luxury Theme Presets
                </h5>
                <p className="text-xs text-zinc-500">
                  Select a pre-designed harmonious luxury color scheme or customize individual values below.
                </p>
              </div>
              <span className="text-xs bg-pink-50 text-pink-700 font-bold px-3 py-1 rounded-full border border-pink-200">
                {COLOR_THEME_PRESETS.length} Curated Themes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {COLOR_THEME_PRESETS.map((preset) => {
                const isSelected = draft.colors.preset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset.id)}
                    className={`p-4 rounded-2xl text-left border-2 transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-pink-600 bg-pink-50/50 shadow-xs ring-2 ring-pink-600/20'
                        : 'border-zinc-200 hover:border-pink-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif font-bold text-zinc-900 text-sm">
                          {preset.name}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                          {preset.id.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mb-3 font-light">
                        {preset.tagline}
                      </p>
                    </div>

                    {/* Color Swatch Dots */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-zinc-100">
                      <div
                        className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: preset.colors.primaryAccentColor }}
                        title="Primary Accent"
                      />
                      <div
                        className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: preset.colors.headingColor }}
                        title="Heading"
                      />
                      <div
                        className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: preset.colors.canvasBgColor }}
                        title="Canvas Background"
                      />
                      <div
                        className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: preset.colors.promoBanner2Bg }}
                        title="Promo Accent"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Granular Color Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Primary & Text Colors Card */}
            <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                <Palette className="w-4 h-4 text-pink-600" />
                <h5 className="font-serif font-bold text-zinc-900 text-sm">
                  Typography &amp; Primary Accents
                </h5>
              </div>

              {/* Primary Accent Color */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Primary Accent &amp; Button Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={draft.colors.primaryAccentColor}
                    onChange={(e) => handleColorChange('primaryAccentColor', e.target.value)}
                    className="w-10 h-10 rounded-xl border border-zinc-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={draft.colors.primaryAccentColor}
                    onChange={(e) => handleColorChange('primaryAccentColor', e.target.value)}
                    className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-800"
                  />
                </div>
              </div>

              {/* Heading Text Color */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Main Headline Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={draft.colors.headingColor}
                    onChange={(e) => handleColorChange('headingColor', e.target.value)}
                    className="w-10 h-10 rounded-xl border border-zinc-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={draft.colors.headingColor}
                    onChange={(e) => handleColorChange('headingColor', e.target.value)}
                    className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-800"
                  />
                </div>
              </div>

              {/* Body Text Color */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Body Paragraph Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={draft.colors.bodyTextColor}
                    onChange={(e) => handleColorChange('bodyTextColor', e.target.value)}
                    className="w-10 h-10 rounded-xl border border-zinc-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={draft.colors.bodyTextColor}
                    onChange={(e) => handleColorChange('bodyTextColor', e.target.value)}
                    className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-800"
                  />
                </div>
              </div>
            </div>

            {/* Background Canvas & Gradients Card */}
            <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                <Layers className="w-4 h-4 text-pink-600" />
                <h5 className="font-serif font-bold text-zinc-900 text-sm">
                  Canvas &amp; Banner Gradients
                </h5>
              </div>

              {/* Canvas Background */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Main Page Canvas Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={draft.colors.canvasBgColor}
                    onChange={(e) => handleColorChange('canvasBgColor', e.target.value)}
                    className="w-10 h-10 rounded-xl border border-zinc-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={draft.colors.canvasBgColor}
                    onChange={(e) => handleColorChange('canvasBgColor', e.target.value)}
                    className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-800"
                  />
                </div>
              </div>

              {/* Hero Gradients */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Hero Section Gradient (Start → End)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={draft.colors.heroBgGradientStart}
                      onChange={(e) => handleColorChange('heroBgGradientStart', e.target.value)}
                      className="w-8 h-8 rounded-lg border border-zinc-200 cursor-pointer p-0.5"
                    />
                    <span className="text-[11px] text-zinc-500 font-mono">{draft.colors.heroBgGradientStart}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={draft.colors.heroBgGradientEnd}
                      onChange={(e) => handleColorChange('heroBgGradientEnd', e.target.value)}
                      className="w-8 h-8 rounded-lg border border-zinc-200 cursor-pointer p-0.5"
                    />
                    <span className="text-[11px] text-zinc-500 font-mono">{draft.colors.heroBgGradientEnd}</span>
                  </div>
                </div>
              </div>

              {/* Promo Banners */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Promo Banner 1 &amp; 2 Backgrounds
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={draft.colors.promoBanner1Bg}
                      onChange={(e) => handleColorChange('promoBanner1Bg', e.target.value)}
                      className="w-8 h-8 rounded-lg border border-zinc-200 cursor-pointer p-0.5"
                    />
                    <span className="text-[11px] text-zinc-500 font-mono">{draft.colors.promoBanner1Bg}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={draft.colors.promoBanner2Bg}
                      onChange={(e) => handleColorChange('promoBanner2Bg', e.target.value)}
                      className="w-8 h-8 rounded-lg border border-zinc-200 cursor-pointer p-0.5"
                    />
                    <span className="text-[11px] text-zinc-500 font-mono">{draft.colors.promoBanner2Bg}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* 4. SOUND STYLES & AUDIO FX                                       */}
      {/* ================================================================ */}
      {subTab === 'sounds' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-serif font-bold text-zinc-900 text-base">
                  Interactive Sound Styles &amp; Audio Themes
                </h5>
                <p className="text-xs text-zinc-500">
                  Select how clicks, add-to-cart, wishlist, and modal openings sound on the website using pure Web Audio synthesis.
                </p>
              </div>

              {/* Sound Enabled Master Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-600">Audio FX</span>
                <button
                  onClick={handleSoundToggle}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    draft.sounds.enabled ? 'bg-pink-600' : 'bg-zinc-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      draft.sounds.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Sound Themes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
              {SOUND_THEMES_INFO.map((theme) => {
                const isSelected = draft.sounds.theme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleSoundThemeSelect(theme.id)}
                    className={`p-4 rounded-2xl text-left border-2 transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-pink-600 bg-pink-50/50 shadow-xs ring-2 ring-pink-600/20'
                        : 'border-zinc-200 hover:border-pink-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{theme.icon}</span>
                          <span className="font-serif font-bold text-zinc-900 text-sm">
                            {theme.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                          {theme.badge}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 font-light mb-3">
                        {theme.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                      <span className="text-[11px] text-pink-600 font-semibold flex items-center gap-1">
                        <Play className="w-3 h-3 fill-pink-600" /> Click to test
                      </span>
                      {isSelected && (
                        <span className="text-xs font-bold text-pink-600 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Active
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sound Testing Control Deck */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
              <h6 className="font-serif font-bold text-xs text-zinc-800 uppercase tracking-wider mb-3">
                Live Trigger Preview Tests
              </h6>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  onClick={() => handleTestSound('click')}
                  className="py-2.5 px-3 bg-white hover:bg-pink-50 border border-zinc-200 hover:border-pink-300 rounded-xl text-xs font-bold text-zinc-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 text-pink-600" />
                  <span>Click FX</span>
                </button>
                <button
                  onClick={() => handleTestSound('addToCart')}
                  className="py-2.5 px-3 bg-white hover:bg-pink-50 border border-zinc-200 hover:border-pink-300 rounded-xl text-xs font-bold text-zinc-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 text-pink-600" />
                  <span>Add To Cart</span>
                </button>
                <button
                  onClick={() => handleTestSound('wishlist')}
                  className="py-2.5 px-3 bg-white hover:bg-pink-50 border border-zinc-200 hover:border-pink-300 rounded-xl text-xs font-bold text-zinc-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 text-pink-600" />
                  <span>Wishlist</span>
                </button>
                <button
                  onClick={() => handleTestSound('checkoutSuccess')}
                  className="py-2.5 px-3 bg-white hover:bg-pink-50 border border-zinc-200 hover:border-pink-300 rounded-xl text-xs font-bold text-zinc-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 text-pink-600" />
                  <span>Success Chime</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL: IMAGE REPLACEMENT & REAL-TIME DIMENSION VALIDATOR STUDIO  */}
      {/* ================================================================ */}
      <AnimatePresence>
        {activeImageDef && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[2.5rem] max-w-3xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-pink-100"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-pink-100 flex items-start justify-between bg-gradient-to-r from-pink-50/60 via-white to-pink-50/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${activeImageDef.badgeColor}`}>
                      {activeImageDef.badge}
                    </span>
                    <span className="text-xs font-bold text-zinc-500">
                      {activeImageDef.section}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-zinc-900 text-xl">
                    Replace {activeImageDef.title}
                  </h4>
                  <p className="text-xs text-zinc-500 font-light">
                    Provide an image from your device or internet URL. The system automatically inspects image dimensions and ensures visual perfection.
                  </p>
                </div>
                <button
                  onClick={() => setActiveImageDef(null)}
                  className="w-9 h-9 rounded-full bg-white text-zinc-400 hover:text-zinc-700 border border-zinc-200 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* 1. Required Size Specification Banner */}
                <div className="p-4 rounded-2xl bg-pink-50/80 border border-pink-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-pink-700 uppercase tracking-wider block">
                        REQUIRED SECTION IMAGE DIMENSIONS
                      </span>
                      <h5 className="font-serif font-bold text-zinc-900 text-base">
                        {activeImageDef.targetWidth} × {activeImageDef.targetHeight} px ({activeImageDef.aspectRatioText})
                      </h5>
                      <p className="text-[11px] text-zinc-600 mt-0.5">
                        Minimum resolution: {activeImageDef.minWidth} × {activeImageDef.minHeight} px • Format: JPG, PNG, WebP
                      </p>
                    </div>
                  </div>

                  <div className="text-right sm:text-right shrink-0">
                    <span className="text-xs font-semibold text-pink-800 bg-white/80 px-3 py-1.5 rounded-xl border border-pink-200 block">
                      Current Target: {activeImageDef.aspectRatioText}
                    </span>
                  </div>
                </div>

                {/* 2. Side-by-Side Comparison: Current Image vs New Proposed Image */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Current Active Image */}
                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-zinc-700">Currently Active on Website</span>
                        <span className="text-[10px] bg-zinc-200 text-zinc-800 font-bold px-2 py-0.5 rounded-full">Active</span>
                      </div>
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-200 border border-zinc-200 mb-2">
                        <img
                          src={getDraftImageUrl(activeImageDef.key)}
                          alt="Current Image"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] font-mono text-zinc-500 truncate" title={getDraftImageUrl(activeImageDef.key)}>
                      {getDraftImageUrl(activeImageDef.key).startsWith('data:') ? 'Uploaded File' : getDraftImageUrl(activeImageDef.key)}
                    </p>
                  </div>

                  {/* New Image Proposed Preview */}
                  <div className="p-3.5 rounded-2xl bg-pink-50/40 border border-pink-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-pink-900">New Replacement Preview</span>
                        {detectedDimensions ? (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            dimensionStatus.matches ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {detectedDimensions.width} × {detectedDimensions.height} px
                          </span>
                        ) : (
                          <span className="text-[10px] bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full">
                            Pending Address
                          </span>
                        )}
                      </div>

                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 mb-2 flex items-center justify-center">
                        {newImageAddress ? (
                          <img
                            src={newImageAddress}
                            alt="New Proposed Image"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-4 text-zinc-400">
                            <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                            <p className="text-xs">Select or enter image address below</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {detectedDimensions && (
                      <p className="text-[11px] font-semibold text-zinc-700">
                        Detected: {detectedDimensions.width} × {detectedDimensions.height} px
                      </p>
                    )}
                  </div>
                </div>

                {/* 3. Dimension Error / Warning / Match Status Feedback Box */}
                {dimensionStatus.message && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border flex items-start gap-3 ${
                      dimensionStatus.severity === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : dimensionStatus.severity === 'warning'
                        ? 'bg-amber-50 border-amber-300 text-amber-950'
                        : 'bg-rose-50 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {dimensionStatus.severity === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      {dimensionStatus.severity === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                      {dimensionStatus.severity === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold leading-relaxed">
                        {dimensionStatus.message}
                      </p>
                      {dimensionStatus.severity === 'warning' && (
                        <p className="text-[11px] text-amber-800/80 font-light">
                          For best results, use an image matching <strong>{activeImageDef.targetWidth} × {activeImageDef.targetHeight} px</strong> or use our 1-click curated library below.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* 4. Replacement Source Tabs: URL vs Device Upload vs Curated Library */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-zinc-800">
                    Choose Image Address Source
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Option A: Internet URL Address */}
                    <div className="p-4 rounded-2xl bg-white border border-zinc-200 hover:border-pink-300 transition-all space-y-2">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-pink-600" />
                        <span className="text-xs font-bold text-zinc-800">From Internet (URL Address)</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 font-light">
                        Paste the direct web link address of any image.
                      </p>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={inputSourceType === 'url' ? newImageAddress : ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setInputSourceType('url');
                          setNewImageAddress(val);
                          analyzeImageDimensions(val, activeImageDef);
                        }}
                        className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:border-pink-500 outline-hidden transition-all"
                      />
                    </div>

                    {/* Option B: Local Device File Upload */}
                    <div className="p-4 rounded-2xl bg-white border border-zinc-200 hover:border-pink-300 transition-all space-y-2">
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-pink-600" />
                        <span className="text-xs font-bold text-zinc-800">From Your Device (Upload)</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 font-light">
                        Select a file from your computer or phone gallery.
                      </p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs rounded-xl border border-pink-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Choose File From Device</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. Curated High-Resolution Library Recommendations */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-600" />
                      <h5 className="font-serif font-bold text-zinc-900 text-sm">
                        Or Pick from 1-Click Curated High-Definition Library
                      </h5>
                    </div>
                    <span className="text-[11px] text-zinc-500">
                      Pre-formatted for beauty &amp; skincare
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {CURATED_IMAGE_LIBRARY.slice(0, 8).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setInputSourceType('library');
                          setNewImageAddress(item.url);
                          analyzeImageDimensions(item.url, activeImageDef);
                        }}
                        className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all text-left focus:outline-hidden cursor-pointer ${
                          newImageAddress === item.url ? 'border-pink-600 ring-2 ring-pink-600/30' : 'border-zinc-200 hover:border-pink-300'
                        }`}
                      >
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-end">
                          <span className="text-[9px] font-bold text-pink-300 uppercase tracking-wider">
                            {item.tag}
                          </span>
                          <span className="text-[11px] font-semibold text-white line-clamp-1">
                            {item.title}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-zinc-100 bg-zinc-50/60 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveImageDef(null)}
                  className="px-5 py-2.5 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-bold rounded-2xl border border-zinc-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-3">
                  {dimensionStatus.severity === 'warning' && (
                    <span className="text-[11px] text-amber-700 font-semibold hidden sm:inline-block">
                      Dimension warning acknowledged
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={handleConfirmImageReplacement}
                    disabled={!newImageAddress.trim() || analyzingImage || dimensionStatus.severity === 'error'}
                    className={`px-6 py-2.5 text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center gap-2 cursor-pointer ${
                      dimensionStatus.severity === 'warning'
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-pink-600 hover:bg-pink-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {analyzingImage ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Validating...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>
                          {dimensionStatus.severity === 'warning' ? 'Replace Image Anyway' : 'Replace Image'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
