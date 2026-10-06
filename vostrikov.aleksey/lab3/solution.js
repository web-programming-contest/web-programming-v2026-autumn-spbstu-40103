export function intersection(arr1, arr2) {
  const secondArrayValues = new Set(arr2);
  const result = new Set();

  for (const value of arr1) {
    if (secondArrayValues.has(value)) {
      result.add(value);
    }
  }

  return [...result];
}
