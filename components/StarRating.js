'use client';
import { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, totalStars = 5, onRatingChange = null }) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-1">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = (hoverRating || rating) >= starValue;
        return (
          <Star
            key={index}
            size={20}
            className={`cursor-pointer transition-colors ${isFilled ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`}
            onMouseEnter={() => onRatingChange && setHoverRating(starValue)}
            onMouseLeave={() => onRatingChange && setHoverRating(0)}
            onClick={() => onRatingChange?.(starValue)}
          />
        );
      })}
    </div>
  );
}