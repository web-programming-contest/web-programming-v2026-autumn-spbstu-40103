function buildPages(page, pages) {
  if (pages <= 3) {
    return Array.from({length: pages}, (_, i) => i + 1);
  }
  if (page <= 3) {
    return [1, 2, 3, '…', pages];
  }
  if (page >= pages - 1) {
    return [1, '…', pages - 2, pages - 1, pages];
  }
  return [1, '…', page, '…', pages];
}

export default function Pagination({page, pages, onChange}) {
  if (pages <= 1) {
    return null;
  }
  const items = buildPages(page, pages);
  return (
    <nav className="pagination" aria-label="Страницы каталога">
      <button
        type="button"
        className="pagination-arrow"
        disabled={page === 1}
        aria-label="Предыдущая страница"
        onClick={() => onChange(page - 1)}
      >
        ‹
      </button>
      {items.map((item, index) =>
        item === '…' ? (
          <span className="pagination-ellipsis" key={`e${index}`}>
            …
          </span>
        ) : (
          <button
            type="button"
            key={item}
            className={`pagination-page${item === page ? ' pagination-page-active' : ''}`}
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        className="pagination-arrow"
        disabled={page === pages}
        aria-label="Следующая страница"
        onClick={() => onChange(page + 1)}
      >
        ›
      </button>
    </nav>
  );
}
