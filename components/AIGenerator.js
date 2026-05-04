'use client'
import { useState, useEffect } from 'react'

const CATEGORIES = [
  'ملابس وأزياء','إلكترونيات','غذاء وصحة','عطور وتجميل',
  'منزل وديكور','رياضة','أحذية وحقائب','مجوهرات وإكسسوارات','أخرى',
]
const TARGETS = ['رجال','نساء','شباب','أطفال','الجميع']
const TONES   = ['مقنع وعاطفي','رسمي واحترافي','شبابي وعصري','ديني وقيمي']

const LOADING_STAGES = [
  { icon:'🧠', label:'Claude يحلل المنتج ويفهم السوق...' },
  { icon:'✍️', label:'Claude يكتب المحتوى التسويقي...' },
  { icon:'🎨', label:'Claude يصمم برومبتات الصور لـ Flux...' },
  { icon:'🖼️', label:'Flux يولّد الصور (قد يأخذ 20-30 ثانية)...' },
]

const SHIMMER = `
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
@keyframes fadeUp {
  from { opacity:0; transform:translateY(14px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes pulse {
  0%,100% { opacity:1; transform:scale(1); }
  50%      { opacity:0.6; transform:scale(0.95); }
}
`

function ResultCard({ label, children, accent }) {
  return (
    <div style={{
      background: accent ? `${accent}0D` : '#f8f9fa',
      border: `1px solid ${accent ? `${accent}30` : '#e9ecef'}`,
      borderRadius:'14px', padding:'14px 16px', marginBottom:'12px',
    }}>
      <div style={{ fontSize:'11px', fontWeight:700, color: accent || '#6c757d',
        marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.5px' }}>
        {label}
      </div>
      {children}
    </div>
  )
}

export default function AIGenerator({ onGenerated, onClose }) {
  const [step,         setStep]         = useState(1)
  const [loadStage,    setLoadStage]    = useState(0)
  const [loadProgress, setLoadProgress] = useState(0)
  const [error,        setError]        = useState('')
  const [result,       setResult]       = useState(null)
  const [selectedTheme,setSelectedTheme]= useState(null)
  const [imgLoaded,    setImgLoaded]    = useState({})
  const [form, setForm] = useState({
    productName:'', category:'', target:'الجميع', tone:'مقنع وعاطفي', extraInfo:'',
  })

  useEffect(() => {
    if (step !== 2) return
    let elapsed = 0
    const TOTAL = 22000
    const STAGE_TIMES = [3000, 5000, 4000, 10000]
    const tick = setInterval(() => {
      elapsed += 150
      setLoadProgress(Math.min((elapsed / TOTAL) * 100, 95))
      let acc = 0
      for (let i = 0; i < STAGE_TIMES.length; i++) {
        acc += STAGE_TIMES[i]
        if (elapsed < acc) { setLoadStage(i); break }
      }
    }, 150)
    return () => clearInterval(tick)
  }, [step])

  const generate = async () => {
    if (!form.productName || !form.category) {
      setError('يرجى إدخال اسم المنتج واختيار الفئة'); return
    }
    setError(''); setLoadStage(0); setLoadProgress(0); setStep(2)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'خطأ من الخادم')
      setResult(data)
      setSelectedTheme(data.theme_color || '#8B5E2A')
      setLoadProgress(100)
      setTimeout(() => setStep(3), 500)
    } catch (e) {
      setError(e.message); setStep(1)
    }
  }

  const apply = async () => {
    const imgs = result.generated_images || []
    const fetchFile = async (url, name) => {
      try {
        const r = await fetch(url)
        const blob = await r.blob()
        return new File([blob], name, { type: blob.type })
      } catch { return null }
    }
    onGenerated({
      name: form.productName,
      description: result.description,
      ai_headline: result.headline,
      ai_subheadline: result.subheadline,
      ai_bullets: result.bullets,
      ai_cta: result.cta_button,
      ai_urgency: result.urgency_text,
      ai_banner_texts: result.banner_texts,
      theme_color: selectedTheme,
      ai_banner_file_0: imgs[0] ? await fetchFile(imgs[0], 'ai-banner-1.webp') : null,
      ai_banner_file_1: imgs[1] ? await fetchFile(imgs[1], 'ai-banner-2.webp') : null,
      ai_image_urls: imgs,
    })
    onClose()
  }

  const inp = {
    padding:'12px 14px', border:'2px solid #e9ecef', borderRadius:'12px',
    fontFamily:'Cairo, sans-serif', fontSize:'14px', width:'100%',
    outline:'none', color:'#1a1a2e', background:'#fafafa', transition:'border-color 0.2s',
  }
  const tagBtn = (active) => ({
    padding:'7px 14px', borderRadius:'50px', cursor:'pointer',
    fontFamily:'Cairo, sans-serif', fontSize:'13px', fontWeight:600,
    border:`2px solid ${active ? '#e63946' : '#e9ecef'}`,
    background: active ? '#e63946' : 'white',
    color: active ? 'white' : '#6c757d', transition:'all 0.2s',
  })

  return (
    <div onClick={e => e.target===e.currentTarget && onClose()} style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:1000,
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:'16px', backdropFilter:'blur(6px)',
    }}>
      <style>{SHIMMER}</style>
      <div style={{
        background:'white', borderRadius:'24px', width:'100%', maxWidth:'600px',
        maxHeight:'92vh', overflowY:'auto', boxShadow:'0 32px 100px rgba(0,0,0,0.35)',
        animation:'fadeUp 0.3s ease',
      }}>
        {/* Header */}
        <div style={{
          padding:'20px 24px 16px', display:'flex', justifyContent:'space-between',
          alignItems:'flex-start', borderBottom:'1px solid #f0f0f0',
          position:'sticky', top:0, background:'white', zIndex:2,
        }}>
          <div>
            <h2 style={{ fontSize:'18px', fontWeight:900, margin:0, color:'#1a1a2e' }}>
              🤖 مولّد الذكاء الاصطناعي المتعدد
            </h2>
            <div style={{ display:'flex', gap:'6px', marginTop:'6px' }}>
              <span style={{ fontSize:'11px', background:'#e63946', color:'white', borderRadius:'20px', padding:'2px 10px', fontWeight:700 }}>🧠 Claude — القائد</span>
              <span style={{ fontSize:'11px', background:'#1a1a2e', color:'white', borderRadius:'20px', padding:'2px 10px', fontWeight:700 }}>🖼️ Flux — الصور</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'#f8f9fa', border:'none', borderRadius:'50%',
            width:'36px', height:'36px', cursor:'pointer', fontSize:'18px', color:'#6c757d',
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>×</button>
        </div>

        <div style={{ padding:'20px 24px 28px' }}>

          {/* ── STEP 1: Form ── */}
          {step === 1 && (
            <div style={{ animation:'fadeUp 0.3s ease' }}>
              <div style={{ marginBottom:'16px' }}>
                <label style={{ fontSize:'13px', fontWeight:700, display:'block', marginBottom:'6px' }}>
                  اسم المنتج <span style={{ color:'#e63946' }}>*</span>
                </label>
                <input style={inp} placeholder="مثال: عطر الفحم الفاخر" value={form.productName}
                  onChange={e => setForm(p=>({...p,productName:e.target.value}))}
                  onFocus={e=>e.target.style.borderColor='#e63946'}
                  onBlur={e=>e.target.style.borderColor='#e9ecef'} />
              </div>

              <div style={{ marginBottom:'16px' }}>
                <label style={{ fontSize:'13px', fontWeight:700, display:'block', marginBottom:'8px' }}>
                  الفئة <span style={{ color:'#e63946' }}>*</span>
                </label>
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                  {CATEGORIES.map(c=>(
                    <button key={c} style={tagBtn(form.category===c)}
                      onClick={()=>setForm(p=>({...p,category:c}))}>{c}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom:'16px' }}>
                <label style={{ fontSize:'13px', fontWeight:700, display:'block', marginBottom:'8px' }}>الجمهور</label>
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                  {TARGETS.map(t=>(
                    <button key={t} style={tagBtn(form.target===t)}
                      onClick={()=>setForm(p=>({...p,target:t}))}>{t}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom:'16px' }}>
                <label style={{ fontSize:'13px', fontWeight:700, display:'block', marginBottom:'8px' }}>الأسلوب</label>
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                  {TONES.map(t=>(
                    <button key={t} style={tagBtn(form.tone===t)}
                      onClick={()=>setForm(p=>({...p,tone:t}))}>{t}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom:'20px' }}>
                <label style={{ fontSize:'13px', fontWeight:700, display:'block', marginBottom:'6px' }}>
                  وصف المنتج <span style={{ color:'#aaa', fontWeight:400 }}>(اختياري — للصور الأدق)</span>
                </label>
                <textarea style={{...inp, height:'70px', resize:'vertical'}}
                  placeholder="مثال: زجاجة زجاجية سوداء، رائحة العود والمسك، تغليف فاخر..."
                  value={form.extraInfo}
                  onChange={e=>setForm(p=>({...p,extraInfo:e.target.value}))}
                  onFocus={e=>e.target.style.borderColor='#e63946'}
                  onBlur={e=>e.target.style.borderColor='#e9ecef'} />
              </div>

              <div style={{
                background:'#f8f9fa', border:'1px dashed #e9ecef', borderRadius:'12px',
                padding:'12px 16px', marginBottom:'20px', display:'flex', gap:'10px',
              }}>
                <span style={{ fontSize:'20px' }}>💡</span>
                <div style={{ fontSize:'12px', color:'#6c757d', lineHeight:1.7 }}>
                  <strong style={{ color:'#1a1a2e' }}>كيف يعمل النظام:</strong> Claude يقرأ معلوماتك ← يكتب المحتوى ← يصمم برومبتات احترافية ← Flux يولّد الصور
                </div>
              </div>

              {error && (
                <div style={{ color:'#e63946', fontSize:'13px', marginBottom:'14px',
                  background:'#fff5f5', borderRadius:'10px', padding:'10px 14px',
                  border:'1px solid #fecaca' }}>⚠️ {error}</div>
              )}

              <button onClick={generate} style={{
                width:'100%', padding:'17px',
                background:'linear-gradient(135deg, #1a1a2e 0%, #e63946 100%)',
                color:'white', border:'none', borderRadius:'14px',
                fontFamily:'Cairo, sans-serif', fontSize:'16px', fontWeight:900,
                cursor:'pointer', boxShadow:'0 8px 28px rgba(230,57,70,0.3)',
              }}>
                🚀 ابدأ التوليد — Claude + Flux
              </button>
            </div>
          )}

          {/* ── STEP 2: Loading ── */}
          {step === 2 && (
            <div style={{ textAlign:'center', padding:'16px 0', animation:'fadeUp 0.3s ease' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'12px', marginBottom:'28px' }}>
                {[
                  { bg:'linear-gradient(135deg,#e63946,#c1121f)', icon:'🧠', name:'Claude' },
                  { bg:'linear-gradient(135deg,#1a1a2e,#2d3561)', icon:'🖼️', name:'Flux' },
                ].map((a,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    {i > 0 && <div style={{ color:'#e63946', fontSize:'22px', fontWeight:900 }}>→</div>}
                    <div style={{ background:a.bg, borderRadius:'14px', padding:'12px 16px', color:'white' }}>
                      <div style={{ fontSize:'22px' }}>{a.icon}</div>
                      <div style={{ fontSize:'11px', fontWeight:700, marginTop:'3px' }}>{a.name}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background:'#f8f9fa', borderRadius:'16px', padding:'18px', marginBottom:'20px' }}>
                <div style={{ fontSize:'32px', marginBottom:'8px', animation:'pulse 1.5s infinite' }}>
                  {LOADING_STAGES[loadStage]?.icon}
                </div>
                <div style={{ fontSize:'15px', fontWeight:700, color:'#1a1a2e' }}>
                  {LOADING_STAGES[loadStage]?.label}
                </div>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'7px', marginBottom:'24px', textAlign:'right' }}>
                {LOADING_STAGES.map((s,i)=>(
                  <div key={i} style={{
                    display:'flex', alignItems:'center', gap:'10px',
                    padding:'9px 13px', borderRadius:'10px',
                    background: i < loadStage ? '#2a9d8f12' : i===loadStage ? '#e6394610' : '#f8f9fa',
                    border:`1px solid ${i < loadStage ? '#2a9d8f30' : i===loadStage ? '#e6394630' : '#e9ecef'}`,
                    transition:'all 0.4s',
                  }}>
                    <span style={{ fontSize:'16px', width:'22px', textAlign:'center' }}>
                      {i < loadStage ? '✅' : i===loadStage ? '⚡' : '⏳'}
                    </span>
                    <span style={{
                      fontSize:'13px', flex:1,
                      fontWeight: i===loadStage ? 700 : 400,
                      color: i < loadStage ? '#2a9d8f' : i===loadStage ? '#e63946' : '#bbb',
                    }}>{s.label}</span>
                  </div>
                ))}
              </div>

              <div style={{ background:'#f0f0f0', borderRadius:'99px', height:'7px', overflow:'hidden' }}>
                <div style={{
                  height:'100%', borderRadius:'99px',
                  background:'linear-gradient(90deg,#e63946,#f4a261,#e63946)',
                  backgroundSize:'200% 100%', animation:'shimmer 1.8s infinite linear',
                  width:`${loadProgress}%`, transition:'width 0.3s ease',
                }} />
              </div>
              <div style={{ fontSize:'12px', color:'#6c757d', marginTop:'6px' }}>
                {Math.round(loadProgress)}%
              </div>
            </div>
          )}

          {/* ── STEP 3: Results ── */}
          {step === 3 && result && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>

              {/* الصور */}
              {result.generated_images?.filter(Boolean).length > 0 ? (
                <div style={{ marginBottom:'20px' }}>
                  <div style={{ fontSize:'13px', fontWeight:700, marginBottom:'10px', display:'flex', alignItems:'center', gap:'6px' }}>
                    <span>🖼️ الصور المولّدة بـ Flux</span>
                    <span style={{ fontSize:'11px', background:'#1a1a2e', color:'white', borderRadius:'20px', padding:'2px 8px' }}>AI Generated</span>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                    {result.generated_images.map((url,i) => url && (
                      <div key={i} style={{ borderRadius:'14px', overflow:'hidden', border:'2px solid #e9ecef', position:'relative', aspectRatio:'1' }}>
                        {!imgLoaded[i] && (
                          <div style={{ position:'absolute', inset:0, background:'#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', animation:'pulse 1.5s infinite' }}>🖼️</div>
                        )}
                        <img src={url} alt={`صورة ${i+1}`}
                          style={{ width:'100%', height:'100%', objectFit:'cover', opacity:imgLoaded[i]?1:0, transition:'opacity 0.3s' }}
                          onLoad={()=>setImgLoaded(p=>({...p,[i]:true}))} />
                        <div style={{
                          position:'absolute', bottom:0, left:0, right:0,
                          background:'linear-gradient(transparent,rgba(0,0,0,0.65))',
                          padding:'20px 10px 8px', color:'white', fontSize:'11px', fontWeight:700,
                        }}>{i===0 ? '📸 بانر تسويقي 1' : '🌟 بانر تسويقي 2'}</div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize:'11px', color:'#6c757d', marginTop:'8px', textAlign:'center' }}>
                    ✅ الصور ستُرفع تلقائياً لـ Supabase عند حفظ المنتج
                  </p>
                </div>
              ) : (
                <div style={{ background:'#fff8e1', border:'1px solid #f0c040', borderRadius:'12px', padding:'12px 16px', marginBottom:'16px', fontSize:'13px', color:'#7a5c00' }}>
                  ⚠️ الصور غير متوفرة — أضف <strong>REPLICATE_API_TOKEN</strong> في .env.local لتفعيل توليد الصور
                </div>
              )}

              <ResultCard label="العنوان الرئيسي" accent="#e63946">
                <div style={{ fontSize:'18px', fontWeight:900, color:'#1a1a2e' }}>{result.headline}</div>
                <div style={{ fontSize:'14px', color:'#6c757d', marginTop:'5px' }}>{result.subheadline}</div>
              </ResultCard>

              <ResultCard label="الوصف التسويقي">
                <div style={{ fontSize:'14px', color:'#333', lineHeight:1.8 }}>{result.description}</div>
              </ResultCard>

              <ResultCard label="نقاط القوة" accent="#2a9d8f">
                {result.bullets?.map((b,i)=>(
                  <div key={i} style={{ display:'flex', gap:'8px', marginBottom:'5px', fontSize:'14px' }}>
                    <span style={{ color:'#2a9d8f', fontWeight:900 }}>✅</span><span>{b}</span>
                  </div>
                ))}
              </ResultCard>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'12px' }}>
                <ResultCard label="زر الطلب" accent="#e63946">
                  <div style={{ fontWeight:900, color:'#e63946', fontSize:'14px' }}>{result.cta_button}</div>
                </ResultCard>
                <ResultCard label="جملة الإلحاح">
                  <div style={{ fontWeight:700, color:'#e07b39', fontSize:'13px' }}>{result.urgency_text}</div>
                </ResultCard>
              </div>

              <ResultCard label="نصوص البانرات">
                {result.banner_texts?.map((t,i)=>(
                  <div key={i} style={{ background:'white', borderRadius:'9px', padding:'9px 13px', marginBottom:'6px', fontSize:'13px', border:'1px solid #e9ecef', fontWeight:600 }}>
                    📸 بانر {i+1}: {t}
                  </div>
                ))}
              </ResultCard>

              <div style={{ marginBottom:'20px' }}>
                <div style={{ fontSize:'13px', fontWeight:700, marginBottom:'10px' }}>🎨 لون الثيم المقترح من Claude</div>
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <div style={{
                    width:'48px', height:'48px', borderRadius:'50%', flexShrink:0,
                    background:result.theme_color, boxShadow:`0 4px 14px ${result.theme_color}60`,
                    border:'3px solid white', outline:`3px solid ${result.theme_color}`,
                  }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:'#1a1a2e' }}>{result.theme_color}</div>
                    <div style={{ fontSize:'12px', color:'#6c757d' }}>اقتراح Claude بناءً على تحليل المنتج</div>
                  </div>
                  <button onClick={()=>setSelectedTheme(result.theme_color)} style={{
                    padding:'6px 14px', borderRadius:'20px', cursor:'pointer',
                    border:`2px solid ${selectedTheme===result.theme_color ? result.theme_color : '#e9ecef'}`,
                    background: selectedTheme===result.theme_color ? result.theme_color : 'white',
                    color: selectedTheme===result.theme_color ? 'white' : '#6c757d',
                    fontFamily:'Cairo, sans-serif', fontSize:'12px', fontWeight:700,
                  }}>
                    {selectedTheme===result.theme_color ? '✅ مختار' : 'اختر'}
                  </button>
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <button onClick={()=>{setStep(1);setResult(null);setError('')}} style={{
                  padding:'14px', background:'white', border:'2px solid #e9ecef',
                  borderRadius:'12px', fontFamily:'Cairo, sans-serif',
                  fontSize:'14px', fontWeight:700, cursor:'pointer', color:'#6c757d',
                }}>← توليد جديد</button>
                <button onClick={apply} style={{
                  padding:'14px', background:'linear-gradient(135deg,#2a9d8f,#21867a)',
                  color:'white', border:'none', borderRadius:'12px',
                  fontFamily:'Cairo, sans-serif', fontSize:'14px', fontWeight:900,
                  cursor:'pointer', boxShadow:'0 6px 20px rgba(42,157,143,0.35)',
                }}>✅ تطبيق النتيجة</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
