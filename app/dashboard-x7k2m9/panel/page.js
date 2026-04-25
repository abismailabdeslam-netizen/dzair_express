'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'

export default function PanelPage() {
  const [stats, setStats] = useState({ total: 0, pending: 0, products: 0, revenue: 0, avgRating: 0, totalReviews: 0, reviewedProducts: 0 })
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      // جلب الطلبات
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, status, total_price, created_at, first_name, last_name, phone, wilaya, product_name, quantity')
        .order('created_at', { ascending: false })
        .limit(10)

      // جلب المنتجات النشطة
      const { count: productsCount } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true)

      // جلب إحصائيات التقييمات
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('rating, product_id')

      let totalRating = 0
      const uniqueProducts = new Set()
      reviewsData?.forEach(r => {
        totalRating += r.rating
        uniqueProducts.add(r.product_id)
      })
      const avgRating = reviewsData?.length ? (totalRating / reviewsData.length).toFixed(1) : 0
      const totalReviews = reviewsData?.length || 0
      const reviewedProducts = uniqueProducts.size

      // حساب الإحصائيات
      const allOrders = ordersData || []
      const totalOrders = allOrders.length
      const pendingOrders = allOrders.filter(o => o.status === 'pending').length
      const confirmedRevenue = allOrders
        .filter(o => o.status === 'confirmed')
        .reduce((sum, o) => sum + (o.total_price || 0), 0)

      setStats({
        total: totalOrders,
        pending: pendingOrders,
        products: productsCount || 0,
        revenue: confirmedRevenue,
        avgRating: avgRating,
        totalReviews: totalReviews,
        reviewedProducts: reviewedProducts
      })
      setOrders(allOrders)
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchData())
      .subscribe()
    const reviewsChannel = supabase
      .channel('reviews-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => fetchData())
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
      supabase.removeChannel(reviewsChannel)
    }
  }, [])

  if (loading && stats.total === 0) {
    return (
      <AdminLayout active="overview">
        <div style={{ textAlign: 'center', padding: '40px' }}>⏳ جاري تحميل الإحصائيات...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout active="overview">
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { icon: '📦', num: stats.total, label: 'إجمالي الطلبات', trend: '+جديد' },
          { icon: '⏳', num: stats.pending, label: 'طلبات بانتظار', trend: 'تحتاج اتصال' },
          { icon: '💰', num: `${stats.revenue.toLocaleString('fr-DZ')} دج`, label: 'إيرادات مؤكدة', trend: '↑' },
          { icon: '🛍️', num: stats.products, label: 'منتجات نشطة', trend: 'مفعلة' },
          { icon: '⭐', num: stats.avgRating, label: 'متوسط التقييمات', trend: `من ${stats.totalReviews} رأي` },
          { icon: '📝', num: stats.reviewedProducts, label: 'منتجات مقيمة', trend: 'منتج' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'white', borderRadius: '16px', padding: '20px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #e9ecef'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>{s.icon}</div>
            <div style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 900 }}>{s.num}</div>
            <div style={{ fontSize: '13px', color: '#6c757d', marginTop: '4px' }}>{s.label}</div>
            <div style={{ fontSize: '12px', color: '#2a9d8f', fontWeight: 700, marginTop: '8px' }}>{s.trend}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '16px' }}>آخر الطلبات</h2>
      <OrdersTable orders={orders} />
    </AdminLayout>
  )
}

function OrdersTable({ orders }) {
  const statusMap = {
    pending: ['⏳ انتظار', '#e07b39', 'rgba(244,162,97,0.15)'],
    confirmed: ['✅ مؤكد', '#2a9d8f', 'rgba(42,157,143,0.15)'],
    shipped: ['🚚 مشحون', '#457b9d', 'rgba(69,123,157,0.15)'],
    cancelled: ['❌ ملغي', '#e63946', 'rgba(230,57,70,0.1)']
  }

  return (
    <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
        <thead>
          <tr style={{ background: '#f8f9fa' }}>
            {['الاسم', 'الهاتف', 'الولاية', 'المنتج', 'الكمية', 'الإجمالي', 'الحالة', 'التاريخ'].map(h => (
              <th key={h} style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px', fontWeight: 700, color: '#6c757d', borderBottom: '1px solid #e9ecef' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>لا توجد طلبات بعد</td></tr>
          ) : orders.map(o => {
            const [label, color, bg] = statusMap[o.status] || statusMap.pending
            return (
              <tr key={o.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 600 }}>{o.first_name} {o.last_name}</td>
                <td style={{ padding: '14px 16px', fontSize: '14px', direction: 'ltr' }}>{o.phone}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px' }}>{o.wilaya}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px' }}>{o.product_name}</td>
                <td style={{ padding: '14px 16px', fontSize: '14px', textAlign: 'center' }}>{o.quantity}</td>
                <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 700 }}>{o.total_price?.toLocaleString('fr-DZ')} دج</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: 700, background: bg, color }}>{label}</span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '12px', color: '#6c757d' }}>
                  {new Date(o.created_at).toLocaleDateString('fr-DZ')}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}