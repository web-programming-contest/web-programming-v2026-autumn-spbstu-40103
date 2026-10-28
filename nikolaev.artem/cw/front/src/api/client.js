const BASE_URL = '/api'

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.message || body?.error || 'Ошибка запроса')
    this.status = status
    this.body = body
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  let body = null
  const text = await res.text()
  if (text) {
    try {
      body = JSON.parse(text)
    } catch {
      body = null
    }
  }

  if (!res.ok) {
    throw new ApiError(res.status, body)
  }

  return body
}

export const api = {
  login: (username, password) =>
    request('/login', {
      method: 'POST',
      body: JSON.stringify({username, password}),
    }),

  logout: () => request('/logout', {method: 'POST'}),

  me: () => request('/me'),

  getGoods: (params = {}) => {
    const search = new URLSearchParams()
    if (params.minPrice !== undefined) {
      search.set('minPrice', params.minPrice)
    }
    if (params.maxPrice !== undefined) {
      search.set('maxPrice', params.maxPrice)
    }
    if (params.category?.length) {
      search.set('category', params.category.join(','))
    }
    if (params.color?.length) {
      search.set('color', params.color.join(','))
    }
    if (params.sort) {
      search.set('sort', params.sort)
    }
    if (params.page) {
      search.set('page', params.page)
    }
    if (params.pageSize) {
      search.set('pageSize', params.pageSize)
    }
    const qs = search.toString()
    return request(`/goods${qs ? `?${qs}` : ''}`)
  },

  getHighlighted: (type, limit = 10) => request(`/goods/highlighted?type=${type}&limit=${limit}`),

  getOrders: () => request('/orders'),

  createOrder: (payload) => request('/orders', {method: 'POST', body: JSON.stringify(payload)}),
}
