
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import StarRating from './StarRating';

interface ReviewCardProps {
  reviewer: string;
  date: Date;
  rating: number;
  comment: string;
}

const ReviewCard = ({ reviewer, date, rating, comment }: ReviewCardProps) => {
  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="font-medium">{reviewer}</h4>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(date, { addSuffix: true })}
          </p>
        </div>
        <StarRating rating={rating} size={16} />
      </div>
      <p className="text-sm">{comment}</p>
    </div>
  );
};

export default ReviewCard;
