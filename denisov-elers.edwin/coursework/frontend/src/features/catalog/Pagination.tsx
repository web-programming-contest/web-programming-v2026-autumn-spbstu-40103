import {getPageNumbers} from './catalog';

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
  const pageNumbers = getPageNumbers(pages);

  return (
    <nav className="pagination" aria-label="Страницы каталога">
      {pageNumbers.map((value) => (
        <button
          key={value}
          aria-label={`Страница ${value}`}
          aria-current={page === value ? 'page' : undefined}
          onClick={() => onChange(value)}
        >
          {value}
        </button>
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
