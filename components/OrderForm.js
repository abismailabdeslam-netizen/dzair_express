'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { WILAYAS_COMMUNES, WILAYAS } from '@/lib/wilayas'

const inp = {
  padding: '13px 16px', border: '2px solid #e9ecef', borderRadius: '12px',
  fontFamily: 'Cairo, sans-serif', fontSize: '14px', background: 'white',
  outline: 'none', width: '100%', color: '#1a1a2e', transition: 'border-color 0.2s'
}

export default function OrderForm({ product, selectedColor, selectedSize }) {
  const [qty, setQty] = useState(1)
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', wilaya: '', commune: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const total = product.price * qty
  const communes = form.wilaya ? (WILAYAS_COMMUNES[form.wilaya] || []) : []

  const handleWilayaChange = (wilaya) => {
    setForm(f => ({ ...f, wilaya, commune: '' }))
  }

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.phone || !form.wilaya || !form.commune) {
      setError('يرجى ملء جميع الحقول المطلوبة')
      return
    }
    setError('')
    setLoading(true)
    try {
      const { error: err } = await supabase.from('orders').insert({
        product_id: product.id,
        product_name: product.name,
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        wilaya: form.wilaya,
        commune: form.commune,
        color: selectedColor || null,
        size: selectedSize || null,
        quantity: qty,
        total_price: total,
        status: 'pending'
      })
      if (err) throw err
      setSuccess(true)
    } catch (e) {
      setError('حدث خطأ، حاول مجدداً')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div style={{ background: 'white', borderRadius: '20px', padding: '48px 32px', textAlign: 'center', border: '1px solid #e9ecef', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <div style={{ fontSize: '72px', marginBottom: '20px' }}>✅</div>
      <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#2a9d8f', marginBottom: '12px' }}>تم إرسال طلبك!</h2>
      <p style={{ color: '#6c757d', lineHeight: 1.7 }}>
        شكراً لك! سنتصل بك قريباً على الرقم <strong>{form.phone}</strong> لتأكيد الطلب وتحديد موعد التوصيل 🚚
      </p>
    </div>
  )

  return (
    <div style={{ background: '#f8f9fa', borderRadius: '20px', padding: '28px', border: '1px solid #e9ecef' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '20px' }}>📦 أكمل طلبك الآن</h3>

      {/* Name Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>الاسم <span style={{ color: '#e63946' }}>*</span></label>
          <input style={inp} placeholder="محمد" value={form.firstName}
            onChange={e => setForm({ ...form, firstName: e.target.value })}
            onFocus={e => e.target.style.borderColor = '#e63946'}
            onBlur={e => e.target.style.borderColor = '#e9ecef'} />
        </div>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>اللقب <span style={{ color: '#e63946' }}>*</span></label>
          <input style={inp} placeholder="بن علي" value={form.lastName}
            onChange={e => setForm({ ...form, lastName: e.target.value })}
            onFocus={e => e.target.style.borderColor = '#e63946'}
            onBlur={e => e.target.style.borderColor = '#e9ecef'} />
        </div>
      </div>

      {/* Phone */}
      <div style={{ marginBottom: '14px' }}>
        <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>رقم الهاتف <span style={{ color: '#e63946' }}>*</span></label>
        <input style={inp} type="tel" placeholder="05XX XXX XXX" value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          onFocus={e => e.target.style.borderColor = '#e63946'}
          onBlur={e => e.target.style.borderColor = '#e9ecef'} />
      </div>

      {/* Wilaya */}
      <div style={{ marginBottom: '14px' }}>
        <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>الولاية <span style={{ color: '#e63946' }}>*</span></label>
        <select style={inp} value={form.wilaya}
          onChange={e => handleWilayaChange(e.target.value)}
          onFocus={e => e.target.style.borderColor = '#e63946'}
          onBlur={e => e.target.style.borderColor = '#e9ecef'}>
          <option value="">اختر الولاية...</option>
          {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>

      {/* Commune */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>البلدية <span style={{ color: '#e63946' }}>*</span></label>
        <select style={{ ...inp, opacity: !form.wilaya ? 0.5 : 1 }}
          value={form.commune} disabled={!form.wilaya}
          onChange={e => setForm({ ...form, commune: e.target.value })}
          onFocus={e => e.target.style.borderColor = '#e63946'}
          onBlur={e => e.target.style.borderColor = '#e9ecef'}>
          <option value="">{form.wilaya ? 'اختر البلدية...' : 'اختر الولاية أولاً'}</option>
          {communes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Quantity */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>الكمية</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: '42px', height: '42px', border: '2px solid #e9ecef', borderRadius: '10px', background: 'white', fontSize: '20px', fontWeight: 700, cursor: 'pointer', color: '#e63946', fontFamily: 'Cairo, sans-serif' }}>−</button>
          <span style={{ fontSize: '22px', fontWeight: 900, minWidth: '36px', textAlign: 'center' }}>{qty}</span>
          <button onClick={() => setQty(q => Math.min(10, q + 1))} style={{ width: '42px', height: '42px', border: '2px solid #e9ecef', borderRadius: '10px', background: 'white', fontSize: '20px', fontWeight: 700, cursor: 'pointer', color: '#e63946', fontFamily: 'Cairo, sans-serif' }}>+</button>
        </div>
      </div>

      {/* Total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderRadius: '14px', padding: '16px 20px', margin: '16px 0', border: '2px solid #e9ecef' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#6c757d' }}>المجموع الكلي:</span>
        <span style={{ fontSize: '28px', fontWeight: 900 }}>{total.toLocaleString('fr-DZ')} دج</span>
      </div>

      {error && <p style={{ color: '#e63946', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

      <button onClick={handleSubmit} disabled={loading} style={{
        width: '100%', padding: '18px',
        background: loading ? '#ccc' : 'linear-gradient(135deg, #e63946, #c1121f)',
        color: 'white', border: 'none', borderRadius: '14px',
        fontFamily: 'Cairo, sans-serif', fontSize: '17px', fontWeight: 900,
        cursor: loading ? 'not-allowed' : 'pointer',
        boxShadow: '0 8px 24px rgba(230,57,70,0.3)', marginBottom: '16px'
      }}>
        {loading ? '⏳ جاري الإرسال...' : '🛒 اطلب الآن — الدفع عند الاستلام'}
      </button>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        {['🔒 معلوماتك آمنة', '📦 توصيل 2-5 أيام', '☎️ تأكيد هاتفي'].map(t => (
          <span key={t} style={{ fontSize: '12px', color: '#6c757d', fontWeight: 600 }}>{t}</span>
        ))}
      </div>
    </div>
  )
}
