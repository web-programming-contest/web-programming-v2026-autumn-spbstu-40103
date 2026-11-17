function Labels({labels}) {
  if (!labels || labels.length === 0) {
    return null;
  }
  return (
    <div className="labels">
      {labels.map((label) => (
        <span
          key={label}
          className={`label label--${label === 'Хит' ? 'hit' : 'new'}`}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

export default Labels;
