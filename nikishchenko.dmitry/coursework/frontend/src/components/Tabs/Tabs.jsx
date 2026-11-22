import styles from './Tabs.module.css';

export default function Tabs({tabs, value, onChange, label, idPrefix = 'tab'}) {
  function handleKeyDown(e, index) {
    const last = tabs.length - 1;
    const next = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[e.key];
    if (next === undefined) {
      return;
    }
    e.preventDefault();
    onChange(tabs[next].id);
    document.getElementById(`${idPrefix}-${tabs[next].id}`)?.focus();
  }

  return (
    <div className={styles.tabs} role="tablist" aria-label={label}>
      {tabs.map((tab, i) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            id={`${idPrefix}-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`${idPrefix}-panel-${tab.id}`}
            tabIndex={active ? 0 : -1}
            className={`${styles.tab} ${active ? styles.active : ''}`}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
