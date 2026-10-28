function CheckBox({
  title,
  name,
  checked,
  onChange,
}: {
  title: string;
  name?: string;
  checked?: boolean;
  onChange?: () => void;
}) {
  return (
    <label className="check-item" tabIndex={0}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <div className="checkmark" />
      <p>{title}</p>
    </label>
  );
}

export default CheckBox;
