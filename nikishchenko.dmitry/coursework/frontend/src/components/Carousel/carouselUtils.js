// Логика закольцованной карусели без привязки к React.

// Какие `count` элементов видны, если первый видимый имеет индекс `start`.
// После последнего элемента снова идёт первый (закольцовано).
export function visibleItems(items, start, count) {
  if (items.length <= count) {
    return items;
  } // всё помещается, листать нечего
  return Array.from(
    {length: count},
    (_, i) => items[(start + i) % items.length],
  );
}

// Новый индекс старта после сдвига на delta (вперёд или назад) по кругу.
export function shiftIndex(start, delta, length) {
  if (length === 0) {
    return 0;
  }
  return (((start + delta) % length) + length) % length;
}
