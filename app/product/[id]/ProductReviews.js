'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import StarRating from '@/components/StarRating'
import ReviewForm from '@/components/ReviewForm'

export default function ProductReviews({ productId, initialReviews, averageRating }) {
  const [reviews, setReviews] = useState(initialReviews)
  const [avgRating, setAvgRating] = useState(averageRating)

  const loadReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
    if (data) {
      setReviews(data)
      const avg = data.length ? (data.reduce((sum, r) => sum + r.rating, 0) / data.length).toFixed(1) : 0
      setAvgRating(avg)
    }
  }

  return (
    <div style={{ marginTop: '40px', gridColumn: '1 / -1' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 900 }}>تقييمات العملاء</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StarRating rating={parseFloat(avgRating)} readOnly />
          <span style={{ fontWeight: 700 }}>{avgRating}</span>
          <span style={{ color: '#6c757d' }}>({reviews.length} تقييم)</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '32px', background: '#f8f9fa', borderRadius: '16px', color: '#6c757d' }}>
          لا توجد تقييمات بعد، كن أول من يقيم هذا المنتج!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          {reviews.map(rev => (
            <div key={rev.id} style={{ border: '1px solid #e9ecef', borderRadius: '16px', padding: '20px', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <p style={{ fontWeight: 700, marginBottom: '4px' }}>{rev.user_name}</p>
                  <StarRating rating={rev.rating} readOnly />
                </div>
                <span style={{ fontSize: '12px', color: '#6c757d' }}>
                  {new Date(rev.created_at).toLocaleDateString('fr-DZ')}
                </span>
              </div>
              <p style={{ color: '#333', lineHeight: 1.6 }}>{rev.comment}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ borderTop: '2px solid #e9ecef', paddingTop: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '16px' }}>أضف تقييمك</h3>
        <ReviewForm productId={productId} onReviewSubmitted={loadReviews} />
      </div>
    </div>
  )
}