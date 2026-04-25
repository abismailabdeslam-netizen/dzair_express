'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLayout from '@/components/admin/AdminLayout'
import Image from 'next/image'
import Link from 'next/link'

export default function ProductsAdminPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    else setProducts(data || [])
    setLoading(false)
  }

  return (
    <AdminLayout active="products">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 900 }}>المنتجات ({products.length})</h2>
        <Link href="/dashboard-x7k2m9/panel/products/new" style={{ textDecoration: 'none' }}>
          <button style={{
            background: '#e63946', color: 'white', padding: '12px 24px',
            border: 'none', borderRadius: '12px', fontFamily: 'Cairo, sans-serif',
            fontSize: '14px', fontWeight: 700, cursor: 'pointer'
          }}>+ إضافة منتج</button>
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>⏳ جاري التحميل...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '16px' }}>
          {products.map(p => {
            const disc = p.old_price ? Math.round((1 - p.price / p.old_price) * 100) : null
            return (
              <div key={p.id} style={{
                background: 'white', borderRadius: '16px', overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #e9ecef'
              }}>
                <div style={{
                  height: '160px', background: 'linear-gradient(135deg, #f0f0f0, #e0e0e0)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden'
                }}>
                  {p.images?.[0]
                    ? <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: 'cover' }} />
                    : <span style={{ fontSize: '56px' }}>🛍️</span>
                  }
                  {!p.is_active && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>مخفي</div>
                  )}
                </div>
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{p.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 900, color: '#e63946' }}>{p.price.toLocaleString('fr-DZ')} دج</span>
                    {disc && <span style={{ fontSize: '12px', background: 'rgba(230,57,70,0.1)', color: '#e63946', padding: '2px 8px', borderRadius: '50px', fontWeight: 700 }}>-{disc}%</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '14px' }}>
                    مباع: {p.sold} | متبقي: {p.stock - p.sold}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link href={`/dashboard-x7k2m9/panel/products/${p.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                      <button style={{
                        width: '100%', padding: '8px', border: '1px solid #e9ecef',
                        borderRadius: '8px', fontFamily: 'Cairo, sans-serif',
                        fontSize: '13px', fontWeight: 700, cursor: 'pointer', background: 'white'
                      }}>✏️ تعديل</button>
                    </Link>
                    <Link href={`/product/${p.id}`} target="_blank" style={{ flex: 1, textDecoration: 'none' }}>
                      <button style={{
                        width: '100%', padding: '8px', border: '1px solid #e9ecef',
                        borderRadius: '8px', fontFamily: 'Cairo, sans-serif',
                        fontSize: '13px', fontWeight: 700, cursor: 'pointer', background: 'white'
                      }}>👁️ معاينة</button>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </AdminLayout>
  )
}