import {useEffect} from 'react';

const SUFFIX = 'Gadget Hub';

// Заголовок вкладки браузера: «Каталог — Gadget Hub». Без аргумента ставит заголовок главной.
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} — ${SUFFIX}`
      : `${SUFFIX} — магазин надежных гаджетов`;
  }, [title]);
}
