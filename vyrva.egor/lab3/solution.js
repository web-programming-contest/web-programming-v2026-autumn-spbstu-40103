export function difference(arr1, arr2) {
  const valuesFromSecondArray = new Set(arr2);

  return arr1.filter((item) => !valuesFromSecondArray.has(item));
}
