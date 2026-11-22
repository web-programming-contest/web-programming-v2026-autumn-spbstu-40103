export function buildCartRows(goods, items) {
  return goods
    .filter((g) => items[g.id] > 0)
    .map((good) => ({
      good,
      qty: items[good.id],
      sum: good.price * items[good.id],
    }));
}

export function selectedRows(rows, deselected) {
  return rows.filter((r) => !deselected.has(r.good.id));
}

export function totals(rows) {
  return rows.reduce(
    (acc, r) => ({count: acc.count + r.qty, sum: acc.sum + r.sum}),
    {count: 0, sum: 0},
  );
}

export function buildOrderPayload(values, rows) {
  return {
    items: rows.map((r) => ({goodId: r.good.id, qty: r.qty})),
    email: values.email.trim(),
    phone: values.phone.trim() || null,
    delivery: values.delivery,
    address: values.delivery === 'delivery' ? values.address.trim() : null,
    payment: values.payment,
    packaging: values.packaging,
  };
}
