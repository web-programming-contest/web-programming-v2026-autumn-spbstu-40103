import {ChevronIcon} from '../../icons';
import {GAP, getPageItems} from '../../catalog/catalogLogic';
import styles from './Pagination.module.css';

export default function Pagination({page, totalPages, onChange}) {
  if (totalPages <= 1) {
    return null;
  }
  return (
    <nav className={styles.nav} aria-label="Страницы каталога">
      <div className={styles.pages}>
        {page > 1 && (
          <button
            type="button"
            className={`${styles.item} ${styles.prev}`}
            aria-label="Предыдущая страница"
            onClick={() => onChange(page - 1)}
          >
            <ChevronIcon direction="left" width="8" height="14" />
          </button>
        )}
        {getPageItems(page, totalPages).map((item, i) =>
          item === GAP ? (
            <span key={`gap-${i}`} className={styles.gap} aria-hidden="true">
              {GAP}
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`${styles.item} ${item === page ? styles.current : ''}`}
              aria-label={`Страница ${item}`}
              aria-current={item === page ? 'page' : undefined}
              onClick={() => onChange(item)}
            >
              {item}
            </button>
          ),
        )}
        {page < totalPages && (
          <button
            type="button"
            className={`${styles.item} ${styles.next}`}
            aria-label="Следующая страница"
            onClick={() => onChange(page + 1)}
          >
            <ChevronIcon direction="right" width="8" height="14" />
          </button>
        )}
      </div>
    </nav>
  );
}
