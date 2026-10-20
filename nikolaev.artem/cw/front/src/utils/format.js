export function formatPrice(value) {
  if (value === null || value === undefined) {
    return ''
  }
  return String(value)
}

export function formatDate(isoString) {
  if (!isoString) {
    return ''
  }
  const d = new Date(isoString)
  if (Number.isNaN(d.getTime())) {
    return ''
  }
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}.${mm}.${yyyy}`
}

export function pluralize(count, [one, few, many]) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) {
    return one
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return few
  }
  return many
}
