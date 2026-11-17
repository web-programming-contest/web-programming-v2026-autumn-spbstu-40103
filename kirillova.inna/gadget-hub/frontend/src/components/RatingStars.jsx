function RatingStars({rating}) {
  if (!rating) {
    return null;
  }
  return (
    <span className="rating">
      <svg
        className="rating__star"
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M8 0L9.79611 5.52786H15.6085L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786H6.20389L8 0Z"
          fill="#FFC531"
        />
      </svg>
      {rating}
    </span>
  );
}

export default RatingStars;
