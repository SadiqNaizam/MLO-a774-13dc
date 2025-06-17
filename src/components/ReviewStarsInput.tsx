import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface ReviewStarsInputProps {
  rating?: number; // Current rating (0-5)
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg'; // For icon size
  label?: string;
  className?: string;
  starClassName?: string;
}

const ReviewStarsInput: React.FC<ReviewStarsInputProps> = ({
  rating: initialRating = 0,
  maxRating = 5,
  onRatingChange,
  readOnly = false,
  size = 'md',
  label,
  className,
  starClassName,
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(initialRating);

  console.log("Rendering ReviewStarsInput, currentRating:", currentRating, "readOnly:", readOnly);

  const handleStarClick = (index: number) => {
    if (readOnly || !onRatingChange) return;
    const newRating = index + 1;
    setCurrentRating(newRating);
    onRatingChange(newRating);
    console.log("Star clicked, new rating:", newRating);
  };

  const handleStarHover = (index: number) => {
    if (readOnly) return;
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const starSizeClass = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }[size];

  return (
    <div className={cn("space-y-1", className)}>
      {label && <Label className={cn(readOnly ? "text-muted-foreground" : "")}>{label}</Label>}
      <div
        className={cn("flex items-center space-x-1", readOnly ? 'cursor-default' : 'cursor-pointer')}
        onMouseLeave={handleMouseLeave}
        aria-label={label || `Rating: ${currentRating} out of ${maxRating} stars`}
      >
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          const isActive = (hoverRating || currentRating) >= starValue;
          return (
            <Star
              key={index}
              className={cn(
                starSizeClass,
                isActive ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300',
                !readOnly && 'hover:text-yellow-400',
                starClassName
              )}
              onClick={() => handleStarClick(index)}
              onMouseEnter={() => handleStarHover(index)}
              aria-hidden="true" // Individual stars are decorative for screen readers
            />
          );
        })}
      </div>
      {/* Hidden input for form submission if needed, or rely on state */}
    </div>
  );
};
export default ReviewStarsInput;