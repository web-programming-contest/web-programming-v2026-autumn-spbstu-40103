// Выборки для главной страницы: самые популярные хиты и новинки по популярности
export function pickHits(goods) {
  return goods
    .filter((g) => g.isHit)
    .sort((a, b) => b.popularity - a.popularity);
}

export function pickNew(goods) {
  return goods
    .filter((g) => g.isNew)
    .sort((a, b) => b.popularity - a.popularity);
}
