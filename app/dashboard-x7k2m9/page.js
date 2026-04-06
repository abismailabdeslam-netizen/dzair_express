'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const inp = {
    padding: '13px 16px', border: '2px solid #e9ecef', borderRadius: '12px',
    fontFamily: 'Cairo, sans-serif', fontSize: '14px', width: '100%',
    outline: 'none', marginBottom: '14px', color: '#1a1a2e'
  }

  const handleLogin = async () => {
    if (!email || !password) { setError('يرجى ملء جميع الحقول'); return }
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError('بيانات خاطئة، حاول مجدداً')
      setLoading(false)
    } else {
      router.push('/dashboard-x7k2m9/panel')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f, #1a1a2e)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        background: 'white', borderRadius: '24px', padding: 'clamp(32px, 5vw, 48px) clamp(24px, 5vw, 40px)',
        width: '100%', maxWidth: '420px', textAlign: 'center',
        boxShadow: '0 40px 100px rgba(0,0,0,0.4)'
      }}>
        <div style={{ fontSize: '28px', fontWeight: 900, marginBottom: '6px' }}>
          Dzair <span style={{ color: '#f4a261' }}>Express</span>
        </div>
        <h2 style={{ fontSize: '16px', color: '#6c757d', fontWeight: 600, marginBottom: '32px' }}>
          🔐 لوحة تحكم الأدمن
        </h2>

        <div style={{ textAlign: 'right' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>البريد الإلكتروني</label>
          <input style={inp} type="email" placeholder="admin@dzairexpress.dz"
            value={email} onChange={e => setEmail(e.target.value)} />

          <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>كلمة المرور</label>
          <input style={{ ...inp, marginBottom: '20px' }} type="password" placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>

        {error && <p style={{ color: '#e63946', fontSize: '13px', marginBottom: '12px' }}>❌ {error}</p>}

        <button onClick={handleLogin} disabled={loading} style={{
          width: '100%', padding: '16px', background: loading ? '#ccc' : '#0a0a0f',
          color: 'white', border: 'none', borderRadius: '12px',
          fontFamily: 'Cairo, sans-serif', fontSize: '16px', fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}>
          {loading ? '⏳ جاري التحقق...' : '🔐 دخول'}
        </button>

        <p style={{ fontSize: '12px', color: '#aaa', marginTop: '20px' }}>
          يُنشئ حساب الأدمن من Supabase Authentication
        </p>
      </div>
    </div>
  )
}
