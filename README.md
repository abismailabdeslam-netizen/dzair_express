# 🛒 Dzair Express — دليل التثبيت الكامل

## المتطلبات
- Node.js 18+
- حساب على [Supabase](https://supabase.com) (مجاني)
- حساب على [Vercel](https://vercel.com) (مجاني)

---

## الخطوة 1: إعداد Supabase

1. اذهب إلى https://supabase.com وأنشئ مشروعاً جديداً
2. اذهب إلى **SQL Editor** والصق محتوى ملف `supabase/schema.sql` وشغله
3. من **Authentication → Users** أضف مستخدم أدمن بإيميل وكلمة مرور قوية
4. من **Project Settings → API** انسخ:
   - `Project URL`
   - `anon public key`
   - `service_role key`

---

## الخطوة 2: إعداد المشروع

```bash
# تثبيت المكتبات
npm install

# انسخ ملف البيئة
cp .env.local.example .env.local
```

افتح `.env.local` وضع فيه بيانات Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## الخطوة 3: تشغيل محلياً

```bash
npm run dev
```

افتح http://localhost:3000

---

## الخطوة 4: النشر على Vercel

```bash
# تثبيت Vercel CLI
npm i -g vercel

# رفع المشروع
vercel
```

أو:
1. ارفع المشروع على GitHub
2. اربطه بـ Vercel
3. أضف متغيرات البيئة في Vercel Dashboard
4. انشر!

---

## الروابط المهمة

| الصفحة | الرابط |
|--------|--------|
| الصفحة الرئيسية | `yourdomain.com` |
| رابط منتج (للإعلان) | `yourdomain.com/product/PRODUCT_ID` |
| لوحة الأدمن | `yourdomain.com/dashboard-x7k2m9` |

---

## كيفية إضافة منتج جديد

1. ادخل لوحة الأدمن
2. اضغط **المنتجات** ← **إضافة منتج**
3. أدخل اسم المنتج، الوصف، السعر القديم، السعر الجديد
4. أضف الألوان والمقاسات
5. ارفع الصور
6. احفظ — سيظهر المنتج فوراً

---

## كيفية استخدام رابط الإعلان

عند إنشاء إعلان على Facebook/Instagram:
- انسخ رابط المنتج: `yourdomain.com/product/PRODUCT_ID`
- الصق الرابط في الإعلان كـ **Website URL**
- المشتري سيدخل مباشرة لصفحة المنتج

---

## الأمان

- رابط الأدمن يحتوي على كود سري: `/dashboard-x7k2m9`
- المصادقة عبر Supabase Auth (مشفرة)
- Row Level Security مفعلة على قاعدة البيانات
- الزبائن لا يمكنهم رؤية طلبات الآخرين

---

## المساعدة

في حال واجهت أي مشكلة، راجع:
- https://supabase.com/docs
- https://nextjs.org/docs
- https://vercel.com/docs
