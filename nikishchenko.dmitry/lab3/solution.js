export function countOccurrences(arr) {
  const result = {};

  for (const item of arr) {
    result[item] = (result[item] || 0) + 1;
  }

  return result;
}
