export default function Rating({value}) {
  return (
    <span className="rating" title={`Рейтинг: ${value}`}>
      <svg
        className="rating-star"
        viewBox="0 0 16 16"
        width="14"
        height="14"
        aria-hidden="true"
      >
        <path
          fill="#FFEC41"
          stroke="#F5C518"
          strokeWidth="0.5"
          d="M8 1.1l1.85 3.9 4.15.55-3.05 2.9.8 4.1L8 10.55 4.25 12.55l.8-4.1L2 5.55l4.15-.55z"
        />
      </svg>
      <span className="rating-value">{value}</span>
    </span>
  );
}
