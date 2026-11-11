/**
 * Находит максимумы во всех подмассивах (окнах) длины k.
 *
 * Используется монотонный дек индексов: убывающий по значениям,
 * поэтому максимум окна всегда находится в его начале. Каждый
 * индекс добавляется и удаляется из дека не более одного раза,
 * что даёт линейную сложность.
 *
 * @param {number[]} arr - Входной массив, не изменяется.
 * @param {number} k - Размер окна.
 * @returns {number[]} Максимум каждого окна слева направо.
 */
export function maxSlidingWindow(arr, k) {
  if (!Array.isArray(arr) || !Number.isInteger(k) || k < 1 || k > arr.length) {
    return [];
  }

  const maxima = [];
  const deque = [];
  let head = 0;

  for (let index = 0; index < arr.length; index += 1) {
    while (deque.length > head && arr[deque[deque.length - 1]] <= arr[index]) {
      deque.pop();
    }
    deque.push(index);

    if (deque[head] <= index - k) {
      head += 1;
    }

    if (index >= k - 1) {
      maxima.push(arr[deque[head]]);
    }
  }

  return maxima;
}
