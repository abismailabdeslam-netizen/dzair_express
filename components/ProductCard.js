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
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(0, 0, 0, 0.07)',
        border: '1px solid #e9ecef',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        position: 'relative'
      }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(230, 57, 70, 0.15)';
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.borderColor = 'rgba(230, 57, 70, 0.2)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = '0 2px 16px rgba(0, 0, 0, 0.07)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = '#e9ecef';
        }}
      >
        {/* Image */}
        <div style={{
          width: '120px',
          minWidth: '120px',
          height: '120px',
          background: 'linear-gradient(135deg, #f5f6fa 0%, #e9ecef 100%)',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          {(product.main_image || product.images?.[0]) ? (
            <Image
              src={product.main_image || product.images[0]}
              alt={product.name}
              fill
              style={{
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '44px'
            }}>
              🛍️
            </div>
          )}

          {/* Discount Badge */}
          {disc && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'linear-gradient(135deg, #e63946 0%, #c4212f 100%)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '50px',
              fontSize: '12px',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(230, 57, 70, 0.3)',
              animation: 'popIn 0.4s ease'
            }}>
              -{disc}%
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '16px 18px', minWidth: 0 }}>
          {/* Title */}
          <h3 style={{
            fontSize: '15px',
            fontWeight: 700,
            marginBottom: '6px',
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: '#1a1a2e'
          }}>
            {product.name}
          </h3>

          {/* Description */}
          <p style={{
            fontSize: '12px',
            color: '#6c757d',
            marginBottom: '12px',
            lineHeight: 1.4,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {product.description}
          </p>

          {/* Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            {/* Price Section */}
            <div>
              {product.old_price && (
                <div style={{
                  fontSize: '12px',
                  color: '#aaa',
                  textDecoration: 'line-through',
                  marginBottom: '2px'
                }}>
                  {product.old_price.toLocaleString('fr-DZ')} دج
                </div>
              )}
              <div style={{
                fontSize: '18px',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #e63946 0%, #c4212f 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {product.price.toLocaleString('fr-DZ')} دج
              </div>
            </div>

            {/* CTA Button */}
            <button style={{
              background: 'linear-gradient(135deg, #e63946 0%, #c4212f 100%)',
              color: 'white',
              padding: '10px 16px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(230, 57, 70, 0.2)'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(230, 57, 70, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(230, 57, 70, 0.2)';
              }}
            >
              اطلب الآن
            </button>
          </div>
        </div>

        {/* Arrow Indicator */}
        <div style={{
          paddingRight: '10px',
          color: '#ddd',
          fontSize: '20px',
          flexShrink: 0,
          transition: 'all 0.3s ease'
        }}>
          ›
        </div>
      </div>
    </Link>
  )
}
