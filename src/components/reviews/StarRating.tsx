
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  onChange?: (rating: number) => void;
}

const StarRating = ({
  rating,
  maxRating = 5,
  size = 20,
  onChange,
}: StarRatingProps) => {
  const [hoveredRating, setHoveredRating] = React.useState(0);
  
  const isInteractive = !!onChange;
  
  return (
    <div className="flex items-center">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = isInteractive
          ? starValue <= (hoveredRating || rating)
          : starValue <= rating;

        return (
          <Star
            key={index}
            size={size}
            className={`${
              isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            } ${isInteractive ? 'cursor-pointer' : ''}`}
            onClick={() => {
              if (onChange) onChange(starValue);
            }}
            onMouseEnter={() => {
              if (isInteractive) setHoveredRating(starValue);
            }}
            onMouseLeave={() => {
              if (isInteractive) setHoveredRating(0);
            }}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
