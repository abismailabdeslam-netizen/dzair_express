'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const NAV = [
  { href: '/dashboard-x7k2m9/panel',          icon: '📊', label: 'نظرة عامة' },
  { href: '/dashboard-x7k2m9/panel/orders',   icon: '📋', label: 'الطلبات' },
  { href: '/dashboard-x7k2m9/panel/products', icon: '📦', label: 'المنتجات' },
  { href: '/dashboard-x7k2m9/panel/reviews',  icon: '⭐', label: 'التقييمات' },
  { href: '/dashboard-x7k2m9/panel/settings', icon: '⚙️', label: 'الإعدادات' },
]

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router   = useRouter()

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/dashboard-x7k2m9')
  }

  const pageTitle = NAV.find(n => n.href === pathname)?.label || 'لوحة التحكم'

  return (
    <>
      <style>{`
        /* ========= DESKTOP ========= */
        .adm-sidebar   { display: flex;  }
        .adm-bottomnav { display: none;  }
        .adm-content   { margin-right: 240px; min-height: 100vh; background: #f8f9fa; }

        /* ========= MOBILE ========= */
        @media (max-width: 768px) {
          .adm-sidebar   { display: none !important; }
          .adm-bottomnav { display: flex !important; }
          .adm-content   { margin-right: 0; padding-bottom: 80px; }
        }
      `}</style>

      {/* ===== SIDEBAR — Desktop ===== */}
      <div className="adm-sidebar" style={{
        width: '240px', background: '#0a0a0f', flexDirection: 'column',
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 100,
        overflowY: 'auto'
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '20px', fontWeight: 900, color: 'white' }}>
            Dzair <span style={{ color: '#f4a261' }}>Express</span>
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>لوحة التحكم</div>
        </div>

        <nav style={{ padding: '16px 0', flex: 1 }}>
          {NAV.map(({ href, icon, label }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px 24px', fontSize: '14px', fontWeight: 600,
                  color: active ? '#e63946' : 'rgba(255,255,255,0.6)',
                  background: active ? 'rgba(230,57,70,0.12)' : 'transparent',
                  borderRight: active ? '3px solid #e63946' : '3px solid transparent',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}>
                  <span style={{ fontSize: '18px' }}>{icon}</span>
                  {label}
                </div>
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={logout} style={{
            width: '100%', padding: '12px', background: 'rgba(230,57,70,0.15)',
            color: '#e63946', border: '1px solid rgba(230,57,70,0.3)', borderRadius: '10px',
            fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer'
          }}>← خروج</button>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="adm-content">
        {/* Top bar */}
        <div style={{
          background: 'white', padding: '16px 20px',
          borderBottom: '1px solid #e9ecef', position: 'sticky', top: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <h1 style={{ fontSize: '18px', fontWeight: 900 }}>{pageTitle}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', color: '#6c757d' }}>
              {new Date().toLocaleDateString('fr-DZ', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
            {/* زر خروج على الموبايل */}
            <button onClick={logout} style={{
              padding: '6px 14px', background: 'rgba(230,57,70,0.1)',
              color: '#e63946', border: '1px solid rgba(230,57,70,0.3)', borderRadius: '8px',
              fontFamily: 'Cairo, sans-serif', fontSize: '12px', fontWeight: 700, cursor: 'pointer'
            }}>خروج</button>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: 'clamp(16px, 3vw, 32px)' }}>
          {children}
        </div>
      </div>

      {/* ===== BOTTOM NAV — Mobile ===== */}
      <div className="adm-bottomnav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#0a0a0f', zIndex: 200,
        borderTop: '1px solid rgba(255,255,255,0.1)',
        justifyContent: 'space-around'
      }}>
        {NAV.map(({ href, icon, label }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} style={{ flex: 1, textDecoration: 'none' }}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '10px 4px', gap: '3px',
                color: active ? '#e63946' : 'rgba(255,255,255,0.5)',
                borderTop: `3px solid ${active ? '#e63946' : 'transparent'}`,
                fontSize: '10px', fontWeight: active ? 700 : 500
              }}>
                <span style={{ fontSize: '22px' }}>{icon}</span>
                {label}
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
