const UNITS = [
  {limit: 60, divisor: 1, forms: ['секунда', 'секунды', 'секунд']},
  {limit: 3600, divisor: 60, forms: ['минута', 'минуты', 'минут']},
  {limit: 86400, divisor: 3600, forms: ['час', 'часа', 'часов']},
  {limit: Infinity, divisor: 86400, forms: ['день', 'дня', 'дней']},
];

function pluralize(value, [one, few, many]) {
  const mod10 = value % 10;
  const mod100 = value % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return one;
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return few;
  }
  return many;
}

export function timeAgo(date, now = new Date()) {
  const diffSeconds = Math.max(
    0,
    Math.floor((now.getTime() - date.getTime()) / 1000),
  );
  const unit = UNITS.find(({limit}) => diffSeconds < limit);
  const value = Math.floor(diffSeconds / unit.divisor);

  return `${value} ${pluralize(value, unit.forms)} назад`;
}
