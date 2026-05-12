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
    <div style={{ background: '#f8f9fb', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 40%, #0f3460 100%)',
        backgroundSize: '400% 400%',
        padding: 'clamp(40px, 8vw, 80px) 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '400px',
          height: '400px',
          background: 'rgba(230, 57, 70, 0.1)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '300px',
          height: '300px',
          background: 'rgba(244, 162, 97, 0.1)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite'
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-block',
            background: 'rgba(230, 57, 70, 0.15)',
            color: '#f4a261',
            padding: '8px 20px',
            borderRadius: '50px',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '20px',
            border: '1px solid rgba(244, 162, 97, 0.3)',
            backdropFilter: 'blur(5px)',
            animation: 'fadeIn 0.6s ease forwards'
          }}>
            🚀 توصيل سريع لجميع الولايات
          </div>

          {/* Main Heading */}
          <h1 style={{
            fontSize: 'clamp(28px, 7vw, 54px)',
            fontWeight: 900,
            color: 'white',
            marginBottom: '16px',
            lineHeight: 1.2,
            background: 'linear-gradient(135deg, #ffffff 0%, #f4a261 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'fadeIn 0.6s ease forwards 0.2s',
            opacity: 0
          }}>
            تسوق بذكاء مع <span style={{ color: '#f4a261' }}>Dzair Express</span>
          </h1>

          {/* Subheading */}
          <p style={{
            color: 'rgba(255, 255, 255, 0.75)',
            fontSize: 'clamp(14px, 2.5vw, 18px)',
            maxWidth: '520px',
            margin: '0 auto 32px',
            lineHeight: 1.7,
            fontWeight: 500,
            animation: 'fadeIn 0.6s ease forwards 0.3s',
            opacity: 0
          }}>
            أفضل المنتجات بأسعار لا تُقاوم — نتصل بك للتأكيد قبل الشحن. ✨
          </p>

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(12px, 3vw, 32px)',
            flexWrap: 'wrap',
            marginTop: '24px'
          }}>
            {[['🗺️', '58', 'ولاية'], ['💳', '100%', 'دفع عند الاستلام'], ['📦', 'سريع', 'التوصيل']].map(([icon, num, label], idx) => (
              <div key={label} style={{
                textAlign: 'center',
                animation: `fadeIn 0.6s ease forwards ${0.4 + idx * 0.1}s`,
                opacity: 0
              }}>
                <div style={{ fontSize: 'clamp(20px, 3vw, 28px)', marginBottom: '4px' }}>{icon}</div>
                <div style={{ fontSize: 'clamp(16px, 2vw, 20px)', fontWeight: 900, color: '#f4a261' }}>{num}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        background: 'white',
        borderBottom: '1px solid #e9ecef',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
      }}>
        {[['💳', 'دفع عند الاستلام'], ['✅', 'جودة مضمونة'], ['📞', 'تأكيد هاتفي'], ['🚚', 'توصيل فوري']].map(([icon, text]) => (
          <div key={text} style={{
            textAlign: 'center',
            padding: '16px 12px',
            borderLeft: '1px solid #e9ecef',
            fontSize: '12px',
            fontWeight: 700,
            color: '#1a1a2e',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#f8f9fb';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>{icon}</div>
            <div style={{ letterSpacing: '0.5px' }}>{text}</div>
          </div>
        ))}
      </div>

      {/* Products Section */}
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: 'clamp(24px, 6vw, 48px) 16px'
      }}>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          animation: 'fadeIn 0.6s ease forwards 0.5s',
          opacity: 0
        }}>
          <div>
            <h2 style={{
              fontSize: 'clamp(18px, 4vw, 28px)',
              fontWeight: 900,
              color: '#1a1a2e',
              marginBottom: '4px'
            }}>
              منتجاتنا <span style={{ color: '#e63946' }}>المميزة</span>
            </h2>
            <div style={{ height: '3px', width: '40px', background: 'linear-gradient(90deg, #e63946, #f4a261)', borderRadius: '3px' }} />
          </div>
          <span style={{
            fontSize: '14px',
            color: 'white',
            background: 'linear-gradient(135deg, #e63946 0%, #c4212f 100%)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(230, 57, 70, 0.3)'
          }}>
            {products.length} منتج
          </span>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: '#6c757d',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            animation: 'fadeIn 0.6s ease'
          }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>📦</div>
            <p style={{ fontSize: '16px', fontWeight: 600 }}>لا توجد منتجات حالياً</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>سيتم إضافة منتجات جديدة قريباً</p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            {products.map((p, idx) => (
              <div key={p.id} style={{
                animation: `fadeIn 0.6s ease forwards ${0.6 + idx * 0.05}s`,
                opacity: 0
              }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
        color: 'rgba(255, 255, 255, 0.4)',
        textAlign: 'center',
        padding: '32px 20px',
        fontSize: '13px',
        fontWeight: 500,
        borderTop: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ marginBottom: '16px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 700 }}>
            © 2025 Dzair Express — جميع الحقوق محفوظة
          </div>
          <div style={{ fontSize: '12px' }}>
            تم تطويره بـ ❤️ لتوفير أفضل تجربة تسوق
          </div>
        </div>
      </footer>
    </div>
  )
}
