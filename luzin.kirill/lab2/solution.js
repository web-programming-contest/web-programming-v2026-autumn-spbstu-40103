export function isIsogram(str) {
  if (!str) {
    return true;
  }

  const lowerStr = String(str).toLowerCase();
  const set = new Set();

  for (const char of lowerStr) {
    if (char === '-' || char === ' ') {
      continue;
    }

    if (set.has(char)) {
      return false;
    }
    set.add(char);
  }

  return true;
}
