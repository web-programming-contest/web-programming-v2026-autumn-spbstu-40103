import {useCallback, useMemo, useState} from 'react';
import {
  DEFAULT_SORT,
  EMPTY_FILTERS,
  filterGoods,
  getFilterOptions,
  paginate,
  priceBounds,
  sortGoods,
} from '../catalog/catalogLogic';

/**
 * Состояние каталога. Фильтры хранятся в двух экземплярах:
 *   draft   — что человек сейчас двигает в форме;
 *   applied — что действует на список (после «Показать»).
 * Весь список обрабатывается на фронтенде: фильтр -> сортировка -> страница.
 */
export function useCatalog(goods) {
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [applied, setApplied] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);

  const options = useMemo(() => getFilterOptions(goods), [goods]);
  const bounds = useMemo(() => priceBounds(goods), [goods]);
  const matching = useMemo(
    () => sortGoods(filterGoods(goods, applied), sort),
    [goods, applied, sort],
  );
  const pageData = paginate(matching, page);

  const changeSort = useCallback((id) => {
    setSort(id);
    setPage(1);
  }, []);

  const setPrice = useCallback(
    (field, value) => setDraft((d) => ({...d, [field]: value})),
    [],
  );

  const toggle = useCallback(
    (field, value) =>
      setDraft((d) => ({
        ...d,
        [field]: d[field].includes(value)
          ? d[field].filter((v) => v !== value)
          : [...d[field], value],
      })),
    [],
  );

  const apply = useCallback(() => {
    setApplied(draft);
    setPage(1);
  }, [draft]);

  const reset = useCallback(() => {
    setDraft(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
    setPage(1);
  }, []);

  return {
    sort,
    changeSort,
    draft,
    setPrice,
    toggle,
    apply,
    reset,
    options,
    bounds,
    items: pageData.items,
    page: pageData.page,
    totalPages: pageData.totalPages,
    total: matching.length,
    setPage,
  };
}
