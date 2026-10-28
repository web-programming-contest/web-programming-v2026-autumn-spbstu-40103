export function maxSlidingWindow(arr, k) {
  if (k <= 0 || k > arr.length) {
    return [];
  }

  const result = [];
  const queue = [];

  for (let i = 0; i < arr.length; i++) {
    while (queue.length > 0 && arr[queue[queue.length - 1]] <= arr[i]) {
      queue.pop();
    }

    queue.push(i);

    if (queue[0] <= i - k) {
      queue.shift();
    }

    if (i >= k - 1) {
      result.push(arr[queue[0]]);
    }
  }

  return result;
}
