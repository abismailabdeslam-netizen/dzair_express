'use client'
import { useState } from 'react'
import Image from 'next/image'
import CountdownTimer from '@/components/CountdownTimer'
import OrderForm from '@/components/OrderForm'

export default function ProductClientSection({ product, settings, disc }) {
  const [activeImg, setActiveImg] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null)

  // عند اختيار لون، نعرض صورته إن وجدت
  const handleColorSelect = (color, index) => {
    setSelectedColor(color)
    if (product.images?.[index]) setActiveImg(index)
  }

  const hasImages = product.images && product.images.length > 0

  return (
    <>
      <style>{`
        .product-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
          max-width: 1100px;
          margin: 0 auto;
          padding: clamp(20px, 4vw, 40px) 16px;
        }
        .product-gallery { position: sticky; top: 80px; }
        @media (max-width: 768px) {
          .product-layout {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 16px;
          }
          .product-gallery { position: static !important; }
        }
      `}</style>

      <div className="product-layout">
        {/* Gallery */}
        <div className="product-gallery">
          <div style={{
            height: '320px',
            background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
            borderRadius: '24px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', marginBottom: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)', overflow: 'hidden', position: 'relative'
          }}>
            {hasImages ? (
              <Image src={product.images[activeImg]} alt={product.name} fill style={{ objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '100px' }}>🛍️</span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {product.images.map((img, i) => (
                <div key={i} onClick={() => setActiveImg(i)} style={{
                  width: '64px', height: '64px', borderRadius: '12px',
                  border: `2px solid ${i === activeImg ? '#e63946' : '#e9ecef'}`,
                  overflow: 'hidden', cursor: 'pointer', position: 'relative',
                  background: '#f8f9fa'
                }}>
                  <Image src={img} alt="" fill style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info + Form */}
        <div>
          {/* Badges */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {[['🔥 عرض محدود','#e63946','rgba(230,57,70,0.1)'],['💳 دفع عند الاستلام','#457b9d','rgba(69,123,157,0.1)'],['📞 تأكيد هاتفي','#2a9d8f','rgba(42,157,143,0.1)']].map(([t,c,bg]) => (
              <span key={t} style={{ padding: '6px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 700, background: bg, color: c }}>{t}</span>
            ))}
          </div>

          <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 900, marginBottom: '12px', lineHeight: 1.3 }}>
            {product.name}
          </h1>
          <p style={{ color: '#6c757d', fontSize: '15px', lineHeight: 1.8, marginBottom: '24px' }}>
            {product.description}
          </p>

          {/* Countdown */}
          <CountdownTimer
            days={parseInt(settings.countdown_days || 1)}
            hours={parseInt(settings.countdown_hours || 3)}
            minutes={parseInt(settings.countdown_minutes || 47)}
          />

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {product.old_price && (
              <span style={{ fontSize: '20px', color: '#6c757d', textDecoration: 'line-through' }}>
                {product.old_price.toLocaleString('fr-DZ')} دج
              </span>
            )}
            <span style={{ fontSize: 'clamp(32px, 5vw, 46px)', fontWeight: 900 }}>
              {product.price.toLocaleString('fr-DZ')} دج
            </span>
            {disc && (
              <span style={{ background: '#e63946', color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '14px', fontWeight: 700 }}>
                -{disc}%
              </span>
            )}
          </div>

          {/* Stock */}
          {product.sold > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#6c757d', marginBottom: '8px' }}>
                تم بيع <span style={{ color: '#e63946', fontWeight: 900 }}>{product.sold}</span> من أصل {product.stock} قطعة
              </div>
              <div style={{ height: '8px', background: '#f0f0f0', borderRadius: '50px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '50px',
                  background: 'linear-gradient(90deg, #e63946, #f4a261)',
                  width: `${Math.min(100, (product.sold / product.stock) * 100)}%`,
                }} />
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>
                اللون: <span style={{ color: '#e63946' }}>{selectedColor ? '✓ تم الاختيار' : 'اختر لوناً'}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {product.colors.map((c, i) => (
                  <div key={i} onClick={() => handleColorSelect(c, i)}
                    title={`لون ${i + 1}`}
                    style={{
                      position: 'relative', cursor: 'pointer',
                      transition: 'all 0.2s', transform: selectedColor === c ? 'scale(1.15)' : 'scale(1)'
                    }}>
                    {/* إذا كان هناك صورة لهذا اللون نعرضها كـ thumbnail */}
                    {product.images?.[i] ? (
                      <div style={{
                        width: '52px', height: '52px', borderRadius: '12px',
                        border: `3px solid ${selectedColor === c ? '#e63946' : '#e9ecef'}`,
                        overflow: 'hidden', position: 'relative'
                      }}>
                        <Image src={product.images[i]} alt="" fill style={{ objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%', background: c,
                        border: selectedColor === c ? '3px solid white' : '2px solid transparent',
                        outline: selectedColor === c ? '2px solid #e63946' : '2px solid transparent',
                        ...(c === '#ffffff' ? { border: '2px solid #ddd' } : {})
                      }} />
                    )}
                    {selectedColor === c && (
                      <div style={{
                        position: 'absolute', top: '-4px', right: '-4px',
                        background: '#e63946', color: 'white', borderRadius: '50%',
                        width: '18px', height: '18px', fontSize: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900
                      }}>✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>المقاس:</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} style={{
                    padding: '9px 18px', border: `2px solid ${selectedSize === s ? '#e63946' : '#e9ecef'}`,
                    borderRadius: '10px', fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 700,
                    cursor: 'pointer', background: selectedSize === s ? '#e63946' : 'white',
                    color: selectedSize === s ? 'white' : '#1a1a2e', transition: 'all 0.2s'
                  }}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Order Form */}
          <OrderForm product={product} selectedColor={selectedColor} selectedSize={selectedSize} />
        </div>
      </div>
    </>
  )
}
