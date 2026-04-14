import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = forwardRef(StarRating);
export default function StarRating({ initialRating = 0, readonly = false, onRate }) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleClick = (value) => {
    if (readonly) return;
    setRating(value);
    onRate?.(value);
  };

  return (
    <div className="d-flex">
      {[1, 2, 3, 4, 5].map(star => (
        <FaStar
          key={star}
          size={24}
          style={{ cursor: readonly ? 'default' : 'pointer', marginRight: '4px' }}
          color={star <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        />
      ))}
    </div>
  );
}
StarRating.displayName = 'StarRating';
