Output

'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { WILAYAS_COMMUNES, WILAYAS } from '@/lib/wilayas'

<<<<<<< HEAD
// أسعار التوصيل لكل ولاية (رمز الولاية: [توصيل للمنزل, توصيل للمكتب])
const DELIVERY_PRICES = {
  '01 - أدرار': [1150, 850], '02 - الشلف': [800, 400], '03 - الأغواط': [900, 450],
  '04 - أم البواقي': [700, 300], '05 - باتنة': [700, 300], '06 - بجاية': [700, 300],
  '07 - بسكرة': [900, 450], '08 - بشار': [1000, 750], '09 - البليدة': [750, 350],
  '10 - البويرة': [750, 350], '11 - تمنراست': [1200, 900], '12 - تبسة': [700, 300],
  '13 - تلمسان': [800, 400], '14 - تيارت': [800, 400], '15 - تيزي وزو': [750, 350],
  '16 - الجزائر': [550, 350], '17 - الجلفة': [900, 450], '18 - جيجل': [700, 300],
  '19 - سطيف': [700, 300], '20 - سعيدة': [800, 400], '21 - سكيكدة': [700, 300],
  '22 - سيدي بلعباس': [800, 400], '23 - عنابة': [700, 300], '24 - قالمة': [700, 300],
  '25 - قسنطينة': [700, 300], '26 - المدية': [750, 350], '27 - مستغانم': [800, 400],
  '28 - المسيلة': [700, 300], '29 - معسكر': [800, 400], '30 - ورقلة': [900, 450],
  '31 - وهران': [800, 400], '32 - البيض': [900, 450], '33 - إليزي': [1200, 1100],
  '34 - برج بوعريريج': [450, 250], '35 - بومرداس': [750, 350], '36 - الطارف': [700, 300],
  '37 - تندوف': [1300, 850], '38 - تيسمسيلت': [800, 400], '39 - الوادي': [900, 450],
  '40 - خنشلة': [700, 300], '41 - سوق أهراس': [700, 300], '42 - تيبازة': [750, 350],
  '43 - ميلة': [700, 300], '44 - عين الدفلى': [750, 350], '45 - النعامة': [900, 450],
  '46 - عين تموشنت': [800, 400], '47 - غرداية': [900, 450], '48 - غليزان': [800, 400],
  '49 - تيميمون': [1000, 750], '51 - أولاد جلال': [900, 450], '52 - بني عباس': [1250, 700],
  '53 - عين صالح': [1200, 1000], '55 - توقرت': [900, 450], '57 - المغير': [900, 0],
  '58 - المنيعة': [1000, 750],
}

=======
>>>>>>> cb5518df428e73d67694a6dd1bbc9be4f85da86f
const inp = {
  padding: '13px 16px', border: '2px solid #e9ecef', borderRadius: '12px',
  fontFamily: 'Cairo, sans-serif', fontSize: '14px', background: 'white',
  outline: 'none', width: '100%', color: '#1a1a2e', transition: 'border-color 0.2s'
}

<<<<<<< HEAD
const COLOR_NAMES = {
  '#1a1a2e': 'أسود', '#e63946': 'أحمر', '#2a9d8f': 'أخضر', '#f4a261': 'ذهبي',
  '#457b9d': 'أزرق', '#6c757d': 'رمادي', '#ffffff': 'أبيض', '#8B4513': 'بني',
}

export default function OrderForm({ product, selectedColor, selectedSize }) {
  const [qty, setQty] = useState(1)
  const [deliveryType, setDeliveryType] = useState('home') // 'home' | 'office'
=======
export default function OrderForm({ product, selectedColor, selectedSize }) {
  const [qty, setQty] = useState(1)
>>>>>>> cb5518df428e73d67694a6dd1bbc9be4f85da86f
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', wilaya: '', commune: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

<<<<<<< HEAD
  const productTotal = product.price * qty
  const deliveryPrices = form.wilaya ? (DELIVERY_PRICES[form.wilaya] || [0, 0]) : [0, 0]
  const homePrice = deliveryPrices[0]
  const officePrice = deliveryPrices[1]
  const deliveryPrice = form.wilaya ? (deliveryType === 'home' ? homePrice : officePrice) : 0
  const grandTotal = productTotal + deliveryPrice

=======
  const total = product.price * qty
>>>>>>> cb5518df428e73d67694a6dd1bbc9be4f85da86f
  const communes = form.wilaya ? (WILAYAS_COMMUNES[form.wilaya] || []) : []

  const handleWilayaChange = (wilaya) => {
    setForm(f => ({ ...f, wilaya, commune: '' }))
<<<<<<< HEAD
    // إذا كان المكتب غير متاح (سعر 0) نرجع للمنزل
    const prices = DELIVERY_PRICES[wilaya] || [0, 0]
    if (prices[1] === 0) setDeliveryType('home')
=======
>>>>>>> cb5518df428e73d67694a6dd1bbc9be4f85da86f
  }

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.phone || !form.wilaya || !form.commune) {
      setError('يرجى ملء جميع الحقول المطلوبة')
      return
    }
    setError('')
    setLoading(true)
    try {
<<<<<<< HEAD
      const colorName = selectedColor ? (COLOR_NAMES[selectedColor] || selectedColor) : null
=======
>>>>>>> cb5518df428e73d67694a6dd1bbc9be4f85da86f
      const { error: err } = await supabase.from('orders').insert({
        product_id: product.id,
        product_name: product.name,
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        wilaya: form.wilaya,
        commune: form.commune,
<<<<<<< HEAD
        color: colorName,
        size: selectedSize || null,
        quantity: qty,
        total_price: grandTotal,
        delivery_type: deliveryType,
        delivery_price: deliveryPrice,
=======
        color: selectedColor || null,
        size: selectedSize || null,
        quantity: qty,
        total_price: total,
>>>>>>> cb5518df428e73d67694a6dd1bbc9be4f85da86f
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

<<<<<<< HEAD
  const colorName = selectedColor ? (COLOR_NAMES[selectedColor] || selectedColor) : null

=======
>>>>>>> cb5518df428e73d67694a6dd1bbc9be4f85da86f
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

<<<<<<< HEAD
      {/* Delivery Type */}
      {form.wilaya && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '10px' }}>🚚 طريقة التوصيل <span style={{ color: '#e63946' }}>*</span></label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button onClick={() => setDeliveryType('home')} style={{
              padding: '12px 10px', borderRadius: '12px', border: `2px solid ${deliveryType === 'home' ? '#e63946' : '#e9ecef'}`,
              background: deliveryType === 'home' ? 'rgba(230,57,70,0.06)' : 'white',
              cursor: 'pointer', fontFamily: 'Cairo, sans-serif', textAlign: 'center'
            }}>
              <div style={{ fontSize: '22px', marginBottom: '4px' }}>🏠</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: deliveryType === 'home' ? '#e63946' : '#1a1a2e' }}>توصيل للمنزل</div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#e63946', marginTop: '4px' }}>{homePrice.toLocaleString('fr-DZ')} دج</div>
            </button>
            <button onClick={() => officePrice > 0 && setDeliveryType('office')} style={{
              padding: '12px 10px', borderRadius: '12px', border: `2px solid ${deliveryType === 'office' ? '#e63946' : '#e9ecef'}`,
              background: deliveryType === 'office' ? 'rgba(230,57,70,0.06)' : officePrice === 0 ? '#f8f9fa' : 'white',
              cursor: officePrice === 0 ? 'not-allowed' : 'pointer', fontFamily: 'Cairo, sans-serif', textAlign: 'center',
              opacity: officePrice === 0 ? 0.5 : 1
            }}>
              <div style={{ fontSize: '22px', marginBottom: '4px' }}>🏢</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: deliveryType === 'office' ? '#e63946' : '#1a1a2e' }}>توصيل للمكتب</div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#e63946', marginTop: '4px' }}>
                {officePrice > 0 ? `${officePrice.toLocaleString('fr-DZ')} دج` : 'غير متاح'}
              </div>
            </button>
          </div>
        </div>
      )}

=======
>>>>>>> cb5518df428e73d67694a6dd1bbc9be4f85da86f
      {/* Quantity */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>الكمية</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: '42px', height: '42px', border: '2px solid #e9ecef', borderRadius: '10px', background: 'white', fontSize: '20px', fontWeight: 700, cursor: 'pointer', color: '#e63946', fontFamily: 'Cairo, sans-serif' }}>−</button>
          <span style={{ fontSize: '22px', fontWeight: 900, minWidth: '36px', textAlign: 'center' }}>{qty}</span>
          <button onClick={() => setQty(q => Math.min(10, q + 1))} style={{ width: '42px', height: '42px', border: '2px solid #e9ecef', borderRadius: '10px', background: 'white', fontSize: '20px', fontWeight: 700, cursor: 'pointer', color: '#e63946', fontFamily: 'Cairo, sans-serif' }}>+</button>
        </div>
      </div>

<<<<<<< HEAD
      {/* Order Summary */}
      <div style={{ background: 'white', borderRadius: '14px', padding: '18px 20px', margin: '16px 0', border: '2px solid #e9ecef' }}>
        <div style={{ fontSize: '14px', fontWeight: 800, marginBottom: '12px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>📋 ملخص الطلب</div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
          <span style={{ color: '#6c757d' }}>المنتج:</span>
          <span style={{ fontWeight: 700, textAlign: 'left', maxWidth: '60%' }}>{product.name}</span>
        </div>
        {colorName && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
            <span style={{ color: '#6c757d' }}>اللون:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '14px', height: '14px', borderRadius: '50%', background: selectedColor, border: '1px solid #ccc', flexShrink: 0 }}></span>
              <span style={{ fontWeight: 700 }}>{colorName}</span>
            </div>
          </div>
        )}
        {selectedSize && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
            <span style={{ color: '#6c757d' }}>المقاس:</span>
            <span style={{ fontWeight: 700 }}>{selectedSize}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
          <span style={{ color: '#6c757d' }}>الكمية:</span>
          <span style={{ fontWeight: 700 }}>x{qty}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
          <span style={{ color: '#6c757d' }}>سعر المنتج:</span>
          <span style={{ fontWeight: 700 }}>{productTotal.toLocaleString('fr-DZ')} دج</span>
        </div>
        {form.wilaya && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
            <span style={{ color: '#6c757d' }}>سعر التوصيل ({deliveryType === 'home' ? 'منزل' : 'مكتب'}):</span>
            <span style={{ fontWeight: 700 }}>{deliveryPrice.toLocaleString('fr-DZ')} دج</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #e9ecef', paddingTop: '12px', marginTop: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#6c757d' }}>المجموع الإجمالي:</span>
          <span style={{ fontSize: '28px', fontWeight: 900, color: '#e63946' }}>{grandTotal.toLocaleString('fr-DZ')} دج</span>
        </div>
=======
      {/* Total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderRadius: '14px', padding: '16px 20px', margin: '16px 0', border: '2px solid #e9ecef' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#6c757d' }}>المجموع الكلي:</span>
        <span style={{ fontSize: '28px', fontWeight: 900 }}>{total.toLocaleString('fr-DZ')} دج</span>
>>>>>>> cb5518df428e73d67694a6dd1bbc9be4f85da86f
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
