export function findEquilibriumIndex(arr) {
  const length = arr.length;

  if (length < 3) {
    return -1;
  }

  let sumL = 0;
  let sumR = -arr[0];

  for (const num of arr) {
    sumR += num;
  }

  for (let i = 1; i < length; i++) {
    sumL += arr[i - 1];
    sumR -= arr[i];

    if (sumL === sumR) {
      return i;
    }
  }

  return -1;
}
