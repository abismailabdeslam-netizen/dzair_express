'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ProductReviews from './ProductReviews' // 🆕 استيراد مكون التقييمات

function hexToRgba(hex, alpha) {
  if (!hex || !hex.startsWith('#')) return `rgba(139,94,42,${alpha})`
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return `rgba(${r},${g},${b},${alpha})`
}
function darken(hex, pct) {
  if (!hex || !hex.startsWith('#')) return '#6B4420'
  let r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16)
  r=Math.max(0,r-r*pct/100|0); g=Math.max(0,g-g*pct/100|0); b=Math.max(0,b-b*pct/100|0)
  return `rgb(${r},${g},${b})`
}
function lighten(hex, pct) {
  if (!hex || !hex.startsWith('#')) return '#F5ECD7'
  let r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16)
  r=Math.min(255,r+(255-r)*pct/100|0); g=Math.min(255,g+(255-g)*pct/100|0); b=Math.min(255,b+(255-b)*pct/100|0)
  return `rgb(${r},${g},${b})`
}

export default function ProductClientSection({ product, settings, disc }) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null)
  const [selectedSize,  setSelectedSize]  = useState(product.sizes?.[0]  || null)
  const [activeImg, setActiveImg] = useState(0)

  const themeColor = product.theme_color || '#8B5E2A'
  const c1 = themeColor
  const c2 = darken(themeColor, 25)
  const c3 = lighten(themeColor, 50)
  const c4 = lighten(themeColor, 20)
  const border = hexToRgba(themeColor, 0.3)

  const css = `
    :root {
      --c1: ${c1}; --c2: ${c2}; --c3: ${c3}; --c4: ${c4};
      --border: ${border};
      --accent: #E05A3A; --text: #2A1505; --muted: #8B6B4A;
    }
    body { background: ${c3} !important; }
    .page-bg {
      position: fixed; inset: 0; z-index: 0;
      background: ${c3};
    }
    .page-bg::before {
      content: '';
      position: absolute; inset: 0;
      background:
        radial-gradient(ellipse 70% 50% at 15% 15%, rgba(255,255,255,0.55) 0%, transparent 60%),
        radial-gradient(ellipse 50% 70% at 85% 85%, rgba(0,0,0,0.07) 0%, transparent 60%);
    }
    .lp-wrap { position:relative; z-index:1; max-width:480px; margin:0 auto; padding-bottom:80px; }
    .top-bar { background:${c2}; color:${c4}; text-align:center; padding:11px 16px; font-size:13px; font-weight:700; position:sticky; top:0; z-index:100; }
    .banner { width:100%; display:block; position:relative; overflow:hidden; }
    .banner img { width:100%; display:block; object-fit:cover; }
    .product-card {
      margin: -24px 12px 0;
      background: rgba(255,252,245,0.94);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      border: 1.5px solid ${border};
      padding: 24px 18px;
      box-shadow: 0 12px 48px ${hexToRgba(themeColor, 0.18)};
      position: relative;
    }
    .prod-name { font-size:22px; font-weight:900; color:var(--text); line-height:1.2; }
    .disc-badge { background:#E05A3A; color:white; padding:5px 12px; border-radius:50px; font-size:13px; font-weight:700; }
    .price-new { font-size:38px; font-weight:900; color:${c2}; display:block; line-height:1; margin-bottom:4px; }
    .price-old { font-size:14px; color:var(--muted); margin-bottom:16px; }
    .price-old s { color:#E05A3A; }
    .divider { height:1px; background:${border}; margin:16px 0; }
    .prod-desc { font-size:14px; color:var(--muted); line-height:1.9; margin-bottom:20px; }
    .sec-label { font-size:13px; font-weight:700; color:var(--muted); margin-bottom:10px; }
    .color-sw { width:34px; height:34px; border-radius:50%; cursor:pointer; border:3px solid transparent; outline:2px solid transparent; transition:all 0.2s; box-shadow:0 2px 6px rgba(0,0,0,0.15); flex-shrink:0; }
    .color-sw.sel { border-color:white; outline-color:${c1}; transform:scale(1.15); }
    .size-b { padding:8px 18px; border:2px solid ${border}; border-radius:10px; background:white; font-family:Cairo, sans-serif; font-size:13px; font-weight:700; cursor:pointer; color:var(--text); transition:all 0.2s; }
    .size-b.sel { background:${c1}; border-color:${c1}; color:white; }
    .input-row { display:flex; align-items:stretch; background:white; border:1.5px solid ${border}; border-radius:14px; overflow:hidden; transition:border-color 0.2s, box-shadow 0.2s; margin-bottom:12px; }
    .input-row:focus-within { border-color:${c1}; box-shadow:0 0 0 3px ${hexToRgba(themeColor,0.12)}; }
    .inp-icon { width:48px; display:flex; align-items:center; justify-content:center; font-size:18px; background:${hexToRgba(themeColor,0.08)}; border-left:1px solid ${border}; flex-shrink:0; }
    .input-row input, .input-row select { flex:1; padding:14px; border:none; outline:none; font-family:Cairo, sans-serif; font-size:14px; color:var(--text); background:transparent; }
    .qty-ctrl { display:flex; align-items:center; background:white; border:1.5px solid ${border}; border-radius:14px; overflow:hidden; }
    .qty-btn { width:50px; height:50px; border:none; background:${hexToRgba(themeColor,0.08)}; font-size:22px; font-weight:700; cursor:pointer; color:${c1}; font-family:'Cairo',sans-serif; transition:background 0.2s; }
    .qty-btn:hover { background:${c4}; color:white; }
    .qty-n { min-width:54px; text-align:center; font-size:20px; font-weight:900; border-left:1px solid ${border}; border-right:1px solid ${border}; padding:0 4px; }
    .order-btn { width:100%; padding:17px; background:linear-gradient(135deg,${c1},${c2}); color:white; border:none; border-radius:16px; font-family:Cairo, sans-serif; font-size:18px; font-weight:900; cursor:pointer; box-shadow:0 8px 24px ${hexToRgba(themeColor,0.35)}; transition:all 0.3s; margin-bottom:16px; }
    .order-btn:hover { transform:translateY(-2px); box-shadow:0 12px 32px ${hexToRgba(themeColor,0.45)}; }
    .summary-box { background:white; border:1.5px solid ${border}; border-radius:16px; overflow:hidden; }
    .sum-head { display:flex; justify-content:space-between; align-items:center; padding:14px 18px; cursor:pointer; font-weight:700; font-size:14px; background:${hexToRgba(themeColor,0.06)}; user-select:none; }
    .sum-body { overflow:hidden; max-height:0; transition:max-height 0.35s ease; }
    .sum-body.open { max-height:500px; }
    .sum-inner { padding:14px 18px; }
    .sum-total { display:flex; justify-content:space-between; align-items:center; background:linear-gradient(135deg,${c2},${c1}); color:white; padding:14px 16px; border-radius:12px; margin-top:4px; }
    .sticky-bar { position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:480px; padding:10px 14px; background:rgba(255,252,245,0.96); backdrop-filter:blur(12px); border-top:1px solid ${border}; z-index:200; transition:opacity 0.3s, transform 0.3s; }
    .sticky-bar.hidden { opacity:0; pointer-events:none; transform:translateX(-50%) translateY(100%); }
    .sticky-bar button { width:100%; padding:15px; background:linear-gradient(135deg,${c1},${c2}); color:white; border:none; border-radius:14px; font-family:Cairo, sans-serif; font-size:17px; font-weight:900; cursor:pointer; box-shadow:0 6px 20px ${hexToRgba(themeColor,0.35)}; transition:transform 0.2s; }
    .sticky-bar button:hover { transform:translateY(-1px); }
    .scroll-top { position:fixed; bottom:74px; right:14px; width:42px; height:42px; background:${c4}; color:white; border:none; border-radius:12px; font-size:18px; cursor:pointer; z-index:200; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(0,0,0,0.2); opacity:0; transition:opacity 0.3s; }
    .scroll-top.show { opacity:1; }
    .success-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:1000; align-items:center; justify-content:center; padding:20px; }
    .success-overlay.show { display:flex; }
    .success-card { background:white; border-radius:24px; padding:48px 28px; text-align:center; max-width:340px; width:100%; animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1); border:2px solid ${border}; }
    @keyframes popIn { from{transform:scale(0.8);opacity:0} to{transform:scale(1);opacity:1} }
    @media(max-width:480px) { .lp-wrap { max-width:100%; } }
  `

  const [qty, setQty] = useState(1)
  const [fname, setFname] = useState('')
  const [phone, setPhone] = useState('')
  const [wilaya, setWilaya] = useState('')
  const [commune, setCommune] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [sumOpen, setSumOpen] = useState(true)
  const [showScroll, setShowScroll] = useState(false)
  const [hideSticky, setHideSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const btn = document.getElementById('mainOrderBtn')
    if (!btn) return
    const observer = new IntersectionObserver(
      ([entry]) => setHideSticky(entry.isIntersecting),
      { threshold: 0.5 }
    )
    observer.observe(btn)
    return () => observer.disconnect()
  }, [])

  const COMMUNES = {
    '16 - الجزائر': ['الجزائر الوسط','باب الوادي','بلوزداد','الأبيار','بن عكنون','الدار البيضاء','بئر مراد رايس','الحراش','حسين داي','القبة','المرادية','بوزريعة','المحمدية'],
    '31 - وهران': ['وهران','بطيوة','مرسى الكبير','أرزيو','طفراوي','بوتليليس','مسرغين'],
    '25 - قسنطينة': ['قسنطينة','الخروب','أولاد رحمون','ديدوش مراد','حامة بوزيان','عين أبيد'],
    '06 - بجاية': ['بجاية','أقبو','خراطة','سيدي عيش','تيشي','درقينة'],
    '09 - البليدة': ['البليدة','أولاد يعيش','بوفاريك','الأربعاء','موزاية'],
    '19 - سطيف': ['سطيف','عين أزال','قجال','بوقاعة','مزلوق'],
    '05 - باتنة': ['باتنة','عين توتة','تازولت','أريس','نقاوس'],
  }

  const total = product.price * qty

  const handleSubmit = async () => {
    if (!fname || !phone || !wilaya || !commune) { setError('يرجى ملء جميع الحقول'); return }
    setError(''); setLoading(true)
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      await client.from('orders').insert({
        product_id: product.id, product_name: product.name,
        first_name: fname, last_name: '', phone, wilaya, commune,
        color: selectedColor, size: selectedSize,
        quantity: qty, total_price: total, status: 'pending'
      })
      setSuccess(true)
    } catch(e) { setError('حدث خطأ، حاول مجدداً') }
    finally { setLoading(false) }
  }

  const WILAYAS = ['01 - أدرار','02 - الشلف','03 - الأغواط','04 - أم البواقي','05 - باتنة','06 - بجاية','07 - بسكرة','08 - بشار','09 - البليدة','10 - البويرة','11 - تمنراست','12 - تبسة','13 - تلمسان','14 - تيارت','15 - تيزي وزو','16 - الجزائر','17 - الجلفة','18 - جيجل','19 - سطيف','20 - سعيدة','21 - سكيكدة','22 - سيدي بلعباس','23 - عنابة','24 - قالمة','25 - قسنطينة','26 - المدية','27 - مستغانم','28 - المسيلة','29 - معسكر','30 - ورقلة','31 - وهران','32 - البيض','33 - إليزي','34 - برج بوعريريج','35 - بومرداس','36 - الطارف','37 - تندوف','38 - تيسمسيلت','39 - الوادي','40 - خنشلة','41 - سوق أهراس','42 - تيبازة','43 - ميلة','44 - عين الدفلى','45 - النعامة','46 - عين تموشنت','47 - غرداية','48 - غليزان','49 - تيميمون','50 - برج باجي مختار','51 - أولاد جلال','52 - بني عباس','53 - عين صالح','54 - عين قزام','55 - توقرت','56 - جانت','57 - المغير','58 - المنيعة']

  const inp = { border:'none', outline:'none', fontFamily:'Cairo,sans-serif', fontSize:'14px', color:'#2A1505', background:'transparent', flex:1, padding:'14px' }

  if (success) return (
    <>
      <style>{css}</style>
      <div className="page-bg" />
      <div className="lp-wrap" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
        <div style={{ background:'white', borderRadius:'24px', padding:'48px 28px', textAlign:'center', maxWidth:'340px', width:'100%', border:`2px solid ${border}`, margin:'20px' }}>
          <div style={{ fontSize:'60px', marginBottom:'16px' }}>✅</div>
          <h2 style={{ fontSize:'20px', fontWeight:900, color:'#2a9d8f', marginBottom:'10px' }}>تم إرسال طلبك!</h2>
          <p style={{ color:'#6c757d', fontSize:'13px', lineHeight:1.7, marginBottom:'20px' }}>
            شكراً! سنتصل بك قريباً على رقم <strong>{phone}</strong> لتأكيد الطلب 🚚
          </p>
          <Link href="/" style={{ display:'inline-block', padding:'12px 32px', background:c2, color:'white', borderRadius:'12px', fontFamily:'Cairo,sans-serif', fontSize:'14px', fontWeight:700, textDecoration:'none' }}>
            العودة للمتجر
          </Link>
        </div>
      </div>
    </>
  )

  return (
    <>
      <style>{css}</style>
      <div className="page-bg" />

      <div className="lp-wrap">
        <div className="top-bar">🎁 عرض خاص محدود — الدفع عند الاستلام 🛒</div>

        {product.banner_images?.map((img, i) => img && (
          <div key={i} className="banner">
            <img src={img} alt={`banner-${i}`} />
          </div>
        ))}

        <div className="product-card" id="orderSection">

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'10px', marginBottom:'8px' }}>
            <h1 className="prod-name">{product.name}</h1>
            {disc && <span className="disc-badge">- {disc}%</span>}
          </div>

          <span className="price-new">{product.price.toLocaleString('fr-DZ')} دج</span>
          {product.old_price && (
            <div className="price-old">السعر الأصلي: <s>{product.old_price.toLocaleString('fr-DZ')} دج</s></div>
          )}

          <div className="divider" />

          <p className="prod-desc">{product.description}</p>

          {product.colors?.length > 0 && (
            <div style={{ marginBottom:'18px' }}>
              <div className="sec-label">🎨 اختر اللون</div>
              <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
                {product.colors.map((c, i) => (
                  <div key={i} className={`color-sw${selectedColor===c?' sel':''}`}
                    style={{ background: c, ...(c==='#ffffff'?{border:'2px solid #ddd'}:{}) }}
                    onClick={() => setSelectedColor(c)} />
                ))}
              </div>
            </div>
          )}

          {product.sizes?.length > 0 && (
            <div style={{ marginBottom:'20px' }}>
              <div className="sec-label">📏 اختر المقاس</div>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                {product.sizes.map(s => (
                  <button key={s} className={`size-b${selectedSize===s?' sel':''}`}
                    onClick={() => setSelectedSize(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}

          <div className="divider" />

          <div className="input-row">
            <div className="inp-icon">👤</div>
            <input style={inp} placeholder="الاسم الكامل *" value={fname} onChange={e=>setFname(e.target.value)} />
          </div>
          <div className="input-row">
            <div className="inp-icon">📞</div>
            <input style={{...inp, direction: "rtl"}} type="tel" placeholder="05xx xxx xxx" value={phone} onChange={e=>setPhone(e.target.value)} />
          </div>
          <div className="input-row">
            <div className="inp-icon">🗺️</div>
            <select style={inp} value={wilaya} onChange={e=>{setWilaya(e.target.value);setCommune('')}}>
              <option value="">اختر الولاية *</option>
              {WILAYAS.map(w=><option key={w}>{w}</option>)}
            </select>
          </div>
          <div className="input-row">
            <div className="inp-icon">📍</div>
            <select style={inp} value={commune} onChange={e=>setCommune(e.target.value)} disabled={!wilaya}>
              <option value="">{wilaya ? 'اختر البلدية *' : 'اختر الولاية أولاً'}</option>
              {(COMMUNES[wilaya]||[]).map(c=><option key={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'18px', marginTop:'6px' }}>
            <span style={{ fontSize:'15px', fontWeight:700 }}>الكمية</span>
            <div className="qty-ctrl">
              <button className="qty-btn" onClick={()=>setQty(q=>Math.min(10,q+1))}>+</button>
              <span className="qty-n">{String(qty).padStart(2,'0')}</span>
              <button className="qty-btn" onClick={()=>setQty(q=>Math.max(1,q-1))}>−</button>
            </div>
          </div>

          {error && <p style={{ color:'#e63946', fontSize:'13px', marginBottom:'10px' }}>{error}</p>}
          <button id="mainOrderBtn" className="order-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? '⏳ جاري الإرسال...' : 'اطلب الآن 🛒'}
          </button>

          <div className="summary-box">
            <div className="sum-head" onClick={()=>setSumOpen(o=>!o)}>
              <span>ملخص الطلب</span>
              <span style={{ fontSize:'18px' }}>{sumOpen?'∧':'∨'}</span>
            </div>
            <div className={`sum-body${sumOpen?' open':''}`}>
              <div className="sum-inner">
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'12px', marginBottom:'12px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', flex:1 }}>
                    <div style={{ width:'52px', height:'52px', borderRadius:'10px', background:hexToRgba(themeColor,0.1), border:`1px solid ${border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', flexShrink:0, overflow:'hidden', position:'relative' }}>
                      {product.images?.[0] ? <Image src={product.images[0]} alt="" fill style={{objectFit:'cover'}} /> : '🛍️'}
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:'13px' }}>{product.name}</div>
                      {selectedColor && (
                        <div style={{ fontSize:'12px', color:'#8B6B4A', display:'flex', alignItems:'center', gap:'6px', marginTop:'4px' }}>
                          <span>اللون:</span>
                          <span style={{ display:'inline-block', width:'14px', height:'14px', borderRadius:'50%', background:selectedColor, border:'1px solid #ccc' }}></span>
                        </div>
                      )}
                      {selectedSize && (
                        <div style={{ fontSize:'12px', color:'#8B6B4A', marginTop:'2px' }}>المقاس: {selectedSize}</div>
                      )}
                      <div style={{ fontSize:'12px', color:'#8B6B4A', marginTop:'2px' }}>الكمية: x{qty}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight:900, fontSize:'14px', color:c2 }}>{(qty*product.price).toLocaleString('fr-DZ')} دج</div>
                </div>
                <div className="sum-total">
                  <span style={{ fontWeight:700, fontSize:'14px' }}>المجموع</span>
                  <span style={{ fontSize:'22px', fontWeight:900 }}>{total.toLocaleString('fr-DZ')} دج</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 🆕 قسم التقييمات بعد ملخص الطلب */}
        <div style={{ maxWidth: '480px', margin: '24px auto 0', padding: '0 12px' }}>
          <ProductReviews
            productId={product.id}
            initialReviews={[]}
            averageRating={0}
          />
        </div>
      </div>

      <div className={`sticky-bar${hideSticky?' hidden':''}`}>
        <button onClick={()=>document.getElementById('orderSection')?.scrollIntoView({behavior:'smooth'})}>
          اطلب الآن 🛒
        </button>
      </div>

      <button className={`scroll-top${showScroll?' show':''}`}
        onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>↑</button>
    </>
  )
}