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
    <div>
      <Navbar />

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f3460 100%)',
        padding: 'clamp(40px, 8vw, 80px) 24px',
        textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          display: 'inline-block', background: '#e63946', color: 'white',
          padding: '6px 18px', borderRadius: '50px', fontSize: '13px',
          fontWeight: 700, marginBottom: '20px'
        }}>
          توصيل لجميع الولايات — الدفع عند الاستلام
        </div>
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900, color: 'white',
          marginBottom: '14px', lineHeight: 1.2
        }}>
          تسوق بذكاء مع <span style={{ color: '#f4a261' }}>Dzair Express</span>
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(14px, 2vw, 17px)',
          maxWidth: '500px', margin: '0 auto 32px', lineHeight: 1.7
        }}>
          أفضل المنتجات بأسعار لا تُقاوم — نتصل بك للتأكيد قبل الشحن
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(16px, 4vw, 40px)', flexWrap: 'wrap' }}>
          {[['🗺️ 58', 'ولاية'], ['💳 100%', 'دفع عند الاستلام'], ['📦', 'توصيل لجميع الولايات']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 900, color: '#f4a261' }}>{num}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Bar */}
      <div style={{
        display: 'flex', background: 'white',
        borderBottom: '1px solid #e9ecef', overflowX: 'auto'
      }}>
        {[['💳', 'الدفع عند الاستلام'], ['🔄', 'إرجاع 7 أيام'], ['✅', 'جودة مضمونة'], ['📞', 'تأكيد هاتفي']].map(([icon, text]) => (
          <div key={text} style={{
            flex: '1', minWidth: '120px', textAlign: 'center',
            padding: '16px 12px', borderLeft: '1px solid #e9ecef',
            fontSize: '13px', fontWeight: 600
          }}>
            <div style={{ fontSize: '22px', marginBottom: '4px' }}>{icon}</div>
            {text}
          </div>
        ))}
      </div>

      {/* Products */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(32px, 5vw, 60px) 16px' }}>
        <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 900, marginBottom: '28px' }}>
          منتجاتنا <span style={{ color: '#e63946' }}>المميزة</span>
        </h2>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#6c757d' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
            <p>لا توجد منتجات حالياً</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
            gap: 'clamp(12px, 2vw, 24px)'
          }}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      <footer style={{
        background: '#0a0a0f', color: 'rgba(255,255,255,0.4)',
        textAlign: 'center', padding: '24px', fontSize: '13px'
      }}>
        © 2025 Dzair Express — جميع الحقوق محفوظة
      </footer>
    </div>
  )
}
