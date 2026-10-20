import {SORT_OPTIONS} from '../utils/constants';
import './SortTabs.css';

export default function SortTabs({value, onChange}) {
  const handleClick = (opt) => {
    if (!opt.altValue) {
      onChange(opt.value);
      return;
    }
    onChange(value === opt.value ? opt.altValue : opt.value);
  };

  return (
    <div className="sort-tabs" role="tablist">
      {SORT_OPTIONS.map((opt) => {
        const active = value === opt.value || value === opt.altValue;
        const arrow =
          opt.altValue && active ? (value === opt.altValue ? ' ↑' : ' ↓') : '';
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            className={`sort-tabs__item ${active ? 'sort-tabs__item--active' : ''}`}
            onClick={() => handleClick(opt)}
          >
            <span>
              {opt.label}
              {arrow}
            </span>
          </button>
        );
      })}
    </div>
  );
}
