import {ChevronIcon} from './Icons';
import './Pagination.css';

function buildPages(current, total) {
  if (total <= 3) {
    return Array.from({length: total}, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, '...', total];
  }
  if (current >= total - 1) {
    return [1, '...', total - 2, total - 1, total];
  }
  return [1, '...', current - 1, current, current + 1, '...', total].filter(
    (p, i, a) => !(p === '...' && a[i - 1] === '...'),
  );
}

export default function Pagination({page, totalPages, onChange}) {
  if (totalPages <= 1) {
    return null;
  }
  const pages = buildPages(page, totalPages);

  return (
    <nav className="pagination" aria-label="Пагинация">
      {page > 1 && (
        <button
          type="button"
          className="pagination__item pagination__arrow"
          onClick={() => onChange(page - 1)}
          aria-label="Назад"
        >
          <ChevronIcon dir="left" width={9} height={16} />
        </button>
      )}
      {pages.map((p, i) =>
        p === '...' ? (
          <span className="pagination__ellipsis" key={`e${i}`}>
            ...
          </span>
        ) : (
          <button
            type="button"
            key={p}
            className={`pagination__item ${p === page ? 'pagination__item--active' : ''}`}
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ),
      )}
      {page < totalPages && (
        <button
          type="button"
          className="pagination__item pagination__arrow"
          onClick={() => onChange(page + 1)}
          aria-label="Вперёд"
        >
          <ChevronIcon dir="right" width={9} height={16} />
        </button>
      )}
    </nav>
  );
}
