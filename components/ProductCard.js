'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function ProductCard({ product }) {
  const disc = product.old_price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : null

  return (
    <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div style={{
        background: 'white', borderRadius: '16px', overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid #e9ecef',
        cursor: 'pointer', transition: 'all 0.25s',
        display: 'flex', alignItems: 'center', gap: '0',
      }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)'; e.currentTarget.style.transform = 'translateY(0)' }}
      >
        {/* Image */}
        <div style={{
          width: '110px', minWidth: '110px', height: '110px',
          background: 'linear-gradient(135deg, #f0f2f5, #e4e7eb)',
          position: 'relative', overflow: 'hidden', flexShrink: 0
        }}>
          {(product.main_image || product.images?.[0]) ? (
            <Image src={product.main_image || product.images[0]} alt={product.name} fill style={{ objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🛍️</div>
          )}
          {disc && (
            <div style={{
              position: 'absolute', top: '6px', right: '6px',
              background: '#e63946', color: 'white',
              padding: '2px 8px', borderRadius: '50px',
              fontSize: '11px', fontWeight: 700
            }}>-{disc}%</div>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '14px 16px', minWidth: 0 }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.name}
          </h3>
          <p style={{ fontSize: '12px', color: '#6c757d', marginBottom: '10px', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {product.description}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              {product.old_price && (
                <div style={{ fontSize: '11px', color: '#aaa', textDecoration: 'line-through' }}>
                  {product.old_price.toLocaleString('fr-DZ')} دج
                </div>
              )}
              <div style={{ fontSize: '17px', fontWeight: 900, color: '#e63946' }}>
                {product.price.toLocaleString('fr-DZ')} دج
              </div>
            </div>
            <div style={{
              background: '#e63946', color: 'white',
              padding: '8px 16px', borderRadius: '10px',
              fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap'
            }}>
              اطلب الآن
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div style={{ paddingLeft: '12px', paddingRight: '4px', color: '#ccc', fontSize: '18px', flexShrink: 0 }}>‹</div>
      </div>
    </Link>
  )
}
