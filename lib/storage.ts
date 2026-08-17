import fs from 'fs';
import path from 'path';
import { Product, UserInquiry, SiteSettings, Order } from './types';
import { INITIAL_PRODUCTS, INITIAL_INQUIRIES, INITIAL_SITE_SETTINGS } from './data';
import { DEFAULT_CUSTOMIZATION } from './customizationPresets';

interface GlobalStore {
  products: Product[];
  inquiries: UserInquiry[];
  settings: SiteSettings;
  orders: Order[];
  uploadedImages?: Record<string, string>; // slotKey -> relative filepath
}

declare global {
  var __GLOWORA_STORE__: GlobalStore | undefined;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'glowora_store.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

function ensureDirectories() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  } catch (err) {
    console.error('Failed to ensure data/uploads directories:', err);
  }
}

function getDefaultStore(): GlobalStore {
  return {
    products: [...INITIAL_PRODUCTS],
    inquiries: [...INITIAL_INQUIRIES],
    settings: { ...INITIAL_SITE_SETTINGS },
    orders: [
      {
        id: 'ord-5001',
        customerName: 'Sana Tariq',
        customerEmail: 'sana.tariq@gmail.com',
        customerPhone: '+92 300 4567890',
        shippingAddress: 'House 42, Gulberg III',
        city: 'Lahore',
        items: [
          {
            productId: 'prod-peach-70-serum',
            productName: 'Peach 70 Niacin Serum',
            price: 24.99,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop'
          }
        ],
        totalAmount: 49.98,
        status: 'Shipped',
        paymentMethod: 'Cash on Delivery',
        createdAt: '2026-08-15T06:10:00Z'
      }
    ],
    uploadedImages: {}
  };
}

function getStore(): GlobalStore {
  ensureDirectories();

  // Try reading from persistent JSON file on disk first
  if (fs.existsSync(DATA_FILE)) {
    try {
      const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(fileData);
      if (parsed && Array.isArray(parsed.products) && parsed.settings) {
        const defaultStore = getDefaultStore();
        const mergedStore: GlobalStore = {
          ...defaultStore,
          ...parsed,
          settings: {
            ...defaultStore.settings,
            ...parsed.settings,
            customization: {
              ...DEFAULT_CUSTOMIZATION,
              ...(parsed.settings?.customization || {}),
              colors: {
                ...DEFAULT_CUSTOMIZATION.colors,
                ...(parsed.settings?.customization?.colors || {})
              },
              images: {
                ...DEFAULT_CUSTOMIZATION.images,
                ...(parsed.settings?.customization?.images || {}),
                categoryImages: {
                  ...DEFAULT_CUSTOMIZATION.images.categoryImages,
                  ...(parsed.settings?.customization?.images?.categoryImages || {})
                }
              },
              sounds: {
                ...DEFAULT_CUSTOMIZATION.sounds,
                ...(parsed.settings?.customization?.sounds || {}),
                triggers: {
                  ...DEFAULT_CUSTOMIZATION.sounds.triggers,
                  ...(parsed.settings?.customization?.sounds?.triggers || {})
                }
              }
            }
          },
          uploadedImages: parsed.uploadedImages || {}
        };

        // Ensure any uploaded image record in uploadedImages is mapped to the corresponding image slot
        if (mergedStore.uploadedImages && mergedStore.settings.customization?.images) {
          for (const [slot, filename] of Object.entries(mergedStore.uploadedImages)) {
            const relUrl = `/uploads/${filename}`;
            if (slot.startsWith('category:')) {
              const catKey = slot.replace('category:', '');
              if (mergedStore.settings.customization.images.categoryImages) {
                mergedStore.settings.customization.images.categoryImages[catKey] = relUrl;
              }
            } else if (slot.startsWith('product:')) {
              const prodId = slot.replace('product:', '');
              const pIdx = mergedStore.products.findIndex((p) => p.id === prodId);
              if (pIdx !== -1) {
                mergedStore.products[pIdx].image = relUrl;
              }
            } else {
              (mergedStore.settings.customization.images as any)[slot] = relUrl;
            }
          }
        }

        globalThis.__GLOWORA_STORE__ = mergedStore;
        return mergedStore;
      }
    } catch (err) {
      console.warn('Failed to parse database file, checking in-memory or fallback:', err);
    }
  }

  // If in-memory store is active, return it
  if (globalThis.__GLOWORA_STORE__) {
    return globalThis.__GLOWORA_STORE__;
  }

  // Fallback to default and persist to file
  const initial = getDefaultStore();
  globalThis.__GLOWORA_STORE__ = initial;
  saveStore(initial);
  return initial;
}

function saveStore(store: GlobalStore) {
  try {
    ensureDirectories();
    const tempFile = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(store, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
  } catch (err) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
    } catch (writeErr) {
      console.error('Failed to save database to disk:', writeErr);
    }
  }
}

export const serverDb = {
  // Inquiries
  getInquiries: (): UserInquiry[] => {
    return [...getStore().inquiries];
  },
  addInquiry: (inquiry: Omit<UserInquiry, 'id' | 'createdAt' | 'status' | 'priority'> & Partial<UserInquiry>): UserInquiry => {
    const store = getStore();
    const newInquiry: UserInquiry = {
      id: `inq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone || '',
      subject: inquiry.subject,
      serviceType: inquiry.serviceType || 'General Inquiry',
      message: inquiry.message,
      status: inquiry.status || 'new',
      priority: inquiry.priority || 'normal',
      createdAt: new Date().toISOString(),
      adminNotes: inquiry.adminNotes || '',
      replySent: inquiry.replySent || ''
    };
    store.inquiries.unshift(newInquiry);
    saveStore(store);
    return newInquiry;
  },
  updateInquiry: (id: string, updates: Partial<UserInquiry>): UserInquiry | null => {
    const store = getStore();
    const index = store.inquiries.findIndex((i) => i.id === id);
    if (index === -1) return null;
    store.inquiries[index] = { ...store.inquiries[index], ...updates };
    saveStore(store);
    return store.inquiries[index];
  },
  deleteInquiry: (id: string): boolean => {
    const store = getStore();
    const initialLen = store.inquiries.length;
    store.inquiries = store.inquiries.filter((i) => i.id !== id);
    if (store.inquiries.length < initialLen) {
      saveStore(store);
      return true;
    }
    return false;
  },

  // Products
  getProducts: (): Product[] => {
    return [...getStore().products];
  },
  addProduct: (product: Omit<Product, 'id'> & { id?: string }): Product => {
    const store = getStore();
    const newProduct: Product = {
      ...product,
      id: product.id || `prod-${Date.now()}`
    };
    store.products.unshift(newProduct);
    saveStore(store);
    return newProduct;
  },
  updateProduct: (id: string, updates: Partial<Product>): Product | null => {
    const store = getStore();
    const index = store.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    store.products[index] = { ...store.products[index], ...updates };
    saveStore(store);
    return store.products[index];
  },
  deleteProduct: (id: string): boolean => {
    const store = getStore();
    const initialLen = store.products.length;
    store.products = store.products.filter((p) => p.id !== id);
    if (store.products.length < initialLen) {
      saveStore(store);
      return true;
    }
    return false;
  },

  // Orders
  getOrders: (): Order[] => {
    return [...getStore().orders];
  },
  addOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'> & { status?: Order['status'] }): Order => {
    const store = getStore();
    const newOrder: Order = {
      id: `ord-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      status: orderData.status || 'Pending',
      ...orderData
    };
    store.orders.unshift(newOrder);
    saveStore(store);
    return newOrder;
  },
  updateOrder: (id: string, status: Order['status']): Order | null => {
    const store = getStore();
    const index = store.orders.findIndex((o) => o.id === id);
    if (index === -1) return null;
    store.orders[index] = { ...store.orders[index], status };
    saveStore(store);
    return store.orders[index];
  },

  // Settings & Customization
  getSettings: (): SiteSettings => {
    return { ...getStore().settings };
  },
  updateSettings: (updates: Partial<SiteSettings>): SiteSettings => {
    const store = getStore();
    const existingCustomization = store.settings.customization || { ...INITIAL_SITE_SETTINGS.customization! };
    
    let mergedCustomization = existingCustomization;
    if (updates.customization) {
      const incoming = updates.customization;
      mergedCustomization = {
        ...existingCustomization,
        ...incoming,
        colors: {
          ...existingCustomization.colors,
          ...(incoming.colors || {})
        },
        images: {
          ...existingCustomization.images,
          ...(incoming.images || {}),
          categoryImages: {
            ...(existingCustomization.images?.categoryImages || {}),
            ...(incoming.images?.categoryImages || {})
          }
        },
        sounds: {
          ...existingCustomization.sounds,
          ...(incoming.sounds || {}),
          triggers: {
            ...(existingCustomization.sounds?.triggers || {}),
            ...(incoming.sounds?.triggers || {})
          }
        }
      };
    }

    store.settings = {
      ...store.settings,
      ...updates,
      customization: mergedCustomization
    };

    // Keep uploadedImages map in sync with current active images
    if (mergedCustomization.images && store.uploadedImages) {
      for (const [key, val] of Object.entries(mergedCustomization.images)) {
        if (key === 'categoryImages' && typeof val === 'object' && val) {
          for (const [catKey, catUrl] of Object.entries(val)) {
            const slotKey = `category:${catKey}`;
            if (typeof catUrl === 'string' && catUrl.startsWith('/uploads/')) {
              store.uploadedImages[slotKey] = catUrl.replace('/uploads/', '');
            } else if (store.uploadedImages[slotKey]) {
              const oldFile = path.join(UPLOADS_DIR, store.uploadedImages[slotKey]);
              try { if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile); } catch (e) {}
              delete store.uploadedImages[slotKey];
            }
          }
        } else if (typeof val === 'string') {
          if (val.startsWith('/uploads/')) {
            store.uploadedImages[key] = val.replace('/uploads/', '');
          } else if (store.uploadedImages[key]) {
            const oldFile = path.join(UPLOADS_DIR, store.uploadedImages[key]);
            try { if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile); } catch (e) {}
            delete store.uploadedImages[key];
          }
        }
      }
    }

    saveStore(store);
    return { ...store.settings };
  },

  // Image Upload File Management
  saveUploadedImage: (slotKey: string, relativeUrl: string, diskFilename: string): { settings: SiteSettings; url: string } => {
    const store = getStore();
    ensureDirectories();
    if (!store.uploadedImages) {
      store.uploadedImages = {};
    }

    // If an image previously existed for this slot, delete the old file from disk if different
    const previousFilename = store.uploadedImages[slotKey];
    if (previousFilename && previousFilename !== diskFilename) {
      const oldFilePath = path.join(UPLOADS_DIR, previousFilename);
      try {
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      } catch (err) {
        console.warn(`Failed to clean up old image file ${oldFilePath}:`, err);
      }
    }

    store.uploadedImages[slotKey] = diskFilename;

    // Directly bind the new permanent URL to the customization or product record
    if (!store.settings.customization) {
      store.settings.customization = { ...DEFAULT_CUSTOMIZATION };
    }
    if (!store.settings.customization.images) {
      store.settings.customization.images = { ...DEFAULT_CUSTOMIZATION.images };
    }

    if (slotKey.startsWith('category:')) {
      const catKey = slotKey.replace('category:', '');
      if (!store.settings.customization.images.categoryImages) {
        store.settings.customization.images.categoryImages = { ...DEFAULT_CUSTOMIZATION.images.categoryImages };
      }
      store.settings.customization.images.categoryImages[catKey] = relativeUrl;
    } else if (slotKey.startsWith('product:')) {
      const prodId = slotKey.replace('product:', '');
      const pIdx = store.products.findIndex((p) => p.id === prodId);
      if (pIdx !== -1) {
        store.products[pIdx].image = relativeUrl;
      }
    } else {
      (store.settings.customization.images as any)[slotKey] = relativeUrl;
    }

    saveStore(store);
    return { settings: { ...store.settings }, url: relativeUrl };
  },

  removeUploadedImage: (slotKey: string) => {
    const store = getStore();
    if (!store.uploadedImages) return;
    const filename = store.uploadedImages[slotKey];
    if (filename) {
      const filePath = path.join(UPLOADS_DIR, filename);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.warn(`Failed to delete image file ${filePath}:`, err);
      }
      delete store.uploadedImages[slotKey];
      saveStore(store);
    }
  }
};
