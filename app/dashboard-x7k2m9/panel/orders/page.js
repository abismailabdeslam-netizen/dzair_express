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
  const [deleting, setDeleting] = useState(null)
  const [selected, setSelected] = useState([])
  const [filter, setFilter] = useState('all')
  const [productFilter, setProductFilter] = useState('all')
  const [lastRefresh, setLastRefresh] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        if (payload.eventType === 'INSERT') setOrders(prev => [payload.new, ...prev])
        else if (payload.eventType === 'UPDATE') setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new : o))
        else if (payload.eventType === 'DELETE') setOrders(prev => prev.filter(o => o.id !== payload.old.id))
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    setError('')
    const { data, error: err } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (err) setError('خطأ في تحميل الطلبات: ' + err.message)
    else setOrders(data || [])
    setLastRefresh(new Date())
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    setUpdating(id)
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    setUpdating(null)
  }

  const deleteOrder = async (id) => {
    if (!confirm('هل تريد حذف هذا الطلب نهائياً؟')) return
    setDeleting(id)
    await supabase.from('orders').delete().eq('id', id)
    setOrders(prev => prev.filter(o => o.id !== id))
    setSelected(prev => prev.filter(s => s !== id))
    setDeleting(null)
  }

  const deleteSelected = async () => {
    if (!selected.length) return
    if (!confirm(`هل تريد حذف ${selected.length} طلب نهائياً؟ لا يمكن التراجع.`)) return
    for (const id of selected) {
      await supabase.from('orders').delete().eq('id', id)
    }
    setOrders(prev => prev.filter(o => !selected.includes(o.id)))
    setSelected([])
  }

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  const toggleAll = () => setSelected(selected.length === byProduct.length ? [] : byProduct.map(o => o.id))

  // قائمة المنتجات الفريدة
  const uniqueProducts = [...new Map(orders.map(o => [o.product_id, o.product_name])).entries()]
    .map(([id, name]) => ({ id, name }))

  // تطبيق فلتر الحالة أولاً ثم فلتر المنتج
  const byStatus = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const byProduct = productFilter === 'all' ? byStatus : byStatus.filter(o => o.product_id === productFilter)

  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
  }

  return (
    <AdminLayout active="orders">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '2px' }}>📋 الطلبات</h1>
          {lastRefresh && <p style={{ fontSize: '11px', color: '#aaa' }}>آخر تحديث: {lastRefresh.toLocaleTimeString('fr-DZ')}</p>}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {selected.length > 0 && (
            <button onClick={deleteSelected} style={{
              padding: '10px 18px', background: '#e63946', color: 'white',
              border: 'none', borderRadius: '12px', fontFamily: 'Cairo, sans-serif',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer'
            }}>🗑️ حذف المحدد ({selected.length})</button>
          )}
          <button onClick={fetchOrders} disabled={loading} style={{
            padding: '10px 18px', background: '#f8f9fa', border: '2px solid #e9ecef',
            borderRadius: '12px', fontFamily: 'Cairo, sans-serif', fontSize: '13px',
            fontWeight: 700, cursor: 'pointer'
          }}>{loading ? '⏳' : '🔄'} تحديث</button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fff0f0', border: '2px solid #e63946', borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', color: '#e63946', fontWeight: 700, fontSize: '14px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Stats Filter */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        {[
          { key: 'all',       icon: '📋', label: 'الكل' },
          { key: 'pending',   icon: '📵', label: 'لم يتصل' },
          { key: 'confirmed', icon: '✅', label: 'مؤكدة' },
          { key: 'shipped',   icon: '🚚', label: 'مشحونة' },
          { key: 'cancelled', icon: '❌', label: 'ملغاة' },
        ].map(s => (
          <div key={s.key} onClick={() => { setFilter(s.key); setProductFilter('all'); setSelected([]) }} style={{
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

      {/* Product Filter */}
      {uniqueProducts.length > 1 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#6c757d' }}>📦 تصفية حسب المنتج:</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => { setProductFilter('all'); setSelected([]) }} style={{
              padding: '8px 16px', borderRadius: '50px', fontFamily: 'Cairo, sans-serif',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              border: `2px solid ${productFilter === 'all' ? '#1a1a2e' : '#e9ecef'}`,
              background: productFilter === 'all' ? '#1a1a2e' : 'white',
              color: productFilter === 'all' ? 'white' : '#1a1a2e'
            }}>
              الكل ({orders.length})
            </button>
            {uniqueProducts.map(p => {
              const count = orders.filter(o => o.product_id === p.id).length
              const active = productFilter === p.id
              return (
                <button key={p.id} onClick={() => { setProductFilter(p.id); setSelected([]) }} style={{
                  padding: '8px 16px', borderRadius: '50px', fontFamily: 'Cairo, sans-serif',
                  fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                  border: `2px solid ${active ? '#e63946' : '#e9ecef'}`,
                  background: active ? '#e63946' : 'white',
                  color: active ? 'white' : '#1a1a2e'
                }}>
                  📦 {p.name} ({count})
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Select All */}
      {byProduct.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', padding: '10px 16px', background: 'white', borderRadius: '12px', border: '1px solid #e9ecef' }}>
          <input type="checkbox" checked={selected.length === byProduct.length && byProduct.length > 0}
            onChange={toggleAll} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
          <label style={{ fontSize: '13px', fontWeight: 600, cursor: 'pointer' }} onClick={toggleAll}>
            تحديد الكل ({byProduct.length})
          </label>
          {selected.length > 0 && (
            <span style={{ fontSize: '12px', color: '#e63946', fontWeight: 700 }}>— {selected.length} محدد</span>
          )}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6c757d' }}>⏳ جاري التحميل...</div>
      ) : byProduct.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6c757d' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
          لا توجد طلبات
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div style={{ display: 'block' }} className="mobile-only">
            {byProduct.map(o => {
              const st = statusMap[o.status] || statusMap.pending
              const isUpdating = updating === o.id
              const isDeleting = deleting === o.id
              const isSelected = selected.includes(o.id)
              return (
                <div key={o.id} style={{
                  background: 'white', borderRadius: '16px', padding: '18px', marginBottom: '12px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  border: `2px solid ${isSelected ? '#e63946' : '#e9ecef'}`,
                  transition: 'border-color 0.2s'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(o.id)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 900, fontSize: '16px' }}>{o.first_name} {o.last_name}</div>
                        <div style={{ fontSize: '13px', color: '#6c757d', marginTop: '2px' }}>{o.wilaya}{o.commune ? ` — ${o.commune}` : ''}</div>
                      </div>
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
                    {o.delivery_price > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: '#6c757d' }}>سعر التوصيل:</span>
                        <span style={{ fontWeight: 700 }}>{o.delivery_price?.toLocaleString('fr-DZ')} دج</span>
                      </div>
                    )}
                    {/* ── شارات التخفيض ── */}
                    {(o.discount_pct > 0 || o.has_gift || o.delivery_price === 0) && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #e9ecef' }}>
                        {o.discount_pct > 0 && (
                          <span style={{ background: 'rgba(42,157,143,0.12)', color: '#2a9d8f', border: '1px solid rgba(42,157,143,0.3)', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 800 }}>
                            🏷️ خصم {o.discount_pct}% — وفّر {o.discount_amount?.toLocaleString('fr-DZ')} دج
                          </span>
                        )}
                        {o.delivery_price === 0 && o.wilaya && (
                          <span style={{ background: 'rgba(69,123,157,0.12)', color: '#457b9d', border: '1px solid rgba(69,123,157,0.3)', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 800 }}>
                            🚚 توصيل مجاني
                          </span>
                        )}
                        {o.has_gift && (
                          <span style={{ background: 'rgba(212,130,10,0.12)', color: '#d4820a', border: '1px solid rgba(212,130,10,0.3)', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 800 }}>
                            🎁 هدية مجانية
                          </span>
                        )}
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e9ecef' }}>
                      <span style={{ color: '#6c757d' }}>الإجمالي:</span>
                      <span style={{ fontWeight: 900, color: '#e63946', fontSize: '16px' }}>{o.total_price?.toLocaleString('fr-DZ')} دج</span>
                    </div>
                  </div>

                  <a href={`tel:${o.phone}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#0a0a0f', color: 'white', padding: '12px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '15px', marginBottom: '10px', direction: 'ltr' }}>
                    📞 {o.phone}
                  </a>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
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

                  {/* Delete Button */}
                  <button disabled={isDeleting} onClick={() => deleteOrder(o.id)} style={{
                    width: '100%', padding: '10px', background: 'white', color: '#e63946',
                    border: '2px solid #e63946', borderRadius: '12px', fontFamily: 'Cairo, sans-serif',
                    fontSize: '13px', fontWeight: 700, cursor: isDeleting ? 'not-allowed' : 'pointer', opacity: isDeleting ? 0.5 : 1
                  }}>
                    {isDeleting ? '⏳ جاري الحذف...' : '🗑️ حذف الطلب نهائياً'}
                  </button>

                  <div style={{ fontSize: '11px', color: '#aaa', marginTop: '8px', textAlign: 'left' }}>{new Date(o.created_at).toLocaleDateString('fr-DZ')}</div>
                </div>
              )
            })}
          </div>

          {/* Desktop Table */}
          <div className="desktop-only" style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '14px 16px', width: '40px' }}>
                    <input type="checkbox" checked={selected.length === byProduct.length && byProduct.length > 0}
                      onChange={toggleAll} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                  </th>
                  {['الاسم','الهاتف','الولاية','المنتج','الكمية','التوصيل','العروض','الإجمالي','الحالة','إجراء'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px', fontWeight: 700, color: '#6c757d', borderBottom: '1px solid #e9ecef' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {byProduct.map(o => {
                  const st = statusMap[o.status] || statusMap.pending
                  const isUpdating = updating === o.id
                  const isDeleting = deleting === o.id
                  const isSelected = selected.includes(o.id)
                  return (
                    <tr key={o.id} style={{ borderBottom: '1px solid #f5f5f5', background: isSelected ? 'rgba(230,57,70,0.03)' : 'white' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(o.id)}
                          style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>{o.first_name} {o.last_name}</td>
                      <td style={{ padding: '14px 16px' }}><a href={`tel:${o.phone}`} style={{ color: '#0a0a0f', fontWeight: 700, textDecoration: 'none', direction: 'ltr', display: 'block' }}>📞 {o.phone}</a></td>
                      <td style={{ padding: '14px 16px', fontSize: '13px' }}>{o.wilaya}{o.commune ? `\n${o.commune}` : ''}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px' }}>{o.product_name}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>{o.quantity}</td>
                      <td style={{ padding: '14px 16px', fontSize: '12px' }}>{o.delivery_type === 'home' ? '🏠 منزل' : o.delivery_type === 'office' ? '🏢 مكتب' : '—'}</td>
                      <td style={{ padding: '10px 16px' }}>
                        {(o.discount_pct > 0 || o.has_gift || o.delivery_price === 0) ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {o.discount_pct > 0 && (
                              <span style={{ background: 'rgba(42,157,143,0.12)', color: '#2a9d8f', border: '1px solid rgba(42,157,143,0.3)', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, whiteSpace: 'nowrap' }}>
                                🏷️ -{o.discount_pct}% ({o.discount_amount?.toLocaleString('fr-DZ')} دج)
                              </span>
                            )}
                            {o.delivery_price === 0 && o.wilaya && (
                              <span style={{ background: 'rgba(69,123,157,0.12)', color: '#457b9d', border: '1px solid rgba(69,123,157,0.3)', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, whiteSpace: 'nowrap' }}>
                                🚚 توصيل مجاني
                              </span>
                            )}
                            {o.has_gift && (
                              <span style={{ background: 'rgba(212,130,10,0.12)', color: '#d4820a', border: '1px solid rgba(212,130,10,0.3)', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, whiteSpace: 'nowrap' }}>
                                🎁 هدية
                              </span>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: '#ccc', fontSize: '13px' }}>—</span>
                        )}
                      </td>
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
                          <button disabled={isDeleting} onClick={() => deleteOrder(o.id)} style={{ padding: '6px 10px', background: '#fff0f0', color: '#e63946', border: '1px solid #e63946', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '12px', fontWeight: 700, cursor: isDeleting ? 'not-allowed' : 'pointer' }}>
                            {isDeleting ? '...' : '🗑️'}
                          </button>
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
