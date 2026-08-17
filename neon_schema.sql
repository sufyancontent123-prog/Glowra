-- ============================================================================
-- NEON POSTGRESQL DYNAMIC DATABASE SCHEMA & SEED SCRIPT
-- Project: Elyra Glowcare & Beauty E-Commerce Store
-- Compatible with: Neon Serverless Postgres, Supabase, Standard PostgreSQL 14+
-- ============================================================================

-- 1. EXTENSIONS & PREREQUISITES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. ENUMS & DOMAINS
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE order_status_enum AS ENUM ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method_enum AS ENUM ('Cash on Delivery', 'Credit Card', 'JazzCash / EasyPaisa', 'Stripe', 'Bank Transfer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE inquiry_status_enum AS ENUM ('new', 'in_progress', 'resolved', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE inquiry_priority_enum AS ENUM ('normal', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 3. TIMESTAMP UPDATE FUNCTION & TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 4. TABLES DEFINITION
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table: categories
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(128) UNIQUE,
    products_count VARCHAR(64) DEFAULT '0 Products',
    image TEXT NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_categories
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- Table: products
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id VARCHAR(64) REFERENCES categories(id) ON DELETE SET NULL,
    category_name VARCHAR(128) NOT NULL,
    subcategory VARCHAR(128),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10, 2) CHECK (original_price >= price OR original_price IS NULL),
    rating NUMERIC(3, 2) DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5),
    reviews_count INT DEFAULT 0 CHECK (reviews_count >= 0),
    tag VARCHAR(64),
    image TEXT NOT NULL,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    volume VARCHAR(64) DEFAULT '50ml',
    description TEXT NOT NULL,
    ingredients JSONB DEFAULT '[]'::jsonb,
    benefits JSONB DEFAULT '[]'::jsonb,
    how_to_use TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_sensitive_care BOOLEAN DEFAULT FALSE,
    makeup_type VARCHAR(64),
    makeup_styles JSONB DEFAULT '[]'::jsonb,
    stock_quantity INT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_products
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- Table: orders
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(64) NOT NULL,
    shipping_address TEXT NOT NULL,
    city VARCHAR(128) NOT NULL,
    postal_code VARCHAR(32),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    subtotal_amount NUMERIC(10, 2) CHECK (subtotal_amount >= 0),
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    coupon_code VARCHAR(64),
    status order_status_enum DEFAULT 'Pending',
    payment_method payment_method_enum DEFAULT 'Cash on Delivery',
    is_paid BOOLEAN DEFAULT FALSE,
    tracking_number VARCHAR(128),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_orders
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- Table: order_items
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- Table: user_inquiries (Customer Consultations & Service Bookings)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_inquiries (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(64),
    subject VARCHAR(255) NOT NULL,
    service_type VARCHAR(128) NOT NULL,
    message TEXT NOT NULL,
    status inquiry_status_enum DEFAULT 'new',
    priority inquiry_priority_enum DEFAULT 'normal',
    admin_notes TEXT,
    reply_sent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_user_inquiries
BEFORE UPDATE ON user_inquiries
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- Table: reviews (Product Ratings & Testimonials)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    verified_purchase BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- Table: discount_coupons
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS discount_coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(64) UNIQUE NOT NULL,
    discount_percent NUMERIC(5, 2) NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
    min_spend NUMERIC(10, 2) DEFAULT 0.00,
    max_discount NUMERIC(10, 2),
    usage_limit INT DEFAULT 1000,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- Table: site_customization (Dynamic Theme, Media Assets & Sound Settings)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_customization (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'default',
    theme_preset VARCHAR(64) DEFAULT 'blush-rose',
    heading_color VARCHAR(32) DEFAULT '#18181b',
    body_text_color VARCHAR(32) DEFAULT '#52525b',
    muted_text_color VARCHAR(32) DEFAULT '#a1a1aa',
    primary_accent_color VARCHAR(32) DEFAULT '#db2777',
    secondary_accent_color VARCHAR(32) DEFAULT '#f43f5e',
    canvas_bg_color VARCHAR(32) DEFAULT '#ffffff',
    card_bg_color VARCHAR(32) DEFAULT '#ffffff',
    hero_bg_gradient_start VARCHAR(32) DEFAULT '#fdf2f8',
    hero_bg_gradient_end VARCHAR(32) DEFAULT '#ffffff',
    promo_banner1_bg VARCHAR(32) DEFAULT '#fdf2f8',
    promo_banner2_bg VARCHAR(32) DEFAULT '#ffe4e6',
    badge_bg_color VARCHAR(32) DEFAULT '#fce7f3',
    badge_text_color VARCHAR(32) DEFAULT '#be185d',
    
    -- Dynamic Website Media URLs
    hero_model_image TEXT NOT NULL,
    promo_banner1_image TEXT NOT NULL,
    promo_banner2_image TEXT NOT NULL,
    natural_glow_section_image TEXT NOT NULL,
    sensitive_skin_section_image TEXT NOT NULL,
    anti_pigmentation_image TEXT NOT NULL,
    biggest_launch_image TEXT NOT NULL,
    glowcare_secret_image TEXT NOT NULL,
    before_image TEXT NOT NULL,
    after_image TEXT NOT NULL,
    essentials_kit_image TEXT NOT NULL,
    multiple_usages_image TEXT NOT NULL,
    category_images JSONB DEFAULT '{}'::jsonb,
    
    -- Sound FX Settings
    sound_theme VARCHAR(64) DEFAULT 'crystal',
    sound_enabled BOOLEAN DEFAULT TRUE,
    sound_volume NUMERIC(3, 2) DEFAULT 0.50,
    sound_triggers JSONB DEFAULT '{"click": true, "addToCart": true, "wishlist": true, "modalToggle": true, "checkoutSuccess": true, "filterChange": true}'::jsonb,
    
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_site_customization
BEFORE UPDATE ON site_customization
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- Table: faqs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS faqs (
    id VARCHAR(64) PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(128) NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. PERFORMANCE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_name);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON user_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON user_inquiries(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON discount_coupons(code);

-- ============================================================================
-- 6. VIEWS FOR REPORTING & ANALYTICS
-- ============================================================================

-- View: Detailed Orders with aggregated item array
CREATE OR REPLACE VIEW view_orders_with_items AS
SELECT 
    o.id,
    o.customer_name,
    o.customer_email,
    o.customer_phone,
    o.shipping_address,
    o.city,
    o.total_amount,
    o.status,
    o.payment_method,
    o.is_paid,
    o.created_at,
    COALESCE(
        json_agg(
            json_build_object(
                'item_id', oi.id,
                'product_id', oi.product_id,
                'product_name', oi.product_name,
                'unit_price', oi.unit_price,
                'quantity', oi.quantity,
                'image', oi.image
            )
        ) FILTER (WHERE oi.id IS NOT NULL), '[]'::json
    ) AS items,
    COUNT(oi.id) AS total_items_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;

-- View: Category summary with live product count
CREATE OR REPLACE VIEW view_category_stats AS
SELECT 
    c.id,
    c.name,
    c.image,
    c.description,
    c.is_active,
    COUNT(p.id) AS actual_product_count,
    COALESCE(AVG(p.price), 0.00) AS avg_product_price,
    COALESCE(MIN(p.price), 0.00) AS min_price,
    COALESCE(MAX(p.price), 0.00) AS max_price
FROM categories c
LEFT JOIN products p ON c.id = p.category_id OR c.name = p.category_name
GROUP BY c.id;

-- ============================================================================
-- 7. INITIAL SEED DATA
-- ============================================================================

-- Seed: Categories
INSERT INTO categories (id, name, slug, products_count, image, description, display_order)
VALUES
    ('skin-care', 'Skin Care', 'skin-care', '120+ Products', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop', 'Cleanse, hydrate and protect with clinical-grade active ingredients.', 1),
    ('hair-care', 'Hair Care', 'hair-care', '95+ Products', 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=800&auto=format&fit=crop', 'Deep nourishing shampoos, keratin treatments, and botanical oils.', 2),
    ('body-care', 'Body Care', 'body-care', '80+ Products', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop', 'Luxurious bath salts, softening lotions, and hydrating body scrubs.', 3),
    ('makeup', 'Makeup', 'makeup', '150+ Products', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop', 'Vibrant matte lipsticks, lightweight foundations, and glow balms.', 4),
    ('mehndi-designs', 'Mehndi Designs', 'mehndi-designs', '45+ Designs', '/images/mehndi_bridal_hands_1786879695626.jpg', 'Exquisite bridal & party Mehndi designs for hands and feet with diverse artistic styles & price points.', 5),
    ('health-wellness', 'Health & Wellness', 'health-wellness', '90+ Products', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop', 'Holistic wellness formulas, aromatherapy, and daily vitality boosters.', 6)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    image = EXCLUDED.image,
    description = EXCLUDED.description;

-- Seed: Discount Coupons
INSERT INTO discount_coupons (code, discount_percent, min_spend, is_active)
VALUES
    ('GLOW20', 20.00, 20.00, TRUE),
    ('SALE30', 30.00, 35.00, TRUE),
    ('WELCOME10', 10.00, 15.00, TRUE),
    ('BEAUTY50', 50.00, 100.00, TRUE)
ON CONFLICT (code) DO NOTHING;

-- Seed: Site Customization
INSERT INTO site_customization (
    id,
    theme_preset,
    heading_color,
    body_text_color,
    muted_text_color,
    primary_accent_color,
    secondary_accent_color,
    canvas_bg_color,
    card_bg_color,
    hero_bg_gradient_start,
    hero_bg_gradient_end,
    promo_banner1_bg,
    promo_banner2_bg,
    hero_model_image,
    promo_banner1_image,
    promo_banner2_image,
    natural_glow_section_image,
    sensitive_skin_section_image,
    anti_pigmentation_image,
    biggest_launch_image,
    glowcare_secret_image,
    before_image,
    after_image,
    essentials_kit_image,
    multiple_usages_image,
    category_images
)
VALUES (
    'default',
    'blush-rose',
    '#18181b',
    '#52525b',
    '#a1a1aa',
    '#db2777',
    '#f43f5e',
    '#ffffff',
    '#ffffff',
    '#fdf2f8',
    '#ffffff',
    '#fdf2f8',
    '#ffe4e6',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?q=80&w=900&auto=format&fit=crop',
    '/images/skin_before_acne_1786879205572.jpg',
    '/images/skin_after_glow_1786879190967.jpg',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1608248597359-009f7a77ec81?q=80&w=800&auto=format&fit=crop',
    '{
        "skin-care": "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop",
        "hair-care": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600&auto=format&fit=crop",
        "body-care": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop",
        "makeup": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop",
        "mehndi-designs": "/images/mehndi_bridal_hands_1786879695626.jpg",
        "health-wellness": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop"
    }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Seed: Products
INSERT INTO products (
    id, name, category_id, category_name, subcategory, price, original_price, rating, reviews_count, tag, image, volume, description, ingredients, benefits, how_to_use, in_stock, is_featured, is_sensitive_care
)
VALUES
    ('prod-cetaphil-sun', 'Cetaphil Sun SPF 50+ Light Gel', 'skin-care', 'Sensitive Skin', 'Sun Care', 22.00, 28.00, 4.20, 696, 'Bestseller', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop', '50ml', 'Very high SPF 50+ protection against UVA and UVB rays. Lightweight gel formula that is quickly absorbed with no white cast.', '["Cellular Protection Complex", "Vitamin E", "Glycerin", "Broad Spectrum Filters"]'::jsonb, '["Non-comedogenic", "Water resistant", "Fragrance-free", "Suitable for sensitive skin"]'::jsonb, 'Apply generously to face and neck 20 minutes before sun exposure.', TRUE, TRUE, TRUE),
    ('prod-daily-exfoliating', 'Daily Exfoliating Cleanser', 'skin-care', 'Sensitive Skin', 'Cleansers', 16.50, 21.00, 4.40, 19063, 'New', 'https://images.unsplash.com/photo-1556228722-d0b5d03a5be6?q=80&w=800&auto=format&fit=crop', '178ml', 'Gently buffs away dead skin cells without stripping natural hydration. Packed with soothing micro-exfoliants.', '["Hydrating Glycerin", "Vitamin B5", "Bamboo Micro-beads", "Aloe Vera Leaf Extract"]'::jsonb, '["Maintains skin natural pH", "Non-irritating", "Hypoallergenic", "Dermatologist tested"]'::jsonb, 'Massage gently over damp face using circular motions. Rinse thoroughly with lukewarm water.', TRUE, TRUE, TRUE),
    ('prod-advanced-relief', 'Advanced Relief Lotion', 'skin-care', 'Sensitive Skin', 'Moisturizers', 18.00, 24.00, 4.70, 2800, 'Top Rated', 'https://images.unsplash.com/photo-1608248597359-009f7a77ec81?q=80&w=800&auto=format&fit=crop', '100ml', 'Intense moisture therapy infused with 9 rich moisturizers including Shea Butter and Vitamins E & B3.', '["Shea Butter", "Vitamin E", "Niacinamide (B3)", "Ceramide NP"]'::jsonb, '["48-hour continuous hydration", "Restores moisture barrier in 1 week", "Clinically proven formula"]'::jsonb, 'Smooth generously over dry patches on face and body daily.', TRUE, TRUE, TRUE),
    ('prod-gentle-skin-cleanser', 'Gentle Skin Cleanser', 'skin-care', 'Sensitive Skin', 'Cleansers', 14.00, 18.00, 4.80, 5420, 'Bestseller', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop', '250ml', 'Creamy, non-foaming cleanser for normal to dry, sensitive skin. Enriched with essential vitamins.', '["Niacinamide", "Panthenol", "Hydrating Glycerin", "Purified Water"]'::jsonb, '["Cleanses without stripping barrier", "Preserves natural microbiome", "Soap-free and paraben-free"]'::jsonb, 'Apply with or without water. Wipe off with soft tissue or rinse clean.', TRUE, TRUE, TRUE),
    ('prod-peach-70-niacin', 'Peach 70% Niacin Serum', 'skin-care', 'Skin Care', 'Serums', 24.00, 30.00, 4.90, 1820, '70% Peach Extract', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop', '30ml', 'A clarifying serum powered by 70% Prunus Persica (Peach) Fruit Extract and 5% Niacinamide to restore glass-skin clarity.', '["70% Peach Fruit Extract", "5% Niacinamide", "Desert Yeast Oil", "Triple Hyaluronic Acid"]'::jsonb, '["Visible skin clarity in 14 days", "Fades dark spots & post-acne marks", "Refines rough skin texture"]'::jsonb, 'Dispense 2-3 drops onto clean face and pat gently until absorbed.', TRUE, TRUE, FALSE),
    ('prod-dark-spot-catalyst', 'Dark Spot Correcting Glow Serum', 'skin-care', 'Skin Care', 'Serums', 26.00, 32.00, 4.85, 2140, 'Bestseller', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop', '50ml', 'Formulated with 5% Niacinamide and Rice Bran to correct dark spots and improve uneven skin tone.', '["5% Niacinamide", "Rice Bran Extract", "Plant-derived Squalane", "Sea Buckthorn"]'::jsonb, '["Reduces hyperpigmentation", "Hydrates and brightens", "Non-sticky radiant finish"]'::jsonb, 'Apply a moderate amount after toning. Layer onto areas of concern.', TRUE, TRUE, FALSE),
    ('prod-curated-essentials-bundle', 'Radiant Glow Skincare 5-Step Routine Basket', 'skin-care', 'Skin Care', 'Bundles', 68.00, 98.00, 4.95, 840, 'Sale', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=900&auto=format&fit=crop', 'Complete Set (5 Items)', 'The ultimate 5-piece curated glow routine in an artisanal pink basket. Includes cleanser, toner, niacin serum, barrier cream, and UV shield.', '["Gentle Gel Cleanser", "Hydrating Essence Toner", "Peach 70 Niacin Serum", "Ceramide Barrier Cream", "SPF 50+ UV Shield"]'::jsonb, '["Complete morning & night regimen", "30% bundle savings vs individual price", "Gift-ready presentation"]'::jsonb, 'Follow the numbered 5-step daily routine printed on the box.', TRUE, TRUE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Seed: Sample Inquiries
INSERT INTO user_inquiries (id, name, email, phone, subject, service_type, message, status, priority)
VALUES
    ('inq-101', 'Ayesha Khan', 'ayesha.k@example.com', '+92 300 1234567', 'Skincare Routine Recommendation for Sensitive Skin', 'Skincare Consultation', 'Hi Elyra team! I have reactive, redness-prone skin. Which serum and moisturizer combination do you recommend?', 'new', 'high'),
    ('inq-102', 'Fatima Zahra', 'fatima.z@example.com', '+92 321 9876543', 'Bridal Mehndi Booking for November', 'General Inquiry', 'Looking for bridal mehndi booking for my wedding in Lahore. Please share availability and packages.', 'in_progress', 'normal')
ON CONFLICT (id) DO NOTHING;

-- Seed: Sample FAQs
INSERT INTO faqs (id, question, answer, category, display_order)
VALUES
    ('faq-1', 'Are all Elyra products suitable for sensitive skin?', 'Yes! Every formula undergoes strict dermatological testing, is fragrance-free, hypoallergenic, and non-comedogenic.', 'Skincare & Orders', 1),
    ('faq-2', 'How long does delivery take across Pakistan & Internationally?', 'Domestic standard delivery takes 2-4 business days. Express next-day dispatch is available for major cities.', 'Skincare & Orders', 2),
    ('faq-3', 'Can I customize the colors and banners of this website dynamically?', 'Yes, the admin panel connects directly to the site_customization table, allowing real-time theme and media updates.', 'Development Services', 3)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 8. NEON QUICK VERIFICATION QUERIES (RUN TO TEST)
-- ============================================================================

-- SELECT * FROM view_category_stats;
-- SELECT * FROM view_orders_with_items;
-- SELECT * FROM site_customization WHERE id = 'default';
-- SELECT id, name, price, rating, in_stock FROM products;
