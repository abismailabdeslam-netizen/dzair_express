'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'
import { WILAYAS } from '@/lib/wilayas'

// ─── الأسعار الافتراضية (مرجع لملء إعداد جديد تلقائياً) ──────────────────────
const DEFAULT_PRICES = {
  '01 - أدرار':[1150,850],'02 - الشلف':[800,400],'03 - الأغواط':[900,450],
  '04 - أم البواقي':[700,300],'05 - باتنة':[700,300],'06 - بجاية':[700,300],
  '07 - بسكرة':[900,450],'08 - بشار':[1000,750],'09 - البليدة':[750,350],
  '10 - البويرة':[750,350],'11 - تمنراست':[1200,900],'12 - تبسة':[700,300],
  '13 - تلمسان':[800,400],'14 - تيارت':[800,400],'15 - تيزي وزو':[750,350],
  '16 - الجزائر':[550,350],'17 - الجلفة':[900,450],'18 - جيجل':[700,300],
  '19 - سطيف':[700,300],'20 - سعيدة':[800,400],'21 - سكيكدة':[700,300],
  '22 - سيدي بلعباس':[800,400],'23 - عنابة':[700,300],'24 - قالمة':[700,300],
  '25 - قسنطينة':[700,300],'26 - المدية':[750,350],'27 - مستغانم':[800,400],
  '28 - المسيلة':[700,300],'29 - معسكر':[800,400],'30 - ورقلة':[900,450],
  '31 - وهران':[800,400],'32 - البيض':[900,450],'33 - إليزي':[1200,1100],
  '34 - برج بوعريريج':[450,250],'35 - بومرداس':[750,350],'36 - الطارف':[700,300],
  '37 - تندوف':[1300,850],'38 - تيسمسيلت':[800,400],'39 - الوادي':[900,450],
  '40 - خنشلة':[700,300],'41 - سوق أهراس':[700,300],'42 - تيبازة':[750,350],
  '43 - ميلة':[700,300],'44 - عين الدفلى':[750,350],'45 - النعامة':[900,450],
  '46 - عين تموشنت':[800,400],'47 - غرداية':[900,450],'48 - غليزان':[800,400],
  '49 - تيميمون':[1000,750],'51 - أولاد جلال':[900,450],'52 - بني عباس':[1250,700],
  '53 - عين صالح':[1200,1000],'55 - توقرت':[900,450],'57 - المغير':[900,0],
  '58 - المنيعة':[1000,750],
}

const WILAYA_KEYS = Object.keys(DEFAULT_PRICES)

// ═══════════════════════════════════════════════════════════════════════════════
//  مكوّن محرر الأسعار
// ═══════════════════════════════════════════════════════════════════════════════
function Editor({ config, onSave, onCancel }) {
  const isNew = !config?.id

  const [name,         setName]         = useState(config?.name          || '')
  const [company,      setCompany]      = useState(config?.company       || '')
  const [sourceWilaya, setSourceWilaya] = useState(config?.source_wilaya || '')
  const [prices,       setPrices]       = useState(config?.prices        || { ...DEFAULT_PRICES })
  const [saving,       setSaving]       = useState(false)
  const [search,       setSearch]       = useState('')
  const [error,        setError]        = useState('')

  const filtered = WILAYA_KEYS.filter(w => w.includes(search))

  const setPrice = (wilaya, idx, val) => {
    const num = parseInt(val) || 0
    setPrices(p => ({ ...p, [wilaya]: idx === 0 ? [num, p[wilaya]?.[1] ?? 0] : [p[wilaya]?.[0] ?? 0, num] }))
  }

  const handleSave = async () => {
    if (!name.trim()) { setError('يرجى إدخال اسم الإعداد'); return }
    setSaving(true); setError('')
    try {
      const payload = { name: name.trim(), company: company.trim(), source_wilaya: sourceWilaya, prices }
      const { error: err } = isNew
        ? await supabase.from('delivery_configs').insert(payload)
        : await supabase.from('delivery_configs').update(payload).eq('id', config.id)
      if (err) throw err
      onSave()
    } catch (e) { setError(e.message) }
    finally     { setSaving(false) }
  }

  const inp = { padding:'10px 14px', border:'2px solid #e9ecef', borderRadius:'10px', fontFamily:'Cairo, sans-serif', fontSize:'14px', width:'100%', outline:'none', color:'#1a1a2e', background:'white' }

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px' }}>
        <button onClick={onCancel} style={{ background:'#f8f9fa', border:'1px solid #e9ecef', borderRadius:'8px', padding:'8px 14px', cursor:'pointer', fontFamily:'Cairo, sans-serif', fontSize:'13px' }}>→ رجوع</button>
        <h2 style={{ fontSize:'18px', fontWeight:900, margin:0 }}>{isNew ? '➕ إعداد توصيل جديد' : `✏️ تعديل: ${config.name}`}</h2>
      </div>

      {/* معلومات الإعداد */}
      <div style={{ background:'white', border:'1px solid #e9ecef', borderRadius:'16px', padding:'20px', marginBottom:'20px' }}>
        <h3 style={{ fontSize:'15px', fontWeight:800, marginBottom:'16px' }}>📋 معلومات الإعداد</h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px' }}>
          <div>
            <label style={{ fontSize:'13px', fontWeight:700, display:'block', marginBottom:'6px' }}>اسم الإعداد <span style={{ color:'#e63946' }}>*</span></label>
            <input style={inp} placeholder="مثال: توزيع من وهران — يَلنق" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize:'13px', fontWeight:700, display:'block', marginBottom:'6px' }}>شركة التوصيل</label>
            <input style={inp} placeholder="مثال: يَلنق، ماندريف، جيبوسا..." value={company} onChange={e => setCompany(e.target.value)} />
          </div>
        </div>
        <div>
          <label style={{ fontSize:'13px', fontWeight:700, display:'block', marginBottom:'6px' }}>ولاية التوزيع (المنطلق)</label>
          <select style={{ ...inp, appearance:'none' }} value={sourceWilaya} onChange={e => setSourceWilaya(e.target.value)}>
            <option value="">— اختر ولاية التوزيع —</option>
            {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
      </div>

      {/* جدول الأسعار */}
      <div style={{ background:'white', border:'1px solid #e9ecef', borderRadius:'16px', padding:'20px', marginBottom:'20px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px', gap:'12px', flexWrap:'wrap' }}>
          <h3 style={{ fontSize:'15px', fontWeight:800, margin:0 }}>🚚 أسعار التوصيل لكل ولاية</h3>
          <input style={{ ...inp, width:'220px', fontSize:'13px', padding:'8px 12px' }}
            placeholder="🔍 ابحث عن ولاية..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'36px 1fr 130px 130px', gap:'0', borderRadius:'10px', overflow:'hidden', border:'1px solid #e9ecef' }}>
          {/* رأس الجدول */}
          {['#','الولاية','🏠 منزل (دج)','🏢 مكتب (دج)'].map((h,i) => (
            <div key={i} style={{ background:'#1a1a2e', color:'white', padding:'10px 12px', fontSize:'12px', fontWeight:700, textAlign: i===0?'center':'right', borderLeft: i>0?'1px solid rgba(255,255,255,0.1)':'' }}>{h}</div>
          ))}

          {/* صفوف الولايات */}
          {filtered.map((wilaya, idx) => {
            const [home, office] = prices[wilaya] || [0, 0]
            const rowBg = idx % 2 === 0 ? '#fff' : '#f8f9fa'
            return (
              <>
                <div key={`n-${wilaya}`} style={{ background:rowBg, padding:'8px', textAlign:'center', fontSize:'11px', color:'#aaa', borderTop:'1px solid #f0f0f0', display:'flex', alignItems:'center', justifyContent:'center' }}>{idx + 1}</div>
                <div key={`w-${wilaya}`} style={{ background:rowBg, padding:'8px 12px', fontSize:'13px', fontWeight:600, color:'#1a1a2e', borderTop:'1px solid #f0f0f0', borderRight:'1px solid #e9ecef', display:'flex', alignItems:'center' }}>{wilaya}</div>
                <div key={`h-${wilaya}`} style={{ background:rowBg, padding:'6px 8px', borderTop:'1px solid #f0f0f0', borderRight:'1px solid #e9ecef', display:'flex', alignItems:'center' }}>
                  <input type="number" min="0" step="50" value={home}
                    onChange={e => setPrice(wilaya, 0, e.target.value)}
                    style={{ width:'100%', padding:'6px 10px', border:'1.5px solid #e9ecef', borderRadius:'8px', fontFamily:'Cairo, sans-serif', fontSize:'13px', fontWeight:700, color:'#1a1a2e', outline:'none', textAlign:'center', background:'white' }}
                    onFocus={e => e.target.style.borderColor='#e63946'}
                    onBlur={e  => e.target.style.borderColor='#e9ecef'} />
                </div>
                <div key={`o-${wilaya}`} style={{ background:rowBg, padding:'6px 8px', borderTop:'1px solid #f0f0f0', borderRight:'1px solid #e9ecef', display:'flex', alignItems:'center' }}>
                  <input type="number" min="0" step="50" value={office}
                    onChange={e => setPrice(wilaya, 1, e.target.value)}
                    style={{ width:'100%', padding:'6px 10px', border:'1.5px solid #e9ecef', borderRadius:'8px', fontFamily:'Cairo, sans-serif', fontSize:'13px', fontWeight:700, color:'#1a1a2e', outline:'none', textAlign:'center', background:'white' }}
                    onFocus={e => e.target.style.borderColor='#457b9d'}
                    onBlur={e  => e.target.style.borderColor='#e9ecef'} />
                </div>
              </>
            )
          })}
        </div>

        <div style={{ marginTop:'10px', fontSize:'12px', color:'#6c757d', textAlign:'center' }}>
          💡 ضع 0 في خانة المكتب إذا كان التوصيل للمكتب غير متاح في تلك الولاية
        </div>
      </div>

      {error && <div style={{ background:'#fff5f5', border:'1px solid #fecaca', borderRadius:'10px', padding:'12px 16px', color:'#e63946', fontSize:'13px', marginBottom:'16px' }}>⚠️ {error}</div>}

      {/* أزرار الحفظ */}
      <div style={{ display:'flex', gap:'12px' }}>
        <button onClick={onCancel} style={{ flex:1, padding:'14px', background:'white', border:'2px solid #e9ecef', borderRadius:'12px', fontFamily:'Cairo, sans-serif', fontSize:'15px', fontWeight:700, cursor:'pointer', color:'#6c757d' }}>إلغاء</button>
        <button onClick={handleSave} disabled={saving} style={{ flex:2, padding:'14px', background: saving ? '#ccc' : 'linear-gradient(135deg,#1a1a2e,#e63946)', color:'white', border:'none', borderRadius:'12px', fontFamily:'Cairo, sans-serif', fontSize:'15px', fontWeight:900, cursor: saving?'not-allowed':'pointer', boxShadow:'0 6px 20px rgba(230,57,70,0.25)' }}>
          {saving ? '⏳ جاري الحفظ...' : '💾 حفظ الإعداد'}
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  الصفحة الرئيسية — قائمة الإعدادات
// ═══════════════════════════════════════════════════════════════════════════════
export default function DeliveryPage() {
  const [configs,  setConfigs]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [view,     setView]     = useState('list') // 'list' | 'editor'
  const [editing,  setEditing]  = useState(null)
  const [deleting, setDeleting] = useState(null)

  const fetchConfigs = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('delivery_configs').select('*').order('created_at', { ascending: false })
    setConfigs(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchConfigs() }, [fetchConfigs])

  const activate = async (id) => {
    // إلغاء تفعيل الكل أولاً ثم تفعيل المختار
    await supabase.from('delivery_configs').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('delivery_configs').update({ is_active: true  }).eq('id', id)
    fetchConfigs()
  }

  const deleteConfig = async (id) => {
    await supabase.from('delivery_configs').delete().eq('id', id)
    setDeleting(null)
    fetchConfigs()
  }

  const openEditor = (config = null) => { setEditing(config); setView('editor') }
  const closeEditor = () => { setEditing(null); setView('list'); fetchConfigs() }

  if (view === 'editor') {
    return (
      <AdminLayout>
        <Editor config={editing} onSave={closeEditor} onCancel={() => setView('list')} />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h1 style={{ fontSize:'22px', fontWeight:900, margin:0 }}>🚚 إعدادات التوصيل</h1>
          <p style={{ color:'#6c757d', fontSize:'13px', margin:'4px 0 0' }}>أنشئ وفعّل إعدادات أسعار التوصيل حسب موقع التوزيع</p>
        </div>
        <button onClick={() => openEditor()} style={{ padding:'12px 24px', background:'#1a1a2e', color:'white', border:'none', borderRadius:'12px', fontFamily:'Cairo, sans-serif', fontSize:'14px', fontWeight:700, cursor:'pointer', boxShadow:'0 4px 16px rgba(26,26,46,0.25)' }}>
          ➕ إعداد جديد
        </button>
      </div>

      {/* تلميح */}
      <div style={{ background:'rgba(244,162,97,0.08)', border:'1px solid rgba(244,162,97,0.25)', borderRadius:'12px', padding:'14px 18px', marginBottom:'24px', display:'flex', gap:'10px', alignItems:'flex-start' }}>
        <span style={{ fontSize:'20px' }}>💡</span>
        <div style={{ fontSize:'13px', color:'#6c757d', lineHeight:1.7 }}>
          <strong style={{ color:'#1a1a2e' }}>كيف يعمل النظام؟</strong> أنشئ إعداداً لكل ولاية توزيع تعمل منها، ثم فعّل الإعداد المناسب بضغطة واحدة.
          الموقع سيستخدم الأسعار من الإعداد المفعّل تلقائياً في فورم الطلب.
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:'60px', color:'#6c757d' }}>⏳ جاري التحميل...</div>
      ) : configs.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px', background:'white', borderRadius:'16px', border:'2px dashed #e9ecef' }}>
          <div style={{ fontSize:'48px', marginBottom:'16px' }}>🚚</div>
          <h3 style={{ fontWeight:900, marginBottom:'8px' }}>لا توجد إعدادات بعد</h3>
          <p style={{ color:'#6c757d', marginBottom:'20px' }}>أنشئ إعداد التوصيل الأول الخاص بك</p>
          <button onClick={() => openEditor()} style={{ padding:'12px 28px', background:'#e63946', color:'white', border:'none', borderRadius:'12px', fontFamily:'Cairo, sans-serif', fontSize:'14px', fontWeight:700, cursor:'pointer' }}>➕ إنشاء الإعداد الأول</button>
        </div>
      ) : (
        <div style={{ display:'grid', gap:'16px' }}>
          {configs.map(cfg => (
            <div key={cfg.id} style={{ background:'white', border:`2px solid ${cfg.is_active ? '#2a9d8f' : '#e9ecef'}`, borderRadius:'16px', padding:'20px', transition:'border-color 0.2s', position:'relative', overflow:'hidden' }}>
              {cfg.is_active && (
                <div style={{ position:'absolute', top:0, right:0, background:'#2a9d8f', color:'white', fontSize:'11px', fontWeight:700, padding:'4px 14px', borderBottomLeftRadius:'10px' }}>
                  ✅ مفعّل حالياً
                </div>
              )}

              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'12px', flexWrap:'wrap' }}>
                <div style={{ flex:1 }}>
                  <h3 style={{ fontSize:'17px', fontWeight:900, margin:'0 0 6px', color:'#1a1a2e' }}>{cfg.name}</h3>
                  <div style={{ display:'flex', gap:'16px', flexWrap:'wrap' }}>
                    {cfg.company && (
                      <span style={{ fontSize:'13px', color:'#6c757d' }}>🏢 {cfg.company}</span>
                    )}
                    {cfg.source_wilaya && (
                      <span style={{ fontSize:'13px', color:'#6c757d' }}>📍 التوزيع من: {cfg.source_wilaya}</span>
                    )}
                    <span style={{ fontSize:'13px', color:'#6c757d' }}>
                      📊 {Object.keys(cfg.prices || {}).length} ولاية
                    </span>
                  </div>

                  {/* عينة من الأسعار */}
                  <div style={{ marginTop:'12px', display:'flex', gap:'8px', flexWrap:'wrap' }}>
                    {['16 - الجزائر','31 - وهران','25 - قسنطينة'].map(w => {
                      const p = cfg.prices?.[w]
                      if (!p) return null
                      return (
                        <span key={w} style={{ fontSize:'11px', background:'#f8f9fa', border:'1px solid #e9ecef', borderRadius:'8px', padding:'4px 10px', color:'#555' }}>
                          {w.split(' - ')[1]}: 🏠{p[0]} / 🏢{p[1]}
                        </span>
                      )
                    })}
                  </div>
                </div>

                {/* أزرار */}
                <div style={{ display:'flex', gap:'8px', flexShrink:0, flexWrap:'wrap' }}>
                  {!cfg.is_active && (
                    <button onClick={() => activate(cfg.id)} style={{ padding:'9px 18px', background:'rgba(42,157,143,0.08)', color:'#2a9d8f', border:'1.5px solid #2a9d8f', borderRadius:'10px', fontFamily:'Cairo, sans-serif', fontSize:'13px', fontWeight:700, cursor:'pointer' }}>
                      ✅ تفعيل
                    </button>
                  )}
                  <button onClick={() => openEditor(cfg)} style={{ padding:'9px 18px', background:'rgba(26,26,46,0.06)', color:'#1a1a2e', border:'1.5px solid #e9ecef', borderRadius:'10px', fontFamily:'Cairo, sans-serif', fontSize:'13px', fontWeight:700, cursor:'pointer' }}>
                    ✏️ تعديل
                  </button>
                  <button onClick={() => setDeleting(cfg.id)} style={{ padding:'9px 18px', background:'rgba(230,57,70,0.06)', color:'#e63946', border:'1.5px solid rgba(230,57,70,0.3)', borderRadius:'10px', fontFamily:'Cairo, sans-serif', fontSize:'13px', fontWeight:700, cursor:'pointer' }}>
                    🗑️
                  </button>
                </div>
              </div>

              {/* تأكيد الحذف */}
              {deleting === cfg.id && (
                <div style={{ marginTop:'16px', background:'#fff5f5', border:'1px solid #fecaca', borderRadius:'10px', padding:'14px', display:'flex', gap:'10px', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap' }}>
                  <span style={{ fontSize:'13px', color:'#e63946', fontWeight:700 }}>⚠️ هل أنت متأكد من حذف هذا الإعداد؟</span>
                  <div style={{ display:'flex', gap:'8px' }}>
                    <button onClick={() => setDeleting(null)} style={{ padding:'7px 16px', background:'white', border:'1px solid #e9ecef', borderRadius:'8px', fontFamily:'Cairo, sans-serif', fontSize:'13px', cursor:'pointer' }}>إلغاء</button>
                    <button onClick={() => deleteConfig(cfg.id)} style={{ padding:'7px 16px', background:'#e63946', color:'white', border:'none', borderRadius:'8px', fontFamily:'Cairo, sans-serif', fontSize:'13px', fontWeight:700, cursor:'pointer' }}>نعم، احذف</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
