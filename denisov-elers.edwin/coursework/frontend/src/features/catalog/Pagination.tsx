import {getVisiblePages} from './catalog';

export function Pagination({
  page,
  pages,
  onChange,
}: {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}) {
  if (pages <= 1) {
    return null;
  }
  const visiblePages = getVisiblePages(page, pages);

  return (
    <nav className="pagination" aria-label="Страницы каталога">
      {visiblePages.map((value, index) => (
        <span key={value}>
          {index > 0 &&
            (value - visiblePages[index - 1] > 1 ||
              (pages > 3 && value === pages && page <= 3)) && (
              <span className="ellipsis">…</span>
            )}
          <button
            aria-label={`Страница ${value}`}
            aria-current={page === value ? 'page' : undefined}
            onClick={() => onChange(value)}
          >
            {value}
          </button>
        </span>
      ))}
      <button
        aria-label="Следующая страница"
        disabled={page === pages}
        onClick={() => onChange(page + 1)}
      >
        ›
      </button>
    </nav>
  );
}
