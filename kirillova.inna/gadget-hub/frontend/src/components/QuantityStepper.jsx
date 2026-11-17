function QuantityStepper({quantity, onIncrement, onDecrement, size = 'md'}) {
  return (
    <div className={`stepper stepper--${size}`}>
      <button
        type="button"
        className="stepper__button"
        onClick={onDecrement}
        aria-label="Уменьшить количество"
      >
        −
      </button>
      <span className="stepper__value">{quantity}</span>
      <button
        type="button"
        className="stepper__button"
        onClick={onIncrement}
        aria-label="Увеличить количество"
      >
        +
      </button>
    </div>
  );
}

export default QuantityStepper;
