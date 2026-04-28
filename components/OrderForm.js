'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { WILAYAS_COMMUNES, WILAYAS } from '@/lib/wilayas'

// ─── أسعار التوصيل لكل ولاية [منزل، مكتب] ───────────────────────────────────
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

const COLOR_NAMES = {
  '#1a1a2e': 'أسود', '#e63946': 'أحمر', '#2a9d8f': 'أخضر', '#f4a261': 'ذهبي',
  '#457b9d': 'أزرق', '#6c757d': 'رمادي', '#ffffff': 'أبيض', '#8B4513': 'بني',
}

// ─── حسابات الخصم ─────────────────────────────────────────────────────────────
function calcDiscount(qty, rules) {
  if (!rules || rules.length === 0) return null
  return [...rules].sort((a, b) => b.minQty - a.minQty).find(r => qty >= r.minQty) || null
}
function getNextRule(qty, rules) {
  if (!rules || rules.length === 0) return null
  return [...rules].sort((a, b) => a.minQty - b.minQty).find(r => qty < r.minQty) || null
}

// ─── أنيميشن الشيمر ───────────────────────────────────────────────────────────
const SHIMMER_CSS = `
@keyframes dzShimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes dzBounce {
  0%,100% { transform: scale(1) rotate(0deg); }
  25%      { transform: scale(1.18) rotate(-6deg); }
  75%      { transform: scale(1.18) rotate(6deg); }
}
@keyframes dzPulse {
  0%,100% { opacity:1; }
  50%      { opacity:0.82; }
}
`

// ─── مكوّن رسالة التخفيض (تحت الكمية مباشرة) ─────────────────────────────────
function DiscountHint({ qty, rules, price }) {
  const rule = calcDiscount(qty, rules)
  const next = getNextRule(qty, rules)
  if (!rules || rules.length === 0) return null

  const isGift     = rule?.gift
  const isFreeShip = rule?.freeShip
  const pct        = rule?.pct || 0
  const savedAmt   = rule ? Math.round(price * qty * pct / 100) : 0

  let shimmer = false
  let icon    = '🏷️'
  let mainTxt = ''
  let subTxt  = 'العرض محدود — استغل الفرصة الآن'
  let saveTxt = ''
  let bg      = 'rgba(108,117,125,0.10)'

  if (!rule && next) {
    const diff   = next.minQty - qty
    const reward = next.gift ? '🎁 هدية' : next.freeShip ? '🚚 توصيل مجاني' : `خصم ${next.pct}%`
    mainTxt = `أضف ${diff === 1 ? 'قطعة واحدة' : diff + ' قطع'} فقط للحصول على ${reward}!`
  } else if (rule) {
    shimmer = true
    bg      = isGift ? 'rgba(212,130,10,0.92)' : 'rgba(45,122,79,0.92)'
    icon    = isGift ? '🎁' : isFreeShip ? '🚚' : '🏷️'
    mainTxt = isGift ? 'هدية مجانية + توصيل مجاني + خصم!'
            : isFreeShip ? `توصيل مجاني + خصم ${pct}% مفعّل!`
            : `خصم ${pct}% مفعّل على طلبك!`
    subTxt  = `وفّرت ${savedAmt.toLocaleString('fr-DZ')} دج على هذا الطلب 🎉`
    saveTxt = next ? `+${next.minQty - qty} للمزيد` : '🏆 أفضل عرض!'
  }

  if (!mainTxt) return null

  return (
    <div style={{ borderRadius:'12px', overflow:'hidden', marginTop:'10px', position:'relative', minHeight:'52px', display:'flex', alignItems:'center', background: bg }}>
      {shimmer && (
        <div style={{ position:'absolute', inset:0, zIndex:1,
          background:'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.28) 40%,rgba(255,255,255,0.38) 50%,rgba(255,255,255,0.28) 60%,transparent 100%)',
          backgroundSize:'200% 100%', animation:'dzShimmer 2.5s infinite linear' }} />
      )}
      <div style={{ position:'relative', zIndex:2, display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px', width:'100%' }}>
        <div style={{ fontSize:'22px', flexShrink:0, animation: shimmer ? 'dzBounce 1.5s infinite ease-in-out' : 'none' }}>{icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:'13px', fontWeight:900, color: shimmer ? 'white' : '#333', animation: shimmer ? 'dzPulse 2.5s infinite' : 'none' }}>{mainTxt}</div>
          <div style={{ fontSize:'11px', fontWeight:600, marginTop:'2px', color: shimmer ? 'rgba(255,255,255,0.88)' : '#666' }}>{subTxt}</div>
        </div>
        {saveTxt && <div style={{ color:'white', fontSize:'13px', fontWeight:900, whiteSpace:'nowrap' }}>{saveTxt}</div>}
      </div>
    </div>
  )
}

// ─── صف الملخص ───────────────────────────────────────────────────────────────
function SumRow({ label, value, style = {} }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px', fontSize:'13px', color:'#555', ...style }}>
      <span>{label}</span><span style={{ fontWeight:700 }}>{value}</span>
    </div>
  )
}

// ─── الحقل المشترك ────────────────────────────────────────────────────────────
const inp = {
  padding:'13px 16px', border:'2px solid #e9ecef', borderRadius:'12px',
  fontFamily:'Cairo, sans-serif', fontSize:'14px', background:'white',
  outline:'none', width:'100%', color:'#1a1a2e', transition:'border-color 0.2s',
}
const focus = e => e.target.style.borderColor = '#e63946'
const blur  = e => e.target.style.borderColor = '#e9ecef'

// ─── المكوّن الرئيسي ──────────────────────────────────────────────────────────
export default function OrderForm({ product, selectedColor, selectedSize }) {
  const [qty,          setQty]          = useState(1)
  const [deliveryType, setDeliveryType] = useState('home')
  const [form,         setForm]         = useState({ firstName:'', lastName:'', phone:'', wilaya:'', commune:'' })
  const [loading,      setLoading]      = useState(false)
  const [success,      setSuccess]      = useState(false)
  const [error,        setError]        = useState('')

  const rules      = product.discount_rules || []
  const colorName  = selectedColor ? (COLOR_NAMES[selectedColor] || selectedColor) : null
  const communes   = form.wilaya ? (WILAYAS_COMMUNES[form.wilaya] || []) : []

  // حسابات السعر
  const delPrices    = form.wilaya ? (DELIVERY_PRICES[form.wilaya] || [0, 0]) : [0, 0]
  const homePrice    = delPrices[0]
  const officePrice  = delPrices[1]
  const activeRule   = calcDiscount(qty, rules)
  const discPct      = activeRule?.pct || 0
  const freeShip     = activeRule?.freeShip || false
  const hasGift      = activeRule?.gift || false
  const subTotal     = product.price * qty
  const discAmt      = Math.round(subTotal * discPct / 100)
  const rawDelivery  = deliveryType === 'home' ? homePrice : officePrice
  const deliveryAmt  = freeShip ? 0 : rawDelivery
  const grandTotal   = subTotal - discAmt + deliveryAmt

  const handleWilayaChange = (w) => {
    setForm(f => ({ ...f, wilaya: w, commune: '' }))
    if ((DELIVERY_PRICES[w] || [0,0])[1] === 0) setDeliveryType('home')
  }

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.phone || !form.wilaya || !form.commune) {
      setError('يرجى ملء جميع الحقول المطلوبة'); return
    }
    setError(''); setLoading(true)
    try {
      const { error: err } = await supabase.from('orders').insert({
        product_id: product.id, product_name: product.name,
        first_name: form.firstName, last_name: form.lastName,
        phone: form.phone, wilaya: form.wilaya, commune: form.commune,
        color: colorName, size: selectedSize || null,
        quantity: qty, total_price: grandTotal,
        delivery_type: deliveryType, delivery_price: deliveryAmt,
        discount_pct: discPct, discount_amount: discAmt, has_gift: hasGift,
        status: 'pending',
      })
      if (err) throw err
      setSuccess(true)
    } catch { setError('حدث خطأ، حاول مجدداً') }
    finally   { setLoading(false) }
  }

  if (success) return (
    <div style={{ background:'white', borderRadius:'20px', padding:'48px 32px', textAlign:'center', border:'1px solid #e9ecef', boxShadow:'0 4px 24px rgba(0,0,0,0.08)' }}>
      <div style={{ fontSize:'72px', marginBottom:'20px' }}>✅</div>
      <h2 style={{ fontSize:'24px', fontWeight:900, color:'#2a9d8f', marginBottom:'12px' }}>تم إرسال طلبك!</h2>
      <p style={{ color:'#6c757d', lineHeight:1.7 }}>
        شكراً لك! سنتصل بك قريباً على الرقم <strong>{form.phone}</strong> لتأكيد الطلب وتحديد موعد التوصيل 🚚
      </p>
    </div>
  )

  return (
    <>
      <style>{SHIMMER_CSS}</style>
      <div style={{ background:'#f8f9fa', borderRadius:'20px', padding:'28px', border:'1px solid #e9ecef' }}>
        <h3 style={{ fontSize:'18px', fontWeight:900, marginBottom:'20px' }}>📦 أكمل طلبك الآن</h3>

        {/* الاسم واللقب */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px' }}>
          {[['firstName','الاسم','محمد'],['lastName','اللقب','بن علي']].map(([key,label,ph]) => (
            <div key={key}>
              <label style={{ fontSize:'13px', fontWeight:700, display:'block', marginBottom:'6px' }}>{label} <span style={{ color:'#e63946' }}>*</span></label>
              <input style={inp} placeholder={ph} value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                onFocus={focus} onBlur={blur} />
            </div>
          ))}
        </div>

        {/* الهاتف */}
        <div style={{ marginBottom:'14px' }}>
          <label style={{ fontSize:'13px', fontWeight:700, display:'block', marginBottom:'6px' }}>رقم الهاتف <span style={{ color:'#e63946' }}>*</span></label>
          <input style={inp} type="tel" placeholder="05XX XXX XXX" value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })} onFocus={focus} onBlur={blur} />
        </div>

        {/* الولاية */}
        <div style={{ marginBottom:'14px' }}>
          <label style={{ fontSize:'13px', fontWeight:700, display:'block', marginBottom:'6px' }}>الولاية <span style={{ color:'#e63946' }}>*</span></label>
          <select style={inp} value={form.wilaya} onChange={e => handleWilayaChange(e.target.value)} onFocus={focus} onBlur={blur}>
            <option value="">اختر الولاية...</option>
            {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>

        {/* البلدية */}
        <div style={{ marginBottom:'16px' }}>
          <label style={{ fontSize:'13px', fontWeight:700, display:'block', marginBottom:'6px' }}>البلدية <span style={{ color:'#e63946' }}>*</span></label>
          <select style={{ ...inp, opacity: !form.wilaya ? 0.5 : 1 }}
            value={form.commune} disabled={!form.wilaya}
            onChange={e => setForm({ ...form, commune: e.target.value })} onFocus={focus} onBlur={blur}>
            <option value="">{form.wilaya ? 'اختر البلدية...' : 'اختر الولاية أولاً'}</option>
            {communes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* طريقة التوصيل */}
        {form.wilaya && (
          <div style={{ marginBottom:'16px' }}>
            <label style={{ fontSize:'13px', fontWeight:700, display:'block', marginBottom:'10px' }}>🚚 طريقة التوصيل <span style={{ color:'#e63946' }}>*</span></label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
              {[
                { k:'home',   icon:'🏠', label:'توصيل للمنزل',  price: homePrice },
                { k:'office', icon:'🏢', label:'توصيل للمكتب', price: officePrice },
              ].map(({ k, icon, label, price }) => {
                const active = deliveryType === k
                const unavail = price === 0
                return (
                  <button key={k} onClick={() => !unavail && setDeliveryType(k)} style={{
                    padding:'12px 10px', borderRadius:'12px', cursor: unavail ? 'not-allowed' : 'pointer',
                    border:`2px solid ${active ? '#e63946' : '#e9ecef'}`,
                    background: active ? 'rgba(230,57,70,0.06)' : unavail ? '#f8f9fa' : 'white',
                    fontFamily:'Cairo, sans-serif', textAlign:'center',
                    opacity: unavail ? 0.5 : 1, transition:'all 0.2s',
                  }}>
                    <div style={{ fontSize:'22px', marginBottom:'4px' }}>{icon}</div>
                    <div style={{ fontSize:'13px', fontWeight:700, color: active ? '#e63946' : '#1a1a2e' }}>{label}</div>
                    <div style={{ fontSize:'14px', fontWeight:900, color: freeShip && !unavail ? '#2a9d8f' : '#e63946', marginTop:'4px' }}>
                      {unavail ? 'غير متاح' : freeShip ? 'مجاني 🚚' : `${price.toLocaleString('fr-DZ')} دج`}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ─── الكمية + رسالة التخفيض ─── */}
        <div style={{ marginBottom:'16px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <label style={{ fontSize:'13px', fontWeight:700 }}>الكمية</label>
            <div style={{ display:'flex', background:'white', border:'2px solid #e9ecef', borderRadius:'12px', overflow:'hidden' }}>
              <button onClick={() => setQty(q => Math.max(1, q-1))} style={{ width:'46px', height:'46px', border:'none', background:'rgba(230,57,70,0.06)', fontSize:'22px', fontWeight:700, cursor:'pointer', color:'#e63946', fontFamily:'Cairo, sans-serif' }}>−</button>
              <span style={{ minWidth:'50px', textAlign:'center', fontSize:'20px', fontWeight:900, lineHeight:'46px', borderLeft:'1px solid #e9ecef', borderRight:'1px solid #e9ecef' }}>{qty}</span>
              <button onClick={() => setQty(q => Math.min(10, q+1))} style={{ width:'46px', height:'46px', border:'none', background:'rgba(230,57,70,0.06)', fontSize:'22px', fontWeight:700, cursor:'pointer', color:'#e63946', fontFamily:'Cairo, sans-serif' }}>+</button>
            </div>
          </div>
          <DiscountHint qty={qty} rules={rules} price={product.price} />
        </div>

        {/* ─── ملخص الطلب ─── */}
        <div style={{ background:'white', borderRadius:'14px', padding:'18px 20px', margin:'16px 0', border:'2px solid #e9ecef' }}>
          <div style={{ fontSize:'14px', fontWeight:800, marginBottom:'12px', borderBottom:'1px solid #f0f0f0', paddingBottom:'10px' }}>📋 ملخص الطلب</div>
          <SumRow label="المنتج" value={product.name} />
          {colorName     && <SumRow label="اللون" value={colorName} />}
          {selectedSize  && <SumRow label="المقاس" value={selectedSize} />}
          <SumRow label={`${qty} × ${product.price.toLocaleString('fr-DZ')} دج`} value={`${subTotal.toLocaleString('fr-DZ')} دج`} />
          {discAmt > 0   && <SumRow label={`🏷️ خصم الكمية (${discPct}%)`} value={`-${discAmt.toLocaleString('fr-DZ')} دج`} style={{ color:'#2a9d8f', fontWeight:800 }} />}
          {hasGift       && <SumRow label="🎁 هدية مجانية" value="مضمّنة ✓" style={{ color:'#d4820a', fontWeight:700 }} />}
          {form.wilaya   && <SumRow label={deliveryType === 'home' ? '🏠 توصيل للمنزل' : '🏢 توصيل للمكتب'} value={freeShip ? 'مجاني 🚚' : `${deliveryAmt.toLocaleString('fr-DZ')} دج`} style={freeShip ? { color:'#2a9d8f', fontWeight:700 } : {}} />}
          <div style={{ borderTop:'2px solid #e9ecef', paddingTop:'12px', marginTop:'8px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:'14px', fontWeight:700, color:'#6c757d' }}>المجموع الإجمالي:</span>
            <span style={{ fontSize:'28px', fontWeight:900, color:'#e63946' }}>{grandTotal.toLocaleString('fr-DZ')} دج</span>
          </div>
        </div>

        {error && <p style={{ color:'#e63946', fontSize:'13px', marginBottom:'12px' }}>{error}</p>}

        <button onClick={handleSubmit} disabled={loading} style={{
          width:'100%', padding:'18px',
          background: loading ? '#ccc' : 'linear-gradient(135deg, #e63946, #c1121f)',
          color:'white', border:'none', borderRadius:'14px',
          fontFamily:'Cairo, sans-serif', fontSize:'17px', fontWeight:900,
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow:'0 8px 24px rgba(230,57,70,0.3)', marginBottom:'16px',
        }}>
          {loading ? '⏳ جاري الإرسال...' : `🛒 اطلب الآن ${grandTotal.toLocaleString('fr-DZ')} دج — الدفع عند الاستلام`}
        </button>

        <div style={{ display:'flex', justifyContent:'center', gap:'20px', flexWrap:'wrap' }}>
          {['🔒 معلوماتك آمنة', '📦 توصيل 2-5 أيام', '☎️ تأكيد هاتفي'].map(t => (
            <span key={t} style={{ fontSize:'12px', color:'#6c757d', fontWeight:600 }}>{t}</span>
          ))}
        </div>
      </div>
    </>
  )
}
