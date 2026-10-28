const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value) {
  return EMAIL_RE.test(value.trim())
}

export function formatPhoneInput(rawValue, previousValue = '') {
  let digits = rawValue.replace(/\D/g, '')

  if (digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`
  }
  if (!digits.startsWith('7') && digits.length > 0) {
    digits = `7${digits}`
  }

  if (rawValue.length < previousValue.length && digits.length === previousValue.replace(/\D/g, '').length) {
    digits = digits.slice(0, -1)
  }

  digits = digits.slice(0, 11)

  if (digits.length === 0) {
    return ''
  }

  let result = '+7'
  const rest = digits.slice(1)
  if (rest.length > 0) {
    result += ` (${rest.slice(0, 3)}`
  }
  if (rest.length >= 3) {
    result += ')'
  }
  if (rest.length > 3) {
    result += ` ${rest.slice(3, 6)}`
  }
  if (rest.length > 6) {
    result += `-${rest.slice(6, 8)}`
  }
  if (rest.length > 8) {
    result += `-${rest.slice(8, 10)}`
  }

  return result
}

export function isCompletePhone(value) {
  return value.replace(/\D/g, '').length === 11
}
