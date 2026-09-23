import {useEffect, useState} from 'react';

type RatingProps = {
  maxStars?: number;
  ratingSum: number;
  ratingCount: number;
  onRate: (rating: number) => void;
};

export function Rating({
  maxStars = 5,
  ratingSum,
  ratingCount,
  onRate,
}: RatingProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const averageRating = ratingCount === 0 ? 0 : ratingSum / ratingCount;

  useEffect(() => {
    if (selectedRating === null) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSelectedRating(null);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [selectedRating]);

  const handleRate = (rating: number) => {
    setSelectedRating(rating);
    onRate(rating);
  };

  const displayedRating =
    null === selectedRating ? averageRating : selectedRating;

  return (
    <div className="rating">
      <div className="rating-stars">
        {Array.from({length: maxStars}, (_, index) => {
          const starValue = index + 1;

          return (
            <button
              key={starValue}
              type="button"
              className="rating-star"
              data-testid="rating-star"
              onClick={() => handleRate(starValue)}
            >
              ⚝
            </button>
          );
        })}
      </div>
      <span className="rating-value" data-testid="rating-value">
        {displayedRating.toFixed(1)}
      </span>
      <span className="rating-count">{ratingCount} оценок</span>
    </div>
  );
}
