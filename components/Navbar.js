'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navbar({ showBack = false, backHref = '/', backLabel = 'العودة للمنتجات' }) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav style={{
      background: isScrolled
        ? 'linear-gradient(135deg, rgba(10, 10, 15, 0.95) 0%, rgba(26, 26, 46, 0.9) 100%)'
        : 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      boxShadow: isScrolled
        ? '0 8px 32px rgba(0, 0, 0, 0.2)'
        : '0 2px 12px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{
          fontSize: '22px',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #ffffff 0%, #f4a261 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          cursor: 'pointer',
          letterSpacing: '-0.5px',
          transition: 'transform 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          <span>🛍️</span>
          <span>Dzair <span style={{ color: '#f4a261' }}>Express</span></span>
        </div>
      </Link>

      {/* Navigation Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        {showBack && (
          <Link href={backHref} style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'white',
              padding: '10px 18px',
              borderRadius: '12px',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(8px)'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(244, 162, 97, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(244, 162, 97, 0.4)';
                e.currentTarget.style.transform = 'translateX(-4px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              ← {backLabel}
            </button>
          </Link>
        )}

        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.15) 0%, rgba(244, 162, 97, 0.1) 100%)',
            border: '1px solid rgba(230, 57, 70, 0.3)',
            color: 'white',
            padding: '10px 18px',
            borderRadius: '12px',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 12px rgba(230, 57, 70, 0.15)'
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(230, 57, 70, 0.25) 0%, rgba(244, 162, 97, 0.15) 100%)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(230, 57, 70, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(230, 57, 70, 0.15) 0%, rgba(244, 162, 97, 0.1) 100%)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(230, 57, 70, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🏠 الرئيسية
          </button>
        </Link>
      </div>
    </nav>
  )
}
