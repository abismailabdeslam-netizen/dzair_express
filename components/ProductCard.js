'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function ProductCard({ product }) {
  const disc = product.old_price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : null

  return (
    <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: 'white', borderRadius: '20px', overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        border: '1px solid #e9ecef', cursor: 'pointer',
        transition: 'all 0.3s', height: '100%'
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        {/* Image */}
        <div style={{
          height: '220px', background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden'
        }}>
          {product.images && product.images[0] ? (
            <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '72px' }}>🛍️</span>
          )}
          {disc && (
            <div style={{
              position: 'absolute', top: '12px', right: '12px',
              background: '#e63946', color: 'white',
              padding: '4px 12px', borderRadius: '50px',
              fontSize: '12px', fontWeight: 700
            }}>-{disc}%</div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '18px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>{product.name}</h3>
          <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '14px', lineHeight: 1.5 }}>
            {product.description?.slice(0, 60)}...
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              {product.old_price && (
                <div style={{ fontSize: '12px', color: '#6c757d', textDecoration: 'line-through' }}>
                  {product.old_price.toLocaleString('fr-DZ')} دج
                </div>
              )}
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#e63946' }}>
                {product.price.toLocaleString('fr-DZ')} دج
              </div>
            </div>
            <div style={{
              background: '#0a0a0f', color: 'white',
              padding: '10px 18px', borderRadius: '12px',
              fontSize: '13px', fontWeight: 700
            }}>اطلب الآن</div>
          </div>
        </div>
      </div>
    </Link>
  )
}
