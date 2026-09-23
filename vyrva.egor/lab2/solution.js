function getPalindrome(str, left, right) {
  while (left >= 0 && right < str.length && str[left] === str[right]) {
    left--;
    right++;
  }

  return str.slice(left + 1, right);
}

export function findLongestPalindrome(str) {
  let result = '';

  for (let i = 0; i < str.length; i++) {
    const oddPalindrome = getPalindrome(str, i, i);
    const evenPalindrome = getPalindrome(str, i, i + 1);

    if (oddPalindrome.length > result.length) {
      result = oddPalindrome;
    }

    if (evenPalindrome.length > result.length) {
      result = evenPalindrome;
    }
  }

  return result;
}
