-- =============================================
-- DZAIR EXPRESS - Supabase Database Schema
-- انسخ هذا الكود في Supabase SQL Editor وشغله
-- =============================================

-- جدول المنتجات
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  old_price INTEGER,
  stock INTEGER DEFAULT 100,
  sold INTEGER DEFAULT 0,
  colors TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول الطلبات
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  wilaya TEXT NOT NULL,
  color TEXT,
  size TEXT,
  quantity INTEGER DEFAULT 1,
  total_price INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','shipped','cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- إعدادات المتجر
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- إعدادات افتراضية
INSERT INTO settings (key, value) VALUES
  ('countdown_days', '1'),
  ('countdown_hours', '3'),
  ('countdown_minutes', '47'),
  ('store_phone', '0550000000'),
  ('store_name', 'Dzair Express');

-- صلاحيات القراءة العامة للمنتجات
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "products_admin_all" ON products FOR ALL USING (auth.role() = 'authenticated');

-- صلاحيات الطلبات: أي شخص يقدر يضيف، الأدمن فقط يشوف
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_public_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_admin_all" ON orders FOR ALL USING (auth.role() = 'authenticated');

-- صلاحيات الإعدادات
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_public_read" ON settings FOR SELECT USING (true);
CREATE POLICY "settings_admin_all" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- بيانات تجريبية (اختياري)
INSERT INTO products (name, description, price, old_price, stock, sold, colors, sizes) VALUES
  ('قميص كلاسيك بريميوم', 'قميص عالي الجودة مصنوع من القطن 100%', 1990, 3500, 100, 83, ARRAY['#1a1a2e','#e63946','#2a9d8f'], ARRAY['S','M','L','XL']),
  ('حذاء رياضي إيفو', 'حذاء خفيف ومريح لكل الأنشطة', 2990, 5500, 50, 61, ARRAY['#ffffff','#1a1a2e'], ARRAY['40','41','42','43','44']),
  ('ساعة سمارت ووتش', 'ساعة ذكية بشاشة AMOLED', 3490, 8000, 30, 45, ARRAY['#1a1a2e','#c0c0c0'], ARRAY[]::text[]);
