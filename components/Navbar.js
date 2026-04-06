'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar({ showBack = false, backHref = '/', backLabel = 'العودة للمنتجات' }) {
  return (
    <nav style={{
      background: '#0a0a0f',
      position: 'sticky', top: 0, zIndex: 100,
      height: '64px',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      boxShadow: '0 2px 20px rgba(0,0,0,0.3)'
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ fontSize: '22px', fontWeight: 900, color: 'white', cursor: 'pointer', letterSpacing: '-0.5px' }}>
          Dzair <span style={{ color: '#f4a261' }}>Express</span>
        </div>
      </Link>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {showBack && (
          <Link href={backHref} style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'white', padding: '8px 16px',
              borderRadius: '10px', fontFamily: 'Cairo, sans-serif',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer'
            }}>
              ← {backLabel}
            </button>
          </Link>
        )}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'white', padding: '8px 16px',
            borderRadius: '10px', fontFamily: 'Cairo, sans-serif',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer'
          }}>🏠 الرئيسية</button>
        </Link>
      </div>
    </nav>
  )
}
