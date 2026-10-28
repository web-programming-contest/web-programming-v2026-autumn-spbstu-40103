export function Checkbox({checked, onChange, children, ...rest}) {
  return (
    <label className="checkbox">
      <input type="checkbox" checked={checked} onChange={onChange} {...rest} />
      <span className="checkbox__box" />
      {children}
    </label>
  )
}

export function Radio({checked, onChange, children, ...rest}) {
  return (
    <label className="radio">
      <input type="radio" checked={checked} onChange={onChange} {...rest} />
      <span className="radio__box" />
      {children}
    </label>
  )
}
