'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'

const statusMap = {
  pending:   { label: '📵 لم يتم الاتصال', color: '#e07b39', bg: 'rgba(244,162,97,0.15)' },
  confirmed: { label: '✅ تم التأكيد',      color: '#2a9d8f', bg: 'rgba(42,157,143,0.15)' },
  cancelled: { label: '❌ تم الإلغاء',      color: '#e63946', bg: 'rgba(230,57,70,0.1)'   },
  shipped:   { label: '🚚 تم الشحن',        color: '#457b9d', bg: 'rgba(69,123,157,0.15)' },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    setLoading(true)
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    setUpdating(id)
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    setUpdating(null)
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
  }

  return (
    <AdminLayout active="orders">
      {/* Stats Filter */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px', marginBottom: '24px' }}>
        {[
          { key: 'all',       icon: '📋', label: 'الكل' },
          { key: 'pending',   icon: '📵', label: 'لم يتصل' },
          { key: 'confirmed', icon: '✅', label: 'مؤكدة' },
          { key: 'shipped',   icon: '🚚', label: 'مشحونة' },
          { key: 'cancelled', icon: '❌', label: 'ملغاة' },
        ].map(s => (
          <div key={s.key} onClick={() => setFilter(s.key)} style={{
            background: filter === s.key ? '#e63946' : 'white',
            color: filter === s.key ? 'white' : '#1a1a2e',
            borderRadius: '14px', padding: '14px 10px', textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)', cursor: 'pointer',
            border: `2px solid ${filter === s.key ? '#e63946' : '#e9ecef'}`,
            transition: 'all 0.2s'
          }}>
            <div style={{ fontSize: '22px', marginBottom: '4px' }}>{s.icon}</div>
            <div style={{ fontSize: '20px', fontWeight: 900 }}>{counts[s.key]}</div>
            <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6c757d' }}>⏳ جاري التحميل...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6c757d' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
          لا توجد طلبات
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div style={{ display: 'block' }} className="mobile-only">
            {filtered.map(o => {
              const st = statusMap[o.status] || statusMap.pending
              const isUpdating = updating === o.id
              return (
                <div key={o.id} style={{ background: 'white', borderRadius: '16px', padding: '18px', marginBottom: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #e9ecef' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: '16px' }}>{o.first_name} {o.last_name}</div>
                      <div style={{ fontSize: '13px', color: '#6c757d', marginTop: '2px' }}>{o.wilaya}</div>
                    </div>
                    <span style={{ padding: '5px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: 700, background: st.bg, color: st.color, whiteSpace: 'nowrap' }}>{st.label}</span>
                  </div>

                  <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '12px', marginBottom: '12px', fontSize: '13px' }}>
                    {[['المنتج', o.product_name], ['الكمية', o.quantity], o.size && ['المقاس', o.size], o.color && ['اللون', o.color], o.delivery_type && ['التوصيل', o.delivery_type === 'home' ? '🏠 للمنزل' : '🏢 للمكتب']].filter(Boolean).map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: '#6c757d' }}>{k}:</span>
                        <span style={{ fontWeight: 700 }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #e9ecef' }}>
                      <span style={{ color: '#6c757d' }}>الإجمالي:</span>
                      <span style={{ fontWeight: 900, color: '#e63946', fontSize: '16px' }}>{o.total_price?.toLocaleString('fr-DZ')} دج</span>
                    </div>
                  </div>

                  <a href={`tel:${o.phone}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#0a0a0f', color: 'white', padding: '12px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '15px', marginBottom: '10px', direction: 'ltr' }}>
                    📞 {o.phone}
                  </a>

                  <div style={{ display: 'grid', gridTemplateColumns: o.status === 'pending' || o.status === 'confirmed' ? '1fr 1fr' : '1fr', gap: '8px' }}>
                    {o.status === 'pending' && <>
                      <button disabled={isUpdating} onClick={() => updateStatus(o.id, 'confirmed')} style={{ padding: '12px', background: '#2a9d8f', color: 'white', border: 'none', borderRadius: '12px', fontFamily: 'Cairo, sans-serif', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>✅ تأكيد</button>
                      <button disabled={isUpdating} onClick={() => updateStatus(o.id, 'cancelled')} style={{ padding: '12px', background: '#fff0f0', color: '#e63946', border: '2px solid #e63946', borderRadius: '12px', fontFamily: 'Cairo, sans-serif', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>❌ إلغاء</button>
                    </>}
                    {o.status === 'confirmed' && <>
                      <button disabled={isUpdating} onClick={() => updateStatus(o.id, 'shipped')} style={{ padding: '12px', background: '#457b9d', color: 'white', border: 'none', borderRadius: '12px', fontFamily: 'Cairo, sans-serif', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>🚚 تم الشحن</button>
                      <button disabled={isUpdating} onClick={() => updateStatus(o.id, 'cancelled')} style={{ padding: '12px', background: '#fff0f0', color: '#e63946', border: '2px solid #e63946', borderRadius: '12px', fontFamily: 'Cairo, sans-serif', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>❌ إلغاء</button>
                    </>}
                    {(o.status === 'shipped' || o.status === 'cancelled') && (
                      <button disabled={isUpdating} onClick={() => updateStatus(o.id, 'pending')} style={{ padding: '10px', background: '#f8f9fa', color: '#6c757d', border: '1px solid #e9ecef', borderRadius: '12px', fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>↩ إعادة للانتظار</button>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: '#aaa', marginTop: '8px', textAlign: 'left' }}>{new Date(o.created_at).toLocaleDateString('fr-DZ')}</div>
                </div>
              )
            })}
          </div>

          {/* Desktop Table */}
          <div className="desktop-only" style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  {['الاسم','الهاتف','الولاية','المنتج','الكمية','الإجمالي','الحالة','إجراء'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px', fontWeight: 700, color: '#6c757d', borderBottom: '1px solid #e9ecef' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => {
                  const st = statusMap[o.status] || statusMap.pending
                  const isUpdating = updating === o.id
                  return (
                    <tr key={o.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>{o.first_name} {o.last_name}</td>
                      <td style={{ padding: '14px 16px' }}><a href={`tel:${o.phone}`} style={{ color: '#0a0a0f', fontWeight: 700, textDecoration: 'none', direction: 'ltr', display: 'block' }}>📞 {o.phone}</a></td>
                      <td style={{ padding: '14px 16px', fontSize: '13px' }}>{o.wilaya}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px' }}>{o.product_name}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>{o.quantity}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>{o.total_price?.toLocaleString('fr-DZ')} دج</td>
                      <td style={{ padding: '14px 16px' }}><span style={{ padding: '4px 10px', borderRadius: '50px', fontSize: '12px', fontWeight: 700, background: st.bg, color: st.color, whiteSpace: 'nowrap' }}>{st.label}</span></td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {o.status === 'pending' && <>
                            <button disabled={isUpdating} onClick={() => updateStatus(o.id, 'confirmed')} style={{ padding: '6px 12px', background: '#2a9d8f', color: 'white', border: 'none', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '12px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>✅ تأكيد</button>
                            <button disabled={isUpdating} onClick={() => updateStatus(o.id, 'cancelled')} style={{ padding: '6px 12px', background: '#fff0f0', color: '#e63946', border: '1px solid #e63946', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>❌</button>
                          </>}
                          {o.status === 'confirmed' && <>
                            <button disabled={isUpdating} onClick={() => updateStatus(o.id, 'shipped')} style={{ padding: '6px 12px', background: '#457b9d', color: 'white', border: 'none', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '12px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>🚚 شحن</button>
                            <button disabled={isUpdating} onClick={() => updateStatus(o.id, 'cancelled')} style={{ padding: '6px 12px', background: '#fff0f0', color: '#e63946', border: '1px solid #e63946', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>❌</button>
                          </>}
                          {(o.status === 'shipped' || o.status === 'cancelled') && (
                            <button disabled={isUpdating} onClick={() => updateStatus(o.id, 'pending')} style={{ padding: '6px 10px', background: '#f8f9fa', color: '#6c757d', border: '1px solid #e9ecef', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '12px', cursor: 'pointer' }}>↩</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 768px) { .desktop-only { display: none !important; } .mobile-only { display: block !important; } }
        @media (min-width: 769px) { .desktop-only { display: block !important; } .mobile-only { display: none !important; } }
      `}</style>
    </AdminLayout>
  )
}
