export function reverseWords(str) {
  return String(str).replace(/\S+/gu, (word) =>
    Array.from(word).reverse().join(''),
  );
}
