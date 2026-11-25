const SORTS = [
  {id: 'new', title: 'Новые'},
  {id: 'popular', title: 'Популярные'},
  {id: 'cheap', title: 'Подешевле'},
  {id: 'expensive', title: 'Подороже'},
];

export default function SortTabs({value, onChange}) {
  return (
    <div className="sort-tabs">
      {SORTS.map((sort) => (
        <button
          type="button"
          key={sort.id}
          className={`sort-tabs-tab${value === sort.id ? ' sort-tabs-tab-active' : ''}`}
          onClick={() => onChange(sort.id)}
        >
          {sort.title}
        </button>
      ))}
    </div>
  );
}
