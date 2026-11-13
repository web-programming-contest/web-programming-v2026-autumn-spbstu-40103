export function moveZerosToEnd(items) {
  const nonZeros = [];
  let zeroCount = 0;

  for (const item of items) {
    if (item === 0) {
      zeroCount += 1;
    } else {
      nonZeros.push(item);
    }
  }

  return [...nonZeros, ...Array(zeroCount).fill(0)];
}
