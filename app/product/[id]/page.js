import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import CountdownTimer from '@/components/CountdownTimer'
import ProductClientSection from './ProductClientSection'
import ProductReviews from './ProductReviews' // سننشئ هذا المكون

export const revalidate = 60

async function getProduct(id) {
  const { data } = await supabase.from('products').select('*').eq('id', id).single()
  return data
}

async function getSettings() {
  const { data } = await supabase.from('settings').select('*')
  const s = {}
  data?.forEach(r => s[r.key] = r.value)
  return s
}

async function getProductReviews(productId) {
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
  return data || []
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id)
  if (!product) notFound()

  const settings = await getSettings()
  const reviews = await getProductReviews(params.id)
  const disc = product.old_price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : null

  // حساب متوسط التقييمات
  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <div>
      <Navbar showBack={true} backHref="/" backLabel="المنتجات" />

      {/* Breadcrumb */}
      <div style={{ background: 'white', borderBottom: '1px solid #e9ecef', padding: '12px 24px', fontSize: '13px', color: '#6c757d' }}>
        <a href="/" style={{ color: '#6c757d', textDecoration: 'none' }}>الرئيسية</a>
        {' / '}{product.name}
      </div>

      <div style={{
        maxWidth: '1100px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) 16px',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
        gap: 'clamp(24px, 4vw, 60px)', alignItems: 'start'
      }}>

        {/* Gallery and product info (existing client component) */}
        <ProductClientSection product={product} settings={settings} disc={disc} />

        {/* Reviews section */}
        <ProductReviews 
          productId={product.id} 
          initialReviews={reviews} 
          averageRating={averageRating} 
        />
      </div>

      <footer style={{ background: '#0a0a0f', color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '24px', fontSize: '13px', marginTop: '40px' }}>
        © 2025 Dzair Express
      </footer>
    </div>
  )
}