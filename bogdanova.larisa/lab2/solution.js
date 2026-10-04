export function generateParentheses(n) {
  const result = [];

  function build(current, open, close) {
    if (current.length === 2 * n) {
      result.push(current);
      return;
    }
    if (open < n) {
      build(`${current}(`, open + 1, close);
    }
    if (close < open) {
      build(`${current})`, open, close + 1);
    }
  }

  build('', 0, 0);
  return result;
}
