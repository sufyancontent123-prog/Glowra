'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, UserInquiry, SiteSettings, Order, SoundType, SoundTheme, SiteCustomization } from '@/lib/types';
import { INITIAL_PRODUCTS, INITIAL_SITE_SETTINGS, INITIAL_INQUIRIES } from '@/lib/data';
import { DEFAULT_CUSTOMIZATION } from '@/lib/customizationPresets';
import { soundFx } from '@/lib/soundEffects';
import confetti from 'canvas-confetti';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message: string;
}

interface StoreContextType {
  // Products
  products: Product[];
  isLoadingProducts: boolean;
  refreshProducts: () => Promise<void>;
  addProduct: (productData: Omit<Product, 'id'> & { id?: string }) => Promise<{ success: boolean; message: string; data?: Product }>;
  deleteProduct: (productId: string, productNameVerification: string) => Promise<{ success: boolean; message: string }>;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;
  cartCount: number;
  discountCode: string;
  discountPercent: number;
  applyDiscountCode: (code: string) => boolean;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  // Modals & Panels
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
  contactPrefill: { subject?: string; serviceType?: string };
  openContactWithPrefill: (subject?: string, serviceType?: string) => void;

  isPortfolioModalOpen: boolean;
  setIsPortfolioModalOpen: (open: boolean) => void;

  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;

  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;

  // Inquiries (for real-time Admin + Client)
  inquiries: UserInquiry[];
  submitInquiry: (inquiryData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    serviceType: UserInquiry['serviceType'];
    message: string;
  }) => Promise<{ success: boolean; message: string }>;
  updateInquiryStatus: (id: string, status: UserInquiry['status'], replyText?: string) => Promise<boolean>;
  deleteInquiryItem: (id: string) => Promise<boolean>;
  refreshInquiries: () => Promise<void>;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<boolean>;

  // Site Settings & Customization
  settings: SiteSettings;
  customization: SiteCustomization;
  updateSiteSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
  updateCustomization: (customUpdates: Partial<SiteCustomization>) => Promise<boolean>;
  uploadImage: (fileOrBase64: File | string, slotKey: string) => Promise<{ success: boolean; url?: string; error?: string }>;
  refreshSettings: () => Promise<void>;

  // Audio & Sound Effects
  playAudio: (type: SoundType) => void;
  testAudio: (theme: SoundTheme, type: SoundType, volume?: number) => void;

  // Toasts
  toasts: ToastNotification[];
  addToast: (type: 'success' | 'info' | 'error', title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Safe response parsing to prevent unexpected HTML token '<' syntax errors
async function safeParseResponse<T = any>(res: Response): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
  try {
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await res.text();
      if (!res.ok) {
        return { success: false, error: `Server error (${res.status})` };
      }
      try {
        return JSON.parse(text);
      } catch {
        return { success: false, error: 'Non-JSON response received' };
      }
    }
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Failed to parse server response' };
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [selectedCategory, setSelectedCategoryState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProductState] = useState<Product | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpenState] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Wishlist
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isWishlistOpen, setIsWishlistOpenState] = useState(false);

  // Modals
  const [isContactModalOpen, setIsContactModalOpenState] = useState(false);
  const [contactPrefill, setContactPrefill] = useState<{ subject?: string; serviceType?: string }>({});
  const [isPortfolioModalOpen, setIsPortfolioModalOpenState] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpenState] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpenState] = useState(false);

  // Inquiries & Settings & Orders
  const [inquiries, setInquiries] = useState<UserInquiry[]>(INITIAL_INQUIRIES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);

  // Active customization object
  const customization = settings.customization || DEFAULT_CUSTOMIZATION;

  // Sound playback helpers
  const playAudio = useCallback(
    (type: SoundType) => {
      const sounds = settings.customization?.sounds || DEFAULT_CUSTOMIZATION.sounds;
      if (!sounds.enabled || sounds.theme === 'muted') return;
      if (sounds.triggers && sounds.triggers[type] === false) return;
      soundFx.play(sounds.theme, type, sounds.volume);
    },
    [settings.customization?.sounds]
  );

  const testAudio = useCallback((theme: SoundTheme, type: SoundType, customVolume?: number) => {
    soundFx.play(theme, type, customVolume);
  }, []);

  // Modal open interceptors for sound
  const setIsCartOpen = useCallback((open: boolean) => {
    if (open) playAudio('modalToggle');
    setIsCartOpenState(open);
  }, [playAudio]);

  const setIsWishlistOpen = useCallback((open: boolean) => {
    if (open) playAudio('modalToggle');
    setIsWishlistOpenState(open);
  }, [playAudio]);

  const setIsContactModalOpen = useCallback((open: boolean) => {
    if (open) playAudio('modalToggle');
    setIsContactModalOpenState(open);
  }, [playAudio]);

  const setIsPortfolioModalOpen = useCallback((open: boolean) => {
    if (open) playAudio('modalToggle');
    setIsPortfolioModalOpenState(open);
  }, [playAudio]);

  const setIsAdminModalOpen = useCallback((open: boolean) => {
    if (open) playAudio('modalToggle');
    setIsAdminModalOpenState(open);
  }, [playAudio]);

  const setIsCheckoutModalOpen = useCallback((open: boolean) => {
    if (open) playAudio('modalToggle');
    setIsCheckoutModalOpenState(open);
  }, [playAudio]);

  const setQuickViewProduct = useCallback((product: Product | null) => {
    if (product) playAudio('modalToggle');
    setQuickViewProductState(product);
  }, [playAudio]);

  const setSelectedCategory = useCallback((cat: string) => {
    playAudio('filterChange');
    setSelectedCategoryState(cat);
  }, [playAudio]);

  // CSS variables & theme styling live application
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const colors = settings.customization?.colors || DEFAULT_CUSTOMIZATION.colors;
    const root = document.documentElement;
    root.style.setProperty('--color-heading', colors.headingColor);
    root.style.setProperty('--color-body-text', colors.bodyTextColor);
    root.style.setProperty('--color-muted-text', colors.mutedTextColor);
    root.style.setProperty('--color-primary-accent', colors.primaryAccentColor);
    root.style.setProperty('--color-secondary-accent', colors.secondaryAccentColor);
    root.style.setProperty('--color-canvas-bg', colors.canvasBgColor);
    root.style.setProperty('--color-card-bg', colors.cardBgColor);
    root.style.setProperty('--color-badge-bg', colors.badgeBgColor);
    root.style.setProperty('--color-badge-text', colors.badgeTextColor);
    root.style.setProperty('--color-hero-start', colors.heroBgGradientStart || colors.primaryAccentColor);
    root.style.setProperty('--color-hero-end', colors.heroBgGradientEnd || colors.secondaryAccentColor);
    root.style.setProperty('--color-banner1-bg', colors.promoBanner1Bg);
    root.style.setProperty('--color-banner2-bg', colors.promoBanner2Bg);

    document.body.style.backgroundColor = colors.canvasBgColor;

    let styleTag = document.getElementById('glowora-dynamic-theme') as HTMLStyleElement | null;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'glowora-dynamic-theme';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = `
      :root {
        --color-heading: ${colors.headingColor};
        --color-body-text: ${colors.bodyTextColor};
        --color-muted-text: ${colors.mutedTextColor};
        --color-primary-accent: ${colors.primaryAccentColor};
        --color-secondary-accent: ${colors.secondaryAccentColor};
        --color-canvas-bg: ${colors.canvasBgColor};
        --color-card-bg: ${colors.cardBgColor};
        --color-badge-bg: ${colors.badgeBgColor};
        --color-badge-text: ${colors.badgeTextColor};
      }
      .bg-pink-600 {
        background-color: ${colors.primaryAccentColor} !important;
      }
      .hover\\:bg-pink-700:hover {
        filter: brightness(0.92);
      }
      .text-pink-600 {
        color: ${colors.primaryAccentColor} !important;
      }
      .border-pink-600 {
        border-color: ${colors.primaryAccentColor} !important;
      }
      .ring-pink-600 {
        --tw-ring-color: ${colors.primaryAccentColor} !important;
      }
    `;
  }, [settings.customization?.colors]);

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback((type: 'success' | 'info' | 'error', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch live products
  const refreshProducts = useCallback(async () => {
    try {
      setIsLoadingProducts(true);
      const res = await fetch('/api/products');
      const data = await safeParseResponse<Product[]>(res);
      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  // Fetch live inquiries
  const refreshInquiries = useCallback(async () => {
    try {
      const res = await fetch('/api/inquiries');
      const data = await safeParseResponse<UserInquiry[]>(res);
      if (data.success && Array.isArray(data.data)) {
        setInquiries(data.data);
        localStorage.setItem('glowora_local_inquiries', JSON.stringify(data.data));
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    }
  }, []);

  // Fetch orders
  const refreshOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await safeParseResponse<Order[]>(res);
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  }, []);

  // Fetch settings
  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await safeParseResponse<SiteSettings>(res);
      if (data.success && data.data) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  }, []);

  // Add Product
  const addProduct = useCallback(
    async (
      productData: Omit<Product, 'id'> & { id?: string }
    ): Promise<{ success: boolean; message: string; data?: Product }> => {
      try {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        const result = await safeParseResponse<Product>(res);
        if (result.success && result.data) {
          setProducts((prev) => [result.data!, ...prev.filter((p) => p.id !== result.data!.id)]);
          addToast('success', 'Service Added!', `"${result.data.name}" is now live in the salon service menu.`);
          return { success: true, message: 'Service added successfully', data: result.data };
        } else {
          const errMsg = result.error || 'Failed to add service.';
          addToast('error', 'Add Failed', errMsg);
          return { success: false, message: errMsg };
        }
      } catch (err) {
        addToast('error', 'Network Error', 'Could not create service.');
        return { success: false, message: 'Network error occurred.' };
      }
    },
    [addToast]
  );

  // Delete Product with Case-Sensitive Name Verification
  const deleteProduct = useCallback(
    async (
      productId: string,
      productNameVerification: string
    ): Promise<{ success: boolean; message: string }> => {
      try {
        const target = products.find((p) => p.id === productId);
        if (!target) {
          addToast('error', 'Service Not Found', `No service matches code "${productId}".`);
          return { success: false, message: `No service found with code "${productId}".` };
        }

        // Strict case-sensitive name verification
        if (productNameVerification !== target.name) {
          addToast(
            'error',
            'Verification Failed',
            'Entered service name does not match the exact case-sensitive name.'
          );
          return {
            success: false,
            message: `Verification mismatch: "${productNameVerification}" does not match exact name "${target.name}".`
          };
        }

        const res = await fetch(`/api/products?id=${encodeURIComponent(productId)}`, {
          method: 'DELETE'
        });
        const result = await safeParseResponse(res);

        if (result.success) {
          setProducts((prev) => prev.filter((p) => p.id !== productId));
          setCart((prev) => prev.filter((item) => item.product.id !== productId));
          setWishlist((prev) => prev.filter((p) => p.id !== productId));
          if (quickViewProduct?.id === productId) {
            setQuickViewProduct(null);
          }
          addToast('success', 'Service Deleted', `"${target.name}" (${productId}) was deleted.`);
          return { success: true, message: `Service "${target.name}" was successfully deleted.` };
        } else {
          const errMsg = result.error || 'Failed to delete service on server.';
          addToast('error', 'Delete Failed', errMsg);
          return { success: false, message: errMsg };
        }
      } catch (err) {
        addToast('error', 'Network Error', 'Could not delete service.');
        return { success: false, message: 'Network error occurred.' };
      }
    },
    [products, addToast, quickViewProduct, setQuickViewProduct]
  );

  // Load from local storage and initial APIs on mount
  useEffect(() => {
    let isMounted = true;

    const initData = async () => {
      try {
        const savedSettings = localStorage.getItem('glowora_site_settings');
        if (savedSettings && isMounted) {
          try {
            const parsed = JSON.parse(savedSettings);
            if (parsed) {
              setSettings((prev) => ({
                ...prev,
                ...parsed,
                customization: {
                  ...(prev.customization || DEFAULT_CUSTOMIZATION),
                  ...(parsed.customization || {})
                }
              }));
            }
          } catch (e) {}
        }

        const savedCart = localStorage.getItem('glowora_cart');
        if (savedCart && isMounted) {
          try {
            setCart(JSON.parse(savedCart));
          } catch (e) {}
        }

        const savedWishlist = localStorage.getItem('glowora_wishlist');
        if (savedWishlist && isMounted) {
          try {
            setWishlist(JSON.parse(savedWishlist));
          } catch (e) {}
        }

        const savedInquiries = localStorage.getItem('glowora_local_inquiries');
        if (savedInquiries && isMounted) {
          try {
            const parsed = JSON.parse(savedInquiries);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setInquiries((prev) => {
                const combined = [...parsed];
                for (const item of prev) {
                  if (!combined.find((c) => c.id === item.id)) combined.push(item);
                }
                return combined;
              });
            }
          } catch (e) {}
        }
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }

      // Initial background sync
      await Promise.allSettled([
        refreshProducts(),
        refreshInquiries(),
        refreshOrders(),
        refreshSettings()
      ]);
    };

    initData();

    // Cross-device auto sync (every 6 seconds) + on window focus / tab visibility
    const syncInterval = setInterval(() => {
      refreshSettings();
      refreshProducts();
    }, 6000);

    const handleFocusSync = () => {
      refreshSettings();
      refreshProducts();
      refreshInquiries();
      refreshOrders();
    };

    window.addEventListener('focus', handleFocusSync);
    document.addEventListener('visibilitychange', handleFocusSync);

    return () => {
      isMounted = false;
      clearInterval(syncInterval);
      window.removeEventListener('focus', handleFocusSync);
      document.removeEventListener('visibilitychange', handleFocusSync);
    };
  }, [refreshProducts, refreshInquiries, refreshOrders, refreshSettings]);

  // Sync settings and customization to local storage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && settings) {
        localStorage.setItem('glowora_site_settings', JSON.stringify(settings));
        if (settings.customization) {
          localStorage.setItem('glowora_customization', JSON.stringify(settings.customization));
        }
      }
    } catch (e) {}
  }, [settings]);

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('glowora_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // Sync wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('glowora_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  // Cart operations
  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      playAudio('addToCart');
      setCart((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { product, quantity }];
      });
      addToast('success', 'Added to Cart 🛍️', `${product.name} has been added.`);
    },
    [addToast, playAudio]
  );

  const removeFromCart = useCallback((productId: string) => {
    playAudio('click');
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, [playAudio]);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    playAudio('click');
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  }, [playAudio]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const applyDiscountCode = useCallback(
    (code: string): boolean => {
      const clean = code.trim().toUpperCase();
      if (clean === 'GLOW20' || clean === 'SAQIB20') {
        playAudio('checkoutSuccess');
        setDiscountCode(clean);
        setDiscountPercent(20);
        addToast('success', 'Coupon Applied! ✨', '20% off has been applied to your entire order.');
        return true;
      } else if (clean === 'GLOW30') {
        playAudio('checkoutSuccess');
        setDiscountCode(clean);
        setDiscountPercent(30);
        addToast('success', 'VIP Coupon Applied! 🌟', '30% off has been applied!');
        return true;
      } else {
        playAudio('click');
        addToast('error', 'Invalid Coupon', 'Try using code GLOW20 for 20% discount.');
        return false;
      }
    },
    [addToast, playAudio]
  );

  // Wishlist operations
  const toggleWishlist = useCallback(
    (product: Product) => {
      playAudio('wishlist');
      setWishlist((prev) => {
        const exists = prev.some((item) => item.id === product.id);
        if (exists) {
          addToast('info', 'Removed from Wishlist', `${product.name} removed.`);
          return prev.filter((item) => item.id !== product.id);
        } else {
          addToast('success', 'Saved to Wishlist ❤️', `${product.name} saved.`);
          return [...prev, product];
        }
      });
    },
    [addToast, playAudio]
  );

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.some((item) => item.id === productId);
    },
    [wishlist]
  );

  // Contact Modal helpers
  const openContactWithPrefill = useCallback((subject?: string, serviceType?: string) => {
    playAudio('modalToggle');
    setContactPrefill({ subject, serviceType });
    setIsContactModalOpenState(true);
  }, [playAudio]);

  // Inquiries submission
  const submitInquiry = useCallback(
    async (inquiryData: {
      name: string;
      email: string;
      phone?: string;
      subject: string;
      serviceType: UserInquiry['serviceType'];
      message: string;
    }) => {
      try {
        const res = await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inquiryData)
        });
        const result = await safeParseResponse<UserInquiry>(res);
        if (result.success && result.data) {
          setInquiries((prev) => [result.data!, ...prev]);
          try {
            const current = JSON.parse(localStorage.getItem('glowora_local_inquiries') || '[]');
            localStorage.setItem('glowora_local_inquiries', JSON.stringify([result.data, ...current]));
          } catch (e) {}
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
          addToast('success', 'Inquiry Sent Successfully! 📬', 'Muhammad Saqib will respond shortly.');
          return { success: true, message: result.message || 'Inquiry sent' };
        } else {
          addToast('error', 'Submission Error', result.error || 'Failed to submit inquiry.');
          return { success: false, message: result.error || 'Failed to submit' };
        }
      } catch (err) {
        addToast('error', 'Network Error', 'Please check your connection and retry.');
        return { success: false, message: 'Network connection issue' };
      }
    },
    [addToast]
  );

  const updateInquiryStatus = useCallback(
    async (id: string, status: UserInquiry['status'], replyText?: string): Promise<boolean> => {
      try {
        const res = await fetch('/api/inquiries', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status, replySent: replyText })
        });
        const result = await safeParseResponse<UserInquiry>(res);
        if (result.success && result.data) {
          setInquiries((prev) =>
            prev.map((item) => (item.id === id ? result.data! : item))
          );
          addToast('success', 'Status Updated', `Inquiry marked as ${status}.`);
          return true;
        }
        return false;
      } catch (err) {
        addToast('error', 'Update Failed', 'Could not sync update to server.');
        return false;
      }
    },
    [addToast]
  );

  const deleteInquiryItem = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/inquiries?id=${id}`, { method: 'DELETE' });
        const result = await safeParseResponse(res);
        if (result.success) {
          setInquiries((prev) => prev.filter((item) => item.id !== id));
          addToast('info', 'Inquiry Deleted', 'Item removed from database.');
          return true;
        }
        return false;
      } catch (err) {
        return false;
      }
    },
    [addToast]
  );

  // Orders
  const createOrder = useCallback(
    async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<boolean> => {
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });
        const result = await safeParseResponse<Order>(res);
        if (result.success && result.data) {
          setOrders((prev) => [result.data!, ...prev]);
          clearCart();
          playAudio('checkoutSuccess');
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.5 }
          });
          addToast('success', 'Order Confirmed! 🎉', `Order #${result.data.id} placed successfully.`);
          return true;
        }
        return false;
      } catch (err) {
        addToast('error', 'Checkout Error', 'Failed to submit order.');
        return false;
      }
    },
    [addToast, clearCart, playAudio]
  );

  const updateOrderStatus = useCallback(
    async (id: string, status: Order['status']): Promise<boolean> => {
      try {
        const res = await fetch('/api/orders', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status })
        });
        const result = await safeParseResponse<Order>(res);
        if (result.success && result.data) {
          setOrders((prev) =>
            prev.map((item) => (item.id === id ? result.data! : item))
          );
          addToast('success', 'Order Status Updated', `Order marked as ${status}.`);
          return true;
        }
        return false;
      } catch (err) {
        return false;
      }
    },
    [addToast]
  );

  // Settings
  const updateSiteSettings = useCallback(
    async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
      // Optimistic update
      setSettings((prev) => {
        const updated = {
          ...prev,
          ...newSettings
        };
        try {
          localStorage.setItem('glowora_site_settings', JSON.stringify(updated));
          if (updated.customization) {
            localStorage.setItem('glowora_customization', JSON.stringify(updated.customization));
          }
        } catch (e) {}
        return updated;
      });

      try {
        const res = await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSettings)
        });
        const result = await safeParseResponse<SiteSettings>(res);
        if (result.success && result.data) {
          setSettings(result.data);
          try {
            localStorage.setItem('glowora_site_settings', JSON.stringify(result.data));
            if (result.data.customization) {
              localStorage.setItem('glowora_customization', JSON.stringify(result.data.customization));
            }
          } catch (e) {}
          addToast('success', 'Settings Saved', 'Site configuration updated live.');
          return true;
        }
        return true; // Still true because optimistic state was saved locally
      } catch (err) {
        return true; // Local state remains intact
      }
    },
    [addToast]
  );

  // Upload image to server and manage filesystem storage
  const uploadImage = useCallback(
    async (fileOrBase64: File | string, slotKey: string): Promise<{ success: boolean; url?: string; error?: string }> => {
      try {
        let res: Response;
        if (typeof fileOrBase64 === 'string') {
          res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64: fileOrBase64, slotKey })
          });
        } else {
          const formData = new FormData();
          formData.append('file', fileOrBase64);
          formData.append('slotKey', slotKey);
          res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });
        }
        const result = await safeParseResponse<{ url: string; filename: string }>(res);
        if (result.success && result.data?.url) {
          return { success: true, url: result.data.url };
        }
        return { success: false, error: result.error || 'Failed to upload image to server' };
      } catch (err: any) {
        return { success: false, error: err?.message || 'Network error during image upload' };
      }
    },
    []
  );

  // Customization helper
  const updateCustomization = useCallback(
    async (customUpdates: Partial<SiteCustomization>): Promise<boolean> => {
      const existing = settings.customization || DEFAULT_CUSTOMIZATION;
      const merged: SiteCustomization = {
        ...existing,
        ...customUpdates,
        colors: {
          ...existing.colors,
          ...(customUpdates.colors || {})
        },
        images: {
          ...existing.images,
          ...(customUpdates.images || {}),
          categoryImages: {
            ...(existing.images?.categoryImages || {}),
            ...(customUpdates.images?.categoryImages || {})
          }
        },
        sounds: {
          ...existing.sounds,
          ...(customUpdates.sounds || {}),
          triggers: {
            ...(existing.sounds?.triggers || {}),
            ...(customUpdates.sounds?.triggers || {})
          }
        }
      };
      return updateSiteSettings({ customization: merged });
    },
    [settings.customization, updateSiteSettings]
  );

  // Derived calculations
  const rawSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const cartTotal = rawSubtotal * (1 - discountPercent / 100);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        products,
        isLoadingProducts,
        refreshProducts,
        addProduct,
        deleteProduct,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        quickViewProduct,
        setQuickViewProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        cartCount,
        discountCode,
        discountPercent,
        applyDiscountCode,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        isContactModalOpen,
        setIsContactModalOpen,
        contactPrefill,
        openContactWithPrefill,
        isPortfolioModalOpen,
        setIsPortfolioModalOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        inquiries,
        submitInquiry,
        updateInquiryStatus,
        deleteInquiryItem,
        refreshInquiries,
        orders,
        createOrder,
        updateOrderStatus,
        settings,
        customization,
        updateSiteSettings,
        updateCustomization,
        uploadImage,
        refreshSettings,
        playAudio,
        testAudio,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
