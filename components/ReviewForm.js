'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import StarRating from './StarRating';

export default function ReviewForm({ productId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim() || !userName.trim()) return;
    setLoading(true);
    const { error } = await supabase.from('reviews').insert([
      { product_id: productId, rating, comment, user_name: userName }
    ]);
    setLoading(false);
    if (!error) {
      setSubmitted(true);
      setRating(0); setComment(''); setUserName('');
      if (onReviewSubmitted) onReviewSubmitted();
    } else alert('حدث خطأ، حاول مرة أخرى');
  };

  if (submitted) return <div className="p-4 bg-green-100 text-green-700 rounded-lg">✅ تم إرسال تقييمك، شكراً لك!</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <div>
        <label className="block font-medium mb-1">اسمك</label>
        <input type="text" className="w-full border rounded-md p-2" value={userName} onChange={(e) => setUserName(e.target.value)} required />
      </div>
      <div>
        <label className="block font-medium mb-1">تقييمك</label>
        <StarRating rating={rating} onRatingChange={setRating} />
      </div>
      <div>
        <label className="block font-medium mb-1">تعليقك</label>
        <textarea className="w-full border rounded-md p-2" rows="3" value={comment} onChange={(e) => setComment(e.target.value)} required />
      </div>
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
        {loading ? 'جاري الإرسال...' : 'إرسال التقييم'}
      </button>
    </form>
  );
}