import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import Navbar from '@/components/Navbar'

export const revalidate = 60

async function getProducts() {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  return data || []
}

export default async function HomePage() {
  const products = await getProducts()

  return (
    <div style={{ background: '#f5f6fa', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f3460 100%)',
        padding: 'clamp(32px, 6vw, 64px) 20px',
        textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          display: 'inline-block', background: '#e63946', color: 'white',
          padding: '6px 18px', borderRadius: '50px', fontSize: '13px',
          fontWeight: 700, marginBottom: '16px'
        }}>
          توصيل لجميع الولايات — الدفع عند الاستلام
        </div>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 46px)', fontWeight: 900, color: 'white', marginBottom: '12px', lineHeight: 1.2 }}>
          تسوق بذكاء مع <span style={{ color: '#f4a261' }}>Dzair Express</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(13px, 2vw, 16px)', maxWidth: '460px', margin: '0 auto 24px', lineHeight: 1.7 }}>
          أفضل المنتجات بأسعار لا تُقاوم — نتصل بك للتأكيد قبل الشحن
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(16px, 4vw, 40px)', flexWrap: 'wrap' }}>
          {[['🗺️ 58', 'ولاية'], ['💳 100%', 'دفع عند الاستلام'], ['📦', 'توصيل سريع']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 900, color: '#f4a261' }}>{num}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Bar */}
      <div style={{ display: 'flex', background: 'white', borderBottom: '1px solid #e9ecef', overflowX: 'auto' }}>
        {[['💳', 'دفع عند الاستلام'], ['✅', 'جودة مضمونة'], ['📞', 'تأكيد هاتفي'], ['🚚', 'توصيل لجميع الولايات']].map(([icon, text]) => (
          <div key={text} style={{ flex: '1', minWidth: '100px', textAlign: 'center', padding: '12px 8px', borderLeft: '1px solid #e9ecef', fontSize: '12px', fontWeight: 600 }}>
            <div style={{ fontSize: '20px', marginBottom: '3px' }}>{icon}</div>
            {text}
          </div>
        ))}
      </div>

      {/* Products List */}
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 900 }}>
            منتجاتنا <span style={{ color: '#e63946' }}>المميزة</span>
          </h2>
          <span style={{ fontSize: '13px', color: '#6c757d', fontWeight: 600 }}>{products.length} منتج</span>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#6c757d', background: 'white', borderRadius: '16px' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>📦</div>
            <p>لا توجد منتجات حالياً</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      <footer style={{ background: '#0a0a0f', color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '20px', fontSize: '12px' }}>
        © 2025 Dzair Express — جميع الحقوق محفوظة
      </footer>
    </div>
  )
}
