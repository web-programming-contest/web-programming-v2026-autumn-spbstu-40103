interface CatalogSortingProps {
  sort: string;
  direction: string;
  onSort: (value: string) => void;
  onDirection: (value: string) => void;
}

export function CatalogSorting(props: CatalogSortingProps) {
  return (
    <div className="sorting">
      <label>
        Сортировка{' '}
        <select
          aria-label="Сортировка"
          value={props.sort}
          onChange={(event) => props.onSort(event.target.value)}
        >
          <option value="createdAt">Новизна</option>
          <option value="popularity">Популярность</option>
          <option value="price">Цена</option>
        </select>
      </label>
      <select
        aria-label="Порядок сортировки"
        value={props.direction}
        onChange={(event) => props.onDirection(event.target.value)}
      >
        <option value="desc">По убыванию</option>
        <option value="asc">По возрастанию</option>
      </select>
    </div>
  );
}
