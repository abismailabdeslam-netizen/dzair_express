'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'
import { useRouter } from 'next/navigation'

const COLOR_PRESETS = [
  { label: 'أسود',  value: '#1a1a2e' },
  { label: 'أحمر',  value: '#e63946' },
  { label: 'أخضر',  value: '#2a9d8f' },
  { label: 'أزرق',  value: '#457b9d' },
  { label: 'ذهبي',  value: '#f4a261' },
  { label: 'رمادي', value: '#6c757d' },
  { label: 'أبيض',  value: '#ffffff' },
  { label: 'بني',   value: '#8B4513' },
]

const inp = {
  padding: '12px 16px',
  border: '2px solid #e9ecef',
  borderRadius: '12px',
  fontFamily: 'Cairo, sans-serif',
  fontSize: '14px',
  width: '100%',
  outline: 'none',
  color: '#1a1a2e',
  background: 'white',
}

function Card({ title, children }) {
  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #e9ecef' }}>{title}</h3>
      {children}
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>{label}</label>
      {hint && <p style={{ fontSize: '12px', color: '#6c757d', marginBottom: '6px' }}>{hint}</p>}
      {children}
    </div>
  )
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [form, setForm] = useState({
    name: '', description: '', price: '', old_price: '',
    stock: '100', sold: '0', sizes: '', is_active: true
  })
  const [selectedColors, setSelectedColors] = useState([])
  const [colorImages, setColorImages] = useState({})
  const [colorImagePreviews, setColorImagePreviews] = useState({})

  const toggleColor = (color) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    )
  }

  const handleImageForColor = (color, file) => {
    if (!file) return
    setColorImages(prev => ({ ...prev, [color]: file }))
    setColorImagePreviews(prev => ({ ...prev, [color]: URL.createObjectURL(file) }))
  }

  const uploadImage = async (file, path) => {
    const { error } = await supabase.storage.from('products').upload(path, file, { upsert: true })
    if (error) throw error
    const { data } = supabase.storage.from('products').getPublicUrl(path)
    return data.publicUrl
  }

  const handleSave = async () => {
    if (!form.name || !form.price) { alert('يرجى إدخال اسم المنتج والسعر'); return }
    setLoading(true)
    try {
      const sizes = form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : []
      const timestamp = Date.now()
      const images = []

      for (let i = 0; i < selectedColors.length; i++) {
        const color = selectedColors[i]
        const file = colorImages[color]
        if (file) {
          setUploadProgress(`جاري رفع صورة ${i + 1} من ${selectedColors.length}...`)
          const url = await uploadImage(file, `${timestamp}_${i}_${file.name}`)
          images.push(url)
        }
      }

      setUploadProgress('جاري حفظ المنتج...')
      const { error } = await supabase.from('products').insert({
        name: form.name,
        description: form.description,
        price: parseInt(form.price),
        old_price: form.old_price ? parseInt(form.old_price) : null,
        stock: parseInt(form.stock) || 100,
        sold: parseInt(form.sold) || 0,
        colors: selectedColors,
        sizes,
        images,
        is_active: form.is_active,
      })

      if (error) throw error
      router.push('/dashboard-x7k2m9/panel/products')
    } catch (e) {
      alert('حدث خطأ: ' + e.message)
      setLoading(false)
      setUploadProgress('')
    }
  }

  return (
    <AdminLayout active="products">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: '1px solid #e9ecef', padding: '8px 16px', borderRadius: '10px', fontFamily: 'Cairo, sans-serif', fontSize: '13px', cursor: 'pointer' }}>← رجوع</button>
        <h2 style={{ fontSize: '18px', fontWeight: 900 }}>إضافة منتج جديد</h2>
      </div>

      <div style={{ maxWidth: '700px' }}>

        <Card title="📝 معلومات المنتج">
          <Field label="اسم المنتج *">
            <input style={inp} placeholder="مثال: قميص كلاسيك بريميوم"
              value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </Field>
          <Field label="وصف المنتج">
            <textarea style={{ ...inp, height: '100px', resize: 'vertical' }}
              placeholder="اكتب وصفاً جذاباً للمنتج..."
              value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </Field>
        </Card>

        <Card title="💰 الأسعار">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="السعر الحالي (دج) *">
              <input style={inp} type="number" placeholder="1990"
                value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
            </Field>
            <Field label="السعر القديم (دج)" hint="اتركه فارغاً إن لم يكن هناك تخفيض">
              <input style={inp} type="number" placeholder="3500"
                value={form.old_price} onChange={e => setForm(p => ({ ...p, old_price: e.target.value }))} />
            </Field>
          </div>
        </Card>

        <Card title="🎨 الألوان والصور">
          <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '16px' }}>
            اختر الألوان المتاحة وارفع صورة لكل لون
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
            {COLOR_PRESETS.map(({ label, value }) => {
              const isSelected = selectedColors.includes(value)
              const preview = colorImagePreviews[value]
              return (
                <div key={value} style={{
                  border: `2px solid ${isSelected ? '#e63946' : '#e9ecef'}`,
                  borderRadius: '14px', overflow: 'hidden',
                  background: isSelected ? 'rgba(230,57,70,0.04)' : 'white'
                }}>
                  <div onClick={() => toggleColor(value)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', cursor: 'pointer' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: value, border: value === '#ffffff' ? '1px solid #ddd' : 'none', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', fontWeight: 700, flex: 1 }}>{label}</span>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: isSelected ? '#e63946' : '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 900, flexShrink: 0 }}>
                      {isSelected ? '✓' : ''}
                    </div>
                  </div>

                  {isSelected && (
                    <div style={{ padding: '0 12px 12px' }}>
                      <label style={{ display: 'block', cursor: 'pointer', border: '2px dashed #e9ecef', borderRadius: '10px', overflow: 'hidden', background: '#f8f9fa' }}>
                        {preview ? (
                          <img src={preview} alt="" style={{ width: '100%', height: '90px', objectFit: 'cover', display: 'block' }} />
                        ) : (
                          <div style={{ height: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            <span style={{ fontSize: '22px' }}>📷</span>
                            <span style={{ fontSize: '11px', color: '#6c757d', fontWeight: 600 }}>رفع صورة</span>
                          </div>
                        )}
                        <input type="file" accept="image/*" style={{ display: 'none' }}
                          onChange={e => handleImageForColor(value, e.target.files[0])} />
                      </label>
                      {preview && (
                        <button onClick={() => {
                          setColorImages(p => { const n = { ...p }; delete n[value]; return n })
                          setColorImagePreviews(p => { const n = { ...p }; delete n[value]; return n })
                        }} style={{ width: '100%', padding: '4px', background: 'none', border: 'none', color: '#e63946', fontSize: '11px', cursor: 'pointer', marginTop: '4px', fontFamily: 'Cairo, sans-serif' }}>
                          ✕ حذف الصورة
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        <Card title="📏 المقاسات">
          <Field label="المقاسات" hint="أدخل المقاسات مفصولة بفاصلة — اتركها فارغة إن لم تكن هناك مقاسات">
            <input style={inp} placeholder="S, M, L, XL, XXL"
              value={form.sizes} onChange={e => setForm(p => ({ ...p, sizes: e.target.value }))} />
          </Field>
        </Card>

        <Card title="📦 المخزون">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="إجمالي الكمية">
              <input style={inp} type="number" placeholder="100"
                value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} />
            </Field>
            <Field label="الكمية المباعة" hint="لشريط التقدم">
              <input style={inp} type="number" placeholder="0"
                value={form.sold} onChange={e => setForm(p => ({ ...p, sold: e.target.value }))} />
            </Field>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
            <input type="checkbox" id="active" checked={form.is_active}
              onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
            <label htmlFor="active" style={{ fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
              تفعيل المنتج (يظهر للزبائن)
            </label>
          </div>
        </Card>

        {uploadProgress && (
          <div style={{ background: 'rgba(42,157,143,0.1)', border: '1px solid #2a9d8f', borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', color: '#2a9d8f', fontWeight: 700, fontSize: '14px' }}>
            ⏳ {uploadProgress}
          </div>
        )}

        <button onClick={handleSave} disabled={loading} style={{
          width: '100%', padding: '18px',
          background: loading ? '#ccc' : 'linear-gradient(135deg, #e63946, #c1121f)',
          color: 'white', border: 'none', borderRadius: '14px',
          fontFamily: 'Cairo, sans-serif', fontSize: '17px', fontWeight: 900,
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 8px 24px rgba(230,57,70,0.3)',
          marginBottom: '16px'
        }}>
          {loading ? '⏳ جاري الحفظ...' : '💾 حفظ المنتج'}
        </button>

        <p style={{ fontSize: '12px', color: '#aaa', textAlign: 'center' }}>
          ⚠️ تأكد من إنشاء Storage Bucket باسم "products" في Supabase قبل رفع الصور
        </p>

      </div>
    </AdminLayout>
  )
}
