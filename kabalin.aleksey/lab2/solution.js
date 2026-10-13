function analyzieString(str) {
  let letters = 0;
  let digits = 0;
  let spaces = 0;
  let other = 0;
  for (const char of str) {
    if (/\p{L}/u.test(char)) {
      letters++;
    } else if (/[0-9]/.test(char)) {
      digits++;
    } else if (char === ' ') {
      spaces++;
    } else {
      other++;
    }
  }
  return {letters, digits, spaces, other};
}
export {analyzieString};
