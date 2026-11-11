/**
 * Преобразует строку в аббревиатуру из первых букв слов.
 * Слова разбиваются по пробельным символам и по границам camelCase.
 *
 * @param {string} str - Входная строка.
 * @returns {string} Аббревиатура из заглавных первых букв слов.
 */
export function toAbbreviation(str) {
  const words = str.match(/[A-Z]?[a-z]+|[A-Z]+(?![a-z])/g) ?? [];
  return words.map((word) => word[0].toUpperCase()).join('');
}
