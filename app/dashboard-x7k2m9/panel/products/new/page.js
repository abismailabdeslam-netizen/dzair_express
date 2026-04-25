'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'
import { useRouter } from 'next/navigation'
import AIGenerator from '@/components/AIGenerator'  // ✅ إضافة مولد الذكاء الاصطناعي

const PRODUCT_COLORS = [
  { label:'أسود',  value:'#1a1a2e' }, { label:'أحمر',  value:'#e63946' },
  { label:'أخضر',  value:'#2a9d8f' }, { label:'ذهبي',  value:'#f4a261' },
  { label:'أزرق',  value:'#457b9d' }, { label:'رمادي', value:'#6c757d' },
  { label:'أبيض',  value:'#ffffff' }, { label:'بني',   value:'#8B4513' },
]

const inp = { padding:'12px 16px', border:'2px solid #e9ecef', borderRadius:'12px', fontFamily:'Cairo,sans-serif', fontSize:'14px', width:'100%', outline:'none', color:'#1a1a2e', background:'white' }

function Card({ title, children }) {
  return (
    <div style={{ background:'white', borderRadius:'16px', padding:'24px', boxShadow:'0 4px 24px rgba(0,0,0,0.06)', marginBottom:'20px' }}>
      <h3 style={{ fontSize:'16px', fontWeight:700, marginBottom:'20px', paddingBottom:'12px', borderBottom:'1px solid #e9ecef' }}>{title}</h3>
      {children}
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom:'16px' }}>
      <label style={{ fontSize:'13px', fontWeight:700, display:'block', marginBottom:'6px' }}>{label}</label>
      {hint && <p style={{ fontSize:'12px', color:'#6c757d', marginBottom:'6px' }}>{hint}</p>}
      {children}
    </div>
  )
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState('')
  const [showAI, setShowAI] = useState(false)  // ✅ حالة عرض نافذة الذكاء الاصطناعي
  const [form, setForm] = useState({
    name:'', description:'', price:'', old_price:'',
    stock:'100', sold:'0', sizes:'', is_active:true,
    theme_color:'#8B5E2A'
  })
  const [selectedColors, setSelectedColors] = useState([])
  const [colorImages, setColorImages] = useState({})
  const [colorPreviews, setColorPreviews] = useState({})
  const [bannerFiles, setBannerFiles] = useState([null, null])
  const [bannerPreviews, setBannerPreviews] = useState([null, null])
  
  // صورة رئيسية
  const [mainImageFile, setMainImageFile] = useState(null)
  const [mainImagePreview, setMainImagePreview] = useState(null)

  const toggleColor = (c) => setSelectedColors(p => p.includes(c) ? p.filter(x=>x!==c) : [...p,c])

  const handleColorImg = (color, file) => {
    if (!file) return
    setColorImages(p=>({...p,[color]:file}))
    setColorPreviews(p=>({...p,[color]:URL.createObjectURL(file)}))
  }

  const handleBanner = (i, file) => {
    if (!file) return
    const b = [...bannerFiles]; b[i] = file; setBannerFiles(b)
    const p = [...bannerPreviews]; p[i] = URL.createObjectURL(file); setBannerPreviews(p)
  }

  const handleMainImage = (file) => {
    if (!file) return
    setMainImageFile(file)
    setMainImagePreview(URL.createObjectURL(file))
  }

  const uploadImg = async (file, path) => {
    const { error } = await supabase.storage.from('products').upload(path, file, { upsert:true })
    if (error) throw error
    return supabase.storage.from('products').getPublicUrl(path).data.publicUrl
  }

  const handleSave = async () => {
    if (!form.name || !form.price) { alert('يرجى إدخال اسم المنتج والسعر'); return }
    setLoading(true)
    try {
      const ts = Date.now()
      const sizes = form.sizes ? form.sizes.split(',').map(s=>s.trim()).filter(Boolean) : []

      // رفع صور البانر
      const bannerUrls = []
      for (let i = 0; i < bannerFiles.length; i++) {
        if (bannerFiles[i]) {
          setProgress(`رفع بانر ${i+1}...`)
          const url = await uploadImg(bannerFiles[i], `${ts}_banner_${i}_${bannerFiles[i].name}`)
          bannerUrls.push(url)
        }
      }

      // رفع صور الألوان
      const images = []
      for (let i = 0; i < selectedColors.length; i++) {
        const file = colorImages[selectedColors[i]]
        if (file) {
          setProgress(`رفع صورة لون ${i+1}...`)
          const url = await uploadImg(file, `${ts}_color_${i}_${file.name}`)
          images.push(url)
        }
      }

      // رفع الصورة الرئيسية
      let mainImageUrl = null
      if (mainImageFile) {
        setProgress('رفع الصورة الرئيسية...')
        mainImageUrl = await uploadImg(mainImageFile, `${ts}_main_${mainImageFile.name}`)
      }

      setProgress('حفظ المنتج...')
      const { error } = await supabase.from('products').insert({
        name: form.name, description: form.description,
        price: parseInt(form.price),
        old_price: form.old_price ? parseInt(form.old_price) : null,
        stock: parseInt(form.stock)||100, sold: parseInt(form.sold)||0,
        colors: selectedColors, sizes, images,
        banner_images: bannerUrls,
        theme_color: form.theme_color,
        is_active: form.is_active,
        main_image: mainImageUrl
      })
      if (error) throw error
      router.push('/dashboard-x7k2m9/panel/products')
    } catch(e) {
      alert('خطأ: ' + e.message)
      setLoading(false); setProgress('')
    }
  }

  return (
    <AdminLayout active="products">
      <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'24px' }}>
        <button onClick={()=>router.back()} style={{ background:'none', border:'1px solid #e9ecef', padding:'8px 16px', borderRadius:'10px', fontFamily:'Cairo,sans-serif', fontSize:'13px', cursor:'pointer' }}>← رجوع</button>
        {/* ✅ زر توليد الذكاء الاصطناعي */}
        <button onClick={() => setShowAI(true)} style={{
          marginRight: 'auto',
          padding: '10px 20px',
          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontFamily: 'Cairo, sans-serif',
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer'
        }}>✨ ولّد بالذكاء الاصطناعي</button>
        <h2 style={{ fontSize:'18px', fontWeight:900 }}>إضافة منتج جديد</h2>
      </div>

      <div style={{ maxWidth:'700px' }}>

        <Card title="📝 معلومات المنتج">
          <Field label="اسم المنتج *">
            <input style={inp} placeholder="مثال: خلطة التوقفين الطبيعية" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} />
          </Field>
          <Field label="وصف المنتج">
            <textarea style={{...inp,height:'100px',resize:'vertical'}} placeholder="اكتب وصفاً جذاباً..." value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} />
          </Field>
        </Card>

        {/* صورة رئيسية */}
        <Card title="📸 صورة المنتج الرئيسية">
          <p style={{ fontSize:'13px', color:'#6c757d', marginBottom:'16px' }}>
            اختر صورة رئيسية للمنتج — ستظهر في الصفحة الرئيسية وفي بطاقة المنتج
          </p>
          <label style={{ display:'block', cursor:'pointer' }}>
            <div style={{
              border:`2px dashed ${mainImagePreview?'#2a9d8f':'#e9ecef'}`,
              borderRadius:'14px', overflow:'hidden',
              background:'#f8f9fa', minHeight:'200px',
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'12px'
            }}>
              {mainImagePreview ? (
                <img src={mainImagePreview} alt="معاينة" style={{ width:'100%', maxHeight:'300px', objectFit:'contain', display:'block' }} />
              ) : (
                <>
                  <span style={{ fontSize:'48px' }}>🖼️</span>
                  <span style={{ fontSize:'14px', color:'#6c757d', fontWeight:600 }}>
                    اضغط لاختيار صورة
                  </span>
                </>
              )}
            </div>
            <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => handleMainImage(e.target.files[0])} />
          </label>
          {mainImagePreview && (
            <button onClick={() => { setMainImageFile(null); setMainImagePreview(null); }}
              style={{ width:'100%', padding:'8px', marginTop:'8px', background:'none', border:'1px solid #e63946', borderRadius:'8px', color:'#e63946', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>
              ✕ إزالة الصورة
            </button>
          )}
        </Card>

        <Card title="💰 الأسعار">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
            <Field label="السعر الحالي (دج) *">
              <input style={inp} type="number" placeholder="1000" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))} />
            </Field>
            <Field label="السعر القديم (دج)">
              <input style={inp} type="number" placeholder="1200" value={form.old_price} onChange={e=>setForm(p=>({...p,old_price:e.target.value}))} />
            </Field>
          </div>
        </Card>

        {/* لون الثيم */}
        <Card title="🎨 لون ثيم الصفحة">
          <p style={{ fontSize:'13px', color:'#6c757d', marginBottom:'16px' }}>
            اختر أي لون تريده — سيصبح ثيم صفحة المنتج
          </p>
          
          <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'16px', flexWrap:'wrap' }}>
            <input 
              type="color" 
              value={form.theme_color} 
              onChange={e => setForm(p => ({...p, theme_color: e.target.value}))}
              style={{ 
                width: '64px', 
                height: '64px', 
                border: '2px solid #e9ecef', 
                borderRadius: '14px', 
                cursor: 'pointer',
                padding: '4px',
                background: 'white'
              }} 
            />
            <div style={{ flex:1 }}>
              <input 
                style={inp} 
                value={form.theme_color} 
                onChange={e => setForm(p => ({...p, theme_color: e.target.value}))}
                placeholder="#8B5E2A"
              />
              <p style={{ fontSize:'11px', color:'#6c757d', marginTop:'4px' }}>
                يمكنك كتابة كود اللون يدوياً (مثال: #FF5733)
              </p>
            </div>
          </div>

          <div style={{ marginTop:'14px', padding:'16px', borderRadius:'14px', background: form.theme_color + '15', border:`1px solid ${form.theme_color}40` }}>
            <p style={{ fontSize:'12px', color:'#6c757d', marginBottom:'8px', fontWeight:600 }}>معاينة سريعة:</p>
            <div style={{ display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap' }}>
              <div style={{ padding:'8px 20px', background:form.theme_color, color:'white', borderRadius:'50px', fontSize:'13px', fontWeight:700 }}>زر الطلب</div>
              <div style={{ padding:'8px 16px', border:`2px solid ${form.theme_color}`, color:form.theme_color, borderRadius:'10px', fontSize:'13px', fontWeight:700 }}>مقاس</div>
              <div style={{ fontSize:'20px', fontWeight:900, color:form.theme_color }}>1000 دج</div>
            </div>
          </div>
        </Card>

        {/* بانرات */}
        <Card title="🖼️ صور البانر التسويقية">
          <p style={{ fontSize:'13px', color:'#6c757d', marginBottom:'16px' }}>
            ارفع صورك المصممة بفوتوشوب — ستظهر في أعلى صفحة المنتج
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            {[0,1].map(i => (
              <div key={i}>
                <label style={{ display:'block', cursor:'pointer' }}>
                  <div style={{
                    border:`2px dashed ${bannerPreviews[i]?'#2a9d8f':'#e9ecef'}`,
                    borderRadius:'14px', overflow:'hidden',
                    background:'#f8f9fa', minHeight:'120px',
                    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'8px'
                  }}>
                    {bannerPreviews[i] ? (
                      <img src={bannerPreviews[i]} alt="" style={{ width:'100%', height:'120px', objectFit:'cover', display:'block' }} />
                    ) : (
                      <>
                        <span style={{ fontSize:'28px' }}>📸</span>
                        <span style={{ fontSize:'12px', color:'#6c757d', fontWeight:600, textAlign:'center', padding:'0 8px' }}>
                          بانر {i+1} {i===0?'(رئيسي)':'(ثانوي)'}
                        </span>
                      </>
                    )}
                  </div>
                  <input type="file" accept="image/*" style={{ display:'none' }} onChange={e=>handleBanner(i,e.target.files[0])} />
                </label>
                {bannerPreviews[i] && (
                  <button onClick={()=>{const b=[...bannerFiles];b[i]=null;setBannerFiles(b);const p=[...bannerPreviews];p[i]=null;setBannerPreviews(p)}}
                    style={{ width:'100%', padding:'4px', background:'none', border:'none', color:'#e63946', fontSize:'11px', cursor:'pointer', fontFamily:'Cairo,sans-serif', marginTop:'4px' }}>
                    ✕ حذف
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* ألوان المنتج */}
        <Card title="🎨 ألوان المنتج والصور">
          <p style={{ fontSize:'13px', color:'#6c757d', marginBottom:'16px' }}>اختر الألوان وارفع صورة لكل لون</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:'12px' }}>
            {PRODUCT_COLORS.map(({label,value}) => {
              const isSel = selectedColors.includes(value)
              const prev = colorPreviews[value]
              return (
                <div key={value} style={{ border:`2px solid ${isSel?'#e63946':'#e9ecef'}`, borderRadius:'14px', overflow:'hidden', background:isSel?'rgba(230,57,70,0.04)':'white' }}>
                  <div onClick={()=>toggleColor(value)} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px', cursor:'pointer' }}>
                    <div style={{ width:'26px', height:'26px', borderRadius:'50%', background:value, border:value==='#ffffff'?'1px solid #ddd':'none', flexShrink:0 }} />
                    <span style={{ fontSize:'13px', fontWeight:700, flex:1 }}>{label}</span>
                    <div style={{ width:'20px', height:'20px', borderRadius:'50%', background:isSel?'#e63946':'#e9ecef', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'11px', fontWeight:900, flexShrink:0 }}>
                      {isSel?'✓':''}
                    </div>
                  </div>
                  {isSel && (
                    <div style={{ padding:'0 12px 12px' }}>
                      <label style={{ display:'block', cursor:'pointer', border:'2px dashed #e9ecef', borderRadius:'10px', overflow:'hidden', background:'#f8f9fa' }}>
                        {prev ? (
                          <img src={prev} alt="" style={{ width:'100%', height:'80px', objectFit:'cover', display:'block' }} />
                        ) : (
                          <div style={{ height:'60px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'4px' }}>
                            <span style={{ fontSize:'20px' }}>📷</span>
                            <span style={{ fontSize:'11px', color:'#6c757d', fontWeight:600 }}>رفع صورة</span>
                          </div>
                        )}
                        <input type="file" accept="image/*" style={{ display:'none' }} onChange={e=>handleColorImg(value,e.target.files[0])} />
                      </label>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        <Card title="📏 المقاسات">
          <Field label="المقاسات" hint="مفصولة بفاصلة — اتركها فارغة إن لم تكن هناك مقاسات">
            <input style={inp} placeholder="S, M, L, XL, XXL" value={form.sizes} onChange={e=>setForm(p=>({...p,sizes:e.target.value}))} />
          </Field>
        </Card>

        <Card title="📦 المخزون">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
            <Field label="إجمالي الكمية">
              <input style={inp} type="number" placeholder="100" value={form.stock} onChange={e=>setForm(p=>({...p,stock:e.target.value}))} />
            </Field>
            <Field label="الكمية المباعة">
              <input style={inp} type="number" placeholder="0" value={form.sold} onChange={e=>setForm(p=>({...p,sold:e.target.value}))} />
            </Field>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <input type="checkbox" id="active" checked={form.is_active} onChange={e=>setForm(p=>({...p,is_active:e.target.checked}))} style={{ width:'18px', height:'18px', cursor:'pointer' }} />
            <label htmlFor="active" style={{ fontSize:'14px', fontWeight:600, cursor:'pointer' }}>تفعيل المنتج (يظهر للزبائن)</label>
          </div>
        </Card>

        {progress && (
          <div style={{ background:'rgba(42,157,143,0.1)', border:'1px solid #2a9d8f', borderRadius:'12px', padding:'14px 18px', marginBottom:'16px', color:'#2a9d8f', fontWeight:700, fontSize:'14px' }}>
            ⏳ {progress}
          </div>
        )}

        <button onClick={handleSave} disabled={loading} style={{
          width:'100%', padding:'18px',
          background:loading?'#ccc':'linear-gradient(135deg,#e63946,#c1121f)',
          color:'white', border:'none', borderRadius:'14px',
          fontFamily:'Cairo,sans-serif', fontSize:'17px', fontWeight:900,
          cursor:loading?'not-allowed':'pointer',
          boxShadow:'0 8px 24px rgba(230,57,70,0.3)', marginBottom:'16px'
        }}>
          {loading ? '⏳ جاري الحفظ...' : '💾 حفظ المنتج'}
        </button>

        <p style={{ fontSize:'12px', color:'#aaa', textAlign:'center' }}>
          ⚠️ تأكد من وجود Storage Bucket باسم "products" في Supabase
        </p>
      </div>

      {/* ✅ نافذة الذكاء الاصطناعي */}
      {showAI && <AIGenerator onGenerated={(d) => setForm(p => ({...p, name: d.name, description: d.description, theme_color: d.theme_color}))} onClose={() => setShowAI(false)} />}
    </AdminLayout>
  )
}