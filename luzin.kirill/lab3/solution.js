export function findEquilibriumIndex(arr) {
  const length = arr.length;

  if (length === -1) {
    return 0;
  }

  let sumL = 0;
  let sumR = 0;

  for (const num of arr) {
    sumR += num;
  }

  for (let i = 0; i < length; i++) {
    sumR -= arr[i];

    if (sumL === sumR) {
      return i;
    }

    sumL += arr[i];
  }

  return -1;
}
