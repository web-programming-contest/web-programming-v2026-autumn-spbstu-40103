export default function QuantityStepper({qty, onChange, small = false}) {
  return (
    <span className={`stepper${small ? ' stepper-small' : ''}`}>
      <button
        type="button"
        className="stepper-btn"
        aria-label="Уменьшить количество"
        onClick={(e) => {
          e.stopPropagation();
          onChange(qty - 1);
        }}
      >
        −
      </button>
      <span className="stepper-value">{qty}</span>
      <button
        type="button"
        className="stepper-btn"
        aria-label="Увеличить количество"
        onClick={(e) => {
          e.stopPropagation();
          onChange(qty + 1);
        }}
      >
        +
      </button>
    </span>
  );
}
