import {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {useAuth} from './AuthContext'

const CartContext = createContext(null)

function storageKey(username) {
  return `gadgethub_cart_${username || 'guest'}`
}

function readCart(username) {
  try {
    const raw = localStorage.getItem(storageKey(username))
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeCart(username, items) {
  try {
    localStorage.setItem(storageKey(username), JSON.stringify(items))
  } catch { /* empty */ }
}

export function CartProvider({children}) {
  const {user} = useAuth()
  const username = user?.username
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(readCart(username))
  }, [username])

  const persist = useCallback(
    (next) => {
      setItems(next)
      writeCart(username, next)
    },
    [username],
  )

  const addItem = useCallback(
    (good, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.goodId === good.id)
        let next
        if (existing) {
          next = prev.map((i) => (i.goodId === good.id ? {...i, quantity: i.quantity + quantity} : i))
        } else {
          next = [
            ...prev,
            {
              goodId: good.id,
              title: good.title,
              price: good.price,
              imageUrl: good.imageUrl,
              category: good.category,
              quantity,
            },
          ]
        }
        writeCart(username, next)
        return next
      })
    },
    [username],
  )

  const setQuantity = useCallback(
    (goodId, quantity) => {
      setItems((prev) => {
        let next
        if (quantity <= 0) {
          next = prev.filter((i) => i.goodId !== goodId)
        } else {
          next = prev.map((i) => (i.goodId === goodId ? {...i, quantity} : i))
        }
        writeCart(username, next)
        return next
      })
    },
    [username],
  )

  const removeItem = useCallback(
    (goodId) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.goodId !== goodId)
        writeCart(username, next)
        return next
      })
    },
    [username],
  )

  const removeItems = useCallback(
    (goodIds) => {
      setItems((prev) => {
        const set = new Set(goodIds)
        const next = prev.filter((i) => !set.has(i.goodId))
        writeCart(username, next)
        return next
      })
    },
    [username],
  )

  const clear = useCallback(() => {
    persist([])
  }, [persist])

  const getQuantity = useCallback((goodId) => items.find((i) => i.goodId === goodId)?.quantity ?? 0, [items])

  const totalCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])

  const value = useMemo(
    () => ({
      items,
      addItem,
      setQuantity,
      removeItem,
      removeItems,
      clear,
      getQuantity,
      totalCount,
    }),
    [items, addItem, setQuantity, removeItem, removeItems, clear, getQuantity, totalCount],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}
