export function hexToRgb(hex) {
  hex = hex.trim().replace('#', '');

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((ch) => ch + ch)
      .join('');
  }

  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    return null;
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return `rgb(${r}, ${g}, ${b})`;
}
