export type ProductCategory =
  | 'All'
  | 'Skin Care'
  | 'Hair Care'
  | 'Body Care'
  | 'Makeup'
  | 'Mehndi Designs'
  | 'Health & Wellness'
  | 'Sensitive Skin'
  | 'Serums'
  | 'Moisturizers'
  | 'Cleansers';

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  tag?: 'Bestseller' | 'New' | 'Top Rated' | 'Sale' | '20% OFF' | '70% Peach Extract';
  image: string;
  volume: string; // Used as Service Duration / Package scope e.g. "60 Mins Session"
  description: string;
  ingredients?: string[]; // Ingredients or key active salon serums used in treatment
  benefits?: string[]; // Treatment benefits
  howToUse?: string; // Treatment procedure & aftercare
  inStock: boolean; // Available for appointment booking
  featured?: boolean;
  isSensitiveCare?: boolean;
  makeupType?: 'Face' | 'Cheek' | 'Eye' | 'Lip';
  makeupStyles?: string[];
  duration?: string;
  specialist?: string;
}

export type SalonService = Product;

export type InquiryStatus = 'new' | 'in_progress' | 'resolved' | 'archived';
export type InquiryPriority = 'normal' | 'high' | 'urgent';

export interface UserInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  serviceType:
    | 'Salon Appointment & Booking'
    | 'Bridal Makeover Consultation'
    | 'Skin & Facial Treatment Inquiry'
    | 'Mehndi Artistry Booking'
    | 'Hair Styling & Keratin Consultation'
    | 'General Salon Inquiry'
    | 'Skincare Consultation'
    | 'Order Question'
    | 'Website Development'
    | 'AI Solution'
    | 'UI/UX Design'
    | 'General Inquiry';
  message: string;
  status: InquiryStatus;
  priority: InquiryPriority;
  createdAt: string;
  adminNotes?: string;
  replySent?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string; // Salon branch / home visit address or booking location
  city: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: 'Cash on Delivery' | 'Credit Card' | 'JazzCash / EasyPaisa';
  createdAt: string;
  appointmentDate?: string;
  appointmentTime?: string;
  preferredStylist?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Saqib Visuals' | 'Skincare & Orders' | 'Development Services';
}

export interface CategoryInfo {
  id: string;
  name: string;
  productsCount: string;
  image: string;
  description: string;
}

export type SoundTheme = 'crystal' | 'modern' | 'spa' | 'playful' | 'minimal' | 'muted';
export type SoundType = 'click' | 'addToCart' | 'wishlist' | 'modalToggle' | 'checkoutSuccess' | 'filterChange';

export type ColorThemePreset =
  | 'blush-rose'
  | 'luxury-gold'
  | 'royal-violet'
  | 'emerald-spa'
  | 'sunset-coral'
  | 'ocean-breeze'
  | 'midnight-luxe'
  | 'minimal-mono'
  | 'custom';

export interface SoundSettings {
  theme: SoundTheme;
  enabled: boolean;
  volume: number; // 0 to 1
  triggers: {
    click: boolean;
    addToCart: boolean;
    wishlist: boolean;
    modalToggle: boolean;
    checkoutSuccess: boolean;
    filterChange: boolean;
  };
}

export interface ColorSettings {
  preset: ColorThemePreset;
  headingColor: string;
  bodyTextColor: string;
  mutedTextColor: string;
  primaryAccentColor: string;
  secondaryAccentColor: string;
  canvasBgColor: string;
  cardBgColor: string;
  heroBgGradientStart: string;
  heroBgGradientEnd: string;
  promoBanner1Bg: string;
  promoBanner2Bg: string;
  badgeBgColor: string;
  badgeTextColor: string;
}

export interface WebsiteImagesSettings {
  heroModelImage: string;
  promoBanner1Image: string;
  promoBanner2Image: string;
  naturalGlowSectionImage: string;
  sensitiveSkinSectionImage: string;
  antiPigmentationImage: string;
  essentialsKitImage: string;
  biggestLaunchImage: string;
  glowcareSecretImage: string;
  beforeImage: string;
  afterImage: string;
  multipleUsagesImage?: string;
  makeoverBannerImage?: string;
  categoryImages: Record<string, string>;
}

export interface SiteCustomization {
  colors: ColorSettings;
  images: WebsiteImagesSettings;
  sounds: SoundSettings;
}

export interface SiteSettings {
  announcementText: string;
  announcementActive: boolean;
  heroBadgeText: string;
  heroTitle: string;
  heroSubtitle: string;
  promoDiscountPercent: number;
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  customization?: SiteCustomization;
}

