'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [selected, setSelected] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchReviews() }, [])

  const fetchReviews = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
    setReviews(data || [])
    setLoading(false)
  }

  const deleteReview = async (id) => {
    setDeleting(id)
    await supabase.from('reviews').delete().eq('id', id)
    setReviews(prev => prev.filter(r => r.id !== id))
    setSelected(prev => prev.filter(s => s !== id))
    setDeleting(null)
  }

  const deleteSelected = async () => {
    if (!selected.length) return
    if (!confirm(`هل تريد حذف ${selected.length} تقييم؟`)) return
    for (const id of selected) {
      await supabase.from('reviews').delete().eq('id', id)
    }
    setReviews(prev => prev.filter(r => !selected.includes(r.id)))
    setSelected([])
  }

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([])
    else setSelected(filtered.map(r => r.id))
  }

  const filtered = filter === 'all' ? reviews : reviews.filter(r => r.rating === parseInt(filter))

  const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating)

  return (
    <AdminLayout active="reviews">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '4px' }}>⭐ إدارة التقييمات</h1>
          <p style={{ fontSize: '13px', color: '#6c757d' }}>{reviews.length} تقييم إجمالاً</p>
        </div>
        {selected.length > 0 && (
          <button onClick={deleteSelected} style={{
            padding: '10px 20px', background: '#e63946', color: 'white',
            border: 'none', borderRadius: '10px', fontFamily: 'Cairo, sans-serif',
            fontSize: '14px', fontWeight: 700, cursor: 'pointer'
          }}>
            🗑️ حذف المحدد ({selected.length})
          </button>
        )}
      </div>

      {/* Filter by stars */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['all', '5', '4', '3', '2', '1'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 16px', borderRadius: '50px', border: `2px solid ${filter === f ? '#e63946' : '#e9ecef'}`,
            background: filter === f ? '#e63946' : 'white', color: filter === f ? 'white' : '#1a1a2e',
            fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer'
          }}>
            {f === 'all' ? 'الكل' : `${'★'.repeat(parseInt(f))} (${reviews.filter(r => r.rating === parseInt(f)).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6c757d' }}>⏳ جاري التحميل...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6c757d' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>⭐</div>
          لا توجد تقييمات
        </div>
      ) : (
        <>
          {/* Select All */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', padding: '10px 16px', background: 'white', borderRadius: '12px', border: '1px solid #e9ecef' }}>
            <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0}
              onChange={toggleAll} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
            <label style={{ fontSize: '13px', fontWeight: 600, cursor: 'pointer' }} onClick={toggleAll}>
              تحديد الكل ({filtered.length})
            </label>
          </div>

          {filtered.map(rev => (
            <div key={rev.id} style={{
              background: 'white', borderRadius: '16px', padding: '18px 20px', marginBottom: '12px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `2px solid ${selected.includes(rev.id) ? '#e63946' : '#e9ecef'}`,
              transition: 'border-color 0.2s'
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <input type="checkbox" checked={selected.includes(rev.id)} onChange={() => toggleSelect(rev.id)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer', marginTop: '4px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '15px' }}>{rev.user_name}</div>
                      <div style={{ color: '#f4a261', fontSize: '16px', letterSpacing: '2px' }}>{renderStars(rev.rating)}</div>
                      <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '2px' }}>
                        {new Date(rev.created_at).toLocaleDateString('fr-DZ')} — منتج: {rev.product_id?.slice(0, 8)}...
                      </div>
                    </div>
                    <button onClick={() => deleteReview(rev.id)} disabled={deleting === rev.id} style={{
                      padding: '8px 16px', background: '#fff0f0', color: '#e63946',
                      border: '2px solid #e63946', borderRadius: '10px', fontFamily: 'Cairo, sans-serif',
                      fontSize: '13px', fontWeight: 700, cursor: deleting === rev.id ? 'not-allowed' : 'pointer',
                      flexShrink: 0
                    }}>
                      {deleting === rev.id ? '...' : '🗑️ حذف'}
                    </button>
                  </div>
                  <p style={{ color: '#333', lineHeight: 1.6, fontSize: '14px', margin: 0 }}>{rev.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </AdminLayout>
  )
}
