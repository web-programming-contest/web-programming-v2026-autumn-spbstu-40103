import {useState, useRef, useEffect} from 'react';

const options = [
  {value: '', label: 'Не выбрано'},
  {value: 'cash', label: 'Наличные'},
  {value: 'card', label: 'Банковская карта'},
];

function SelectItem({
  label,
  name,
  isError,
}: {
  label: string;
  name: string;
  isError: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="select-group">
      <label htmlFor={`select-${name}`}>{label}</label>
      <div className={`select-wrapper ${isOpen ? 'active' : ''}`} ref={ref}>
        <div
          className="select-trigger"
          onClick={() => setIsOpen((prev) => !prev)}
          style={
            isError === 'empty-payment' ? {outline: '1px #FF60C3 solid'} : {}
          }
        >
          <span className={selected.value === '' ? 'placeholder' : ''}>
            {selected.label}
          </span>
          <svg className={'arrow'} width="12" height="8" viewBox="0 0 12 8">
            <path
              d="M1 1l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {isOpen && (
          <div className="select-dropdown">
            {options.map((opt) => (
              <div
                key={opt.value}
                className={`select-option ${selected.value === opt.value ? 'selected' : ''}`}
                onClick={() => {
                  setSelected(opt);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}

        <input
          readOnly
          name={name}
          id={`select-${name}`}
          value={selected.value}
          style={{
            position: 'absolute',
            width: 0,
            height: 0,
            opacity: 0,
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}

export default SelectItem;
