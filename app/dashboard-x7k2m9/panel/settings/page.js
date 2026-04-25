'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'

// تم إخراج Card إلى الخارج (حل مشكلة فقدان التركيز)
function Card({ title, children }) {
  return (
    <div style={{
      background: 'white', borderRadius: '16px', padding: '24px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.06)', maxWidth: '600px', marginBottom: '20px'
    }}>
      <h3 style={{
        fontSize: '16px', fontWeight: 700, marginBottom: '20px',
        paddingBottom: '12px', borderBottom: '1px solid #e9ecef'
      }}>{title}</h3>
      {children}
    </div>
  )
}

// تعريف inputStyle كثابت خارج المكون (يمنع إعادة الإنشاء)
const inputStyle = {
  padding: '12px 16px', border: '2px solid #e9ecef', borderRadius: '12px',
  fontFamily: 'Cairo, sans-serif', fontSize: '14px', width: '100%',
  outline: 'none', color: '#1a1a2e', background: 'white'
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    countdown_days: '1',
    countdown_hours: '3',
    countdown_minutes: '47',
    store_name: 'Dzair Express',
    store_phone: '',
    whatsapp_number: ''
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('settings').select('*').then(({ data }) => {
      if (data) {
        const s = {}
        data.forEach(r => s[r.key] = r.value)
        setSettings(prev => ({ ...prev, ...s }))
      }
    })
  }, [])

  const save = async () => {
    setLoading(true)
    // حفظ جميع الإعدادات باستخدام upsert لكل مفتاح
    const updates = Object.entries(settings).map(([key, value]) => ({ key, value }))
    for (const u of updates) {
      await supabase.from('settings').upsert(u, { onConflict: 'key' })
    }
    setSaved(true)
    setLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }

  // دالة موحدة لتحديث الحالة (تمنع فقدان التركيز)
  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <AdminLayout active="settings">

      <Card title="⏰ العداد التنازلي">
        <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '16px' }}>
          كل زائر يحصل على عداد خاص به يبدأ من لحظة دخوله أول مرة
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>الأيام</label>
            <input style={inputStyle} type="number" min="0" value={settings.countdown_days}
              onChange={e => handleChange('countdown_days', e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>الساعات</label>
            <input style={inputStyle} type="number" min="0" value={settings.countdown_hours}
              onChange={e => handleChange('countdown_hours', e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>الدقائق</label>
            <input style={inputStyle} type="number" min="0" value={settings.countdown_minutes}
              onChange={e => handleChange('countdown_minutes', e.target.value)} />
          </div>
        </div>
      </Card>

      <Card title="🏪 معلومات المتجر">
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>اسم المتجر</label>
          <input style={inputStyle} placeholder="Dzair Express" value={settings.store_name}
            onChange={e => handleChange('store_name', e.target.value)} />
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>رقم الهاتف</label>
          <input style={inputStyle} placeholder="05XX XXX XXX" value={settings.store_phone}
            onChange={e => handleChange('store_phone', e.target.value)} />
        </div>
      </Card>

      <Card title="💬 أيقونات التواصل العائمة">
        <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '20px' }}>
          ستظهر هذه الأيقونات في كل صفحات الموقع لتسهيل التواصل مع الزبائن
        </p>

        {/* WhatsApp */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
            <span style={{ color: '#25D366' }}>●</span> رقم واتساب
          </label>
          <p style={{ fontSize: '12px', color: '#6c757d', marginBottom: '8px' }}>
            أدخل الرقم مع رمز الدولة — مثال: 213550000000
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <input style={inputStyle} placeholder="213550000000" value={settings.whatsapp_number}
              onChange={e => handleChange('whatsapp_number', e.target.value)} />
          </div>
        </div>

      </Card>

      <button onClick={save} disabled={loading} style={{
        padding: '14px 36px', background: loading ? '#ccc' : '#2a9d8f',
        color: 'white', border: 'none', borderRadius: '12px',
        fontFamily: 'Cairo, sans-serif', fontSize: '15px', fontWeight: 700,
        cursor: loading ? 'not-allowed' : 'pointer'
      }}>
        {saved ? '✅ تم الحفظ!' : loading ? '⏳ جاري الحفظ...' : '💾 حفظ الإعدادات'}
      </button>

    </AdminLayout>
  )
}