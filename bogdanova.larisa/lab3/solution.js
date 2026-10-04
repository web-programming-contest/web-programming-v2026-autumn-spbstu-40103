export function sortArrayByParity(arr) {
  const even = [];
  const odd = [];

  for (const num of arr) {
    if (num % 2 === 0) {
      even.push(num);
    } else {
      odd.push(num);
    }
  }

  even.sort((a, b) => a - b);
  odd.sort((a, b) => a - b);

  return [...even, ...odd];
}
