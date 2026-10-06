export function findMaxSubarraySum(arr, n) {
  if (!Array.isArray(arr) || !Number.isInteger(n) || n <= 0 || n > arr.length) {
    return null;
  }

  let windowSum = 0;

  for (let i = 0; i < n; i += 1) {
    windowSum += arr[i];
  }

  let maxSum = windowSum;

  for (let i = n; i < arr.length; i += 1) {
    windowSum += arr[i] - arr[i - n];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}
