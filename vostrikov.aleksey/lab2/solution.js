export function isPerfectNumber(value) {
  if (value === 1) {
    return false;
  }

  let divisorsSum = 1;

  for (let divisor = 2; divisor <= Math.sqrt(value); divisor += 1) {
    if (value % divisor !== 0) {
      continue;
    }

    divisorsSum += divisor;

    const pairedDivisor = value / divisor;

    if (pairedDivisor !== divisor) {
      divisorsSum += pairedDivisor;
    }
  }

  return divisorsSum === value;
}
