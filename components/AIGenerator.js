'use client'
import { useState } from 'react'

const CATEGORIES = [
  'ملابس وأزياء', 'إلكترونيات', 'غذاء وصحة', 'عطور وتجميل',
  'منزل وديكور', 'رياضة', 'أحذية وحقائب', 'مجوهرات وإكسسوارات', 'أخرى'
]
const TARGETS = ['رجال', 'نساء', 'شباب', 'أطفال', 'الجميع']
const TONES = ['مقنع وعاطفي', 'رسمي واحترافي', 'شبابي وعصري', 'ديني وقيمي']

const THEME_SUGGESTIONS = {
  'ملابس وأزياء':    ['#1a1a2e','#8B5E2A','#2D7A4F','#5E2D7A'],
  'إلكترونيات':      ['#1B5E99','#1a1a2e','#2D7A4F','#4A4A4A'],
  'غذاء وصحة':       ['#2D7A4F','#8B5E2A','#7A5E1B','#3D6B1B'],
  'عطور وتجميل':     ['#7A2D5E','#5E2D7A','#8B5E2A','#7A5E1B'],
  'منزل وديكور':     ['#8B5E2A','#1B7A7A','#4A4A4A','#3D6B1B'],
  'رياضة':           ['#1B5E99','#e63946','#2D7A4F','#1a1a2e'],
  'أحذية وحقائب':    ['#8B5E2A','#1a1a2e','#4A4A4A','#7A2D5E'],
  'مجوهرات وإكسسوارات': ['#7A5E1B','#5E2D7A','#7A2D5E','#8B5E2A'],
  'أخرى':            ['#1a1a2e','#8B5E2A','#1B5E99','#2D7A4F'],
}

export default function AIGenerator({ onGenerated, onClose }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    productName: '',
    category: '',
    target: 'الجميع',
    tone: 'مقنع وعاطفي',
    extraInfo: ''
  })
  const [result, setResult] = useState(null)
  const [selectedTheme, setSelectedTheme] = useState(null)

  const generate = async () => {
    if (!form.productName || !form.category) {
      setError('يرجى إدخال اسم المنتج والفئة')
      return
    }
    setError('')
    setLoading(true)

    const prompt = `أنت خبير تسويق رقمي متخصص في السوق الجزائري. 
اكتب محتوى تسويقياً احترافياً لصفحة هبوط لمنتج بالعربية الجزائرية الفصيحة.

المنتج: ${form.productName}
الفئة: ${form.category}
الجمهور المستهدف: ${form.target}
أسلوب الكتابة: ${form.tone}
معلومات إضافية: ${form.extraInfo || 'لا يوجد'}

أجب بـ JSON فقط بهذا الشكل بالضبط، لا تضف أي نص خارج JSON:
{
  "headline": "عنوان رئيسي جذاب وقوي لا يتجاوز 10 كلمات",
  "subheadline": "عنوان فرعي يشرح الفائدة في جملة واحدة",
  "description": "وصف مقنع للمنتج من 3 إلى 4 جمل يذكر الفوائد ويحل مشكلة الزبون",
  "bullets": ["ميزة 1", "ميزة 2", "ميزة 3", "ميزة 4"],
  "cta_button": "نص زر الطلب لا يتجاوز 5 كلمات",
  "urgency_text": "جملة تحفيز على الشراء السريع",
  "banner_texts": ["نص للصورة التسويقية الأولى من سطرين", "نص للصورة الثانية من سطرين"]
}`

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_KEY
      if (!apiKey) {
        setError('مفتاح Gemini غير موجود — تأكد من إضافة NEXT_PUBLIC_GEMINI_KEY في ملف .env.local وإعادة تشغيل السيرفر')
        setLoading(false)
        return
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.8, maxOutputTokens: 1024 }
          })
        }
      )

      if (!response.ok) {
        const errData = await response.json()
        const msg = errData?.error?.message || `خطأ ${response.status}`
        setError(`خطأ من Google: ${msg}`)
        setLoading(false)
        return
      }

      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      if (!text) {
        setError('لم يتم استلام رد من الذكاء الاصطناعي')
        setLoading(false)
        return
      }
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setResult(parsed)
      setSelectedTheme(THEME_SUGGESTIONS[form.category]?.[0] || '#8B5E2A')
      setStep(2)
    } catch (e) {
      setError(`خطأ: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  const applyResult = () => {
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
    })
    onClose()
  }

  const overlay = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '16px', backdropFilter: 'blur(4px)'
  }

  const modal = {
    background: 'white', borderRadius: '24px', width: '100%',
    maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto',
    boxShadow: '0 24px 80px rgba(0,0,0,0.3)'
  }

  const inp = {
    padding: '12px 14px', border: '2px solid #e9ecef', borderRadius: '12px',
    fontFamily: 'Cairo, sans-serif', fontSize: '14px', width: '100%',
    outline: 'none', color: '#1a1a2e', background: '#fafafa'
  }

  const tagBtn = (active) => ({
    padding: '8px 16px', borderRadius: '50px', cursor: 'pointer',
    fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 600,
    border: `2px solid ${active ? '#e63946' : '#e9ecef'}`,
    background: active ? '#e63946' : 'white',
    color: active ? 'white' : '#6c757d', transition: 'all 0.2s'
  })

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modal}>

        {/* Header */}
        <div style={{ padding: '24px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>
              ✨ مولّد المحتوى بالذكاء الاصطناعي
            </h2>
            <p style={{ fontSize: '13px', color: '#6c757d', margin: '4px 0 0' }}>
              {step === 1 ? 'أدخل معلومات المنتج' : 'راجع النتيجة واختر الثيم'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6c757d', lineHeight: 1 }}>×</button>
        </div>

        {/* Steps indicator */}
        <div style={{ padding: '16px 24px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          {[1, 2].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700,
                background: step >= s ? '#e63946' : '#f0f0f0',
                color: step >= s ? 'white' : '#aaa'
              }}>{s}</div>
              {s < 2 && <div style={{ width: '32px', height: '2px', background: step > s ? '#e63946' : '#f0f0f0' }} />}
            </div>
          ))}
          <span style={{ fontSize: '13px', color: '#6c757d', marginRight: '4px' }}>
            {step === 1 ? 'المعلومات' : 'النتيجة'}
          </span>
        </div>

        <div style={{ padding: '0 24px 24px' }}>

          {/* ===== STEP 1 ===== */}
          {step === 1 && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  اسم المنتج <span style={{ color: '#e63946' }}>*</span>
                </label>
                <input style={inp} placeholder="مثال: عطر الفحم الفاخر" value={form.productName}
                  onChange={e => setForm(p => ({ ...p, productName: e.target.value }))} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                  الفئة <span style={{ color: '#e63946' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {CATEGORIES.map(c => (
                    <button key={c} style={tagBtn(form.category === c)}
                      onClick={() => setForm(p => ({ ...p, category: c }))}>{c}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>الجمهور المستهدف</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {TARGETS.map(t => (
                    <button key={t} style={tagBtn(form.target === t)}
                      onClick={() => setForm(p => ({ ...p, target: t }))}>{t}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>أسلوب الكتابة</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {TONES.map(t => (
                    <button key={t} style={tagBtn(form.tone === t)}
                      onClick={() => setForm(p => ({ ...p, tone: t }))}>{t}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  معلومات إضافية <span style={{ color: '#aaa', fontWeight: 400 }}>(اختياري)</span>
                </label>
                <textarea style={{ ...inp, height: '80px', resize: 'vertical' }}
                  placeholder="مثال: المنتج مصنوع من الذهب الحقيقي، مناسب للهدايا..."
                  value={form.extraInfo}
                  onChange={e => setForm(p => ({ ...p, extraInfo: e.target.value }))} />
              </div>

              {error && <p style={{ color: '#e63946', fontSize: '13px', marginBottom: '12px' }}>⚠️ {error}</p>}

              <button onClick={generate} disabled={loading} style={{
                width: '100%', padding: '16px',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #e63946, #c1121f)',
                color: 'white', border: 'none', borderRadius: '14px',
                fontFamily: 'Cairo, sans-serif', fontSize: '16px', fontWeight: 900,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(230,57,70,0.3)'
              }}>
                {loading ? (
                  <span>⏳ الذكاء الاصطناعي يعمل...</span>
                ) : (
                  <span>✨ ولّد المحتوى</span>
                )}
              </button>
            </div>
          )}

          {/* ===== STEP 2 — RESULTS ===== */}
          {step === 2 && result && (
            <div>
              {/* Headline */}
              <div style={{ background: '#f8f9fa', borderRadius: '14px', padding: '16px', marginBottom: '16px', border: '1px solid #e9ecef' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#6c757d', marginBottom: '6px', textTransform: 'uppercase' }}>العنوان الرئيسي</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#1a1a2e' }}>{result.headline}</div>
                <div style={{ fontSize: '14px', color: '#6c757d', marginTop: '6px' }}>{result.subheadline}</div>
              </div>

              {/* Description */}
              <div style={{ background: '#f8f9fa', borderRadius: '14px', padding: '16px', marginBottom: '16px', border: '1px solid #e9ecef' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#6c757d', marginBottom: '6px' }}>الوصف</div>
                <div style={{ fontSize: '14px', color: '#333', lineHeight: 1.8 }}>{result.description}</div>
              </div>

              {/* Bullets */}
              <div style={{ background: '#f8f9fa', borderRadius: '14px', padding: '16px', marginBottom: '16px', border: '1px solid #e9ecef' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#6c757d', marginBottom: '8px' }}>نقاط القوة</div>
                {result.bullets?.map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '14px' }}>
                    <span style={{ color: '#2a9d8f', fontWeight: 700 }}>✅</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {/* CTA + Urgency */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: '#f8f9fa', borderRadius: '14px', padding: '14px', border: '1px solid #e9ecef' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#6c757d', marginBottom: '6px' }}>زر الطلب</div>
                  <div style={{ fontWeight: 900, color: '#e63946', fontSize: '15px' }}>{result.cta_button}</div>
                </div>
                <div style={{ background: '#f8f9fa', borderRadius: '14px', padding: '14px', border: '1px solid #e9ecef' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#6c757d', marginBottom: '6px' }}>جملة التحفيز</div>
                  <div style={{ fontWeight: 700, color: '#e07b39', fontSize: '13px' }}>{result.urgency_text}</div>
                </div>
              </div>

              {/* Banner texts */}
              <div style={{ background: '#f8f9fa', borderRadius: '14px', padding: '16px', marginBottom: '20px', border: '1px solid #e9ecef' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#6c757d', marginBottom: '8px' }}>نصوص البانرات التسويقية</div>
                {result.banner_texts?.map((t, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: '10px', padding: '10px 14px', marginBottom: '8px', fontSize: '13px', border: '1px solid #e9ecef', fontWeight: 600 }}>
                    📸 بانر {i+1}: {t}
                  </div>
                ))}
              </div>

              {/* Theme color selection */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>🎨 اختر لون الثيم المقترح</div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {THEME_SUGGESTIONS[form.category]?.map(color => (
                    <div key={color} onClick={() => setSelectedTheme(color)}
                      style={{
                        width: '44px', height: '44px', borderRadius: '50%',
                        background: color, cursor: 'pointer',
                        border: selectedTheme === color ? '4px solid white' : '2px solid transparent',
                        outline: selectedTheme === color ? `3px solid ${color}` : '2px solid transparent',
                        transform: selectedTheme === color ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }} />
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button onClick={() => setStep(1)} style={{
                  padding: '14px', background: 'white', border: '2px solid #e9ecef',
                  borderRadius: '12px', fontFamily: 'Cairo, sans-serif',
                  fontSize: '14px', fontWeight: 700, cursor: 'pointer', color: '#6c757d'
                }}>← تعديل</button>
                <button onClick={applyResult} style={{
                  padding: '14px',
                  background: 'linear-gradient(135deg, #2a9d8f, #21867a)',
                  color: 'white', border: 'none', borderRadius: '12px',
                  fontFamily: 'Cairo, sans-serif', fontSize: '14px', fontWeight: 900,
                  cursor: 'pointer', boxShadow: '0 6px 20px rgba(42,157,143,0.3)'
                }}>✅ تطبيق النتيجة</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
