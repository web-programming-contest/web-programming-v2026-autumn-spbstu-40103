import {useEffect, useState} from 'react'
import {api} from '../api/client'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import FilterPanel from '../components/FilterPanel'
import SortTabs from '../components/SortTabs'
import Pagination from '../components/Pagination'
import {DEFAULT_PAGE_SIZE} from '../utils/constants'
import './CatalogPage.css'

const STORAGE_KEY = 'gadgethub_catalog_state'

const INITIAL_FILTERS = {
  minPrice: undefined,
  maxPrice: undefined,
  category: [],
  color: [],
}

function loadSaved() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export default function CatalogPage() {
  const [saved] = useState(loadSaved)
  const [filters, setFilters] = useState({...INITIAL_FILTERS, ...saved.filters})
  const [sort, setSort] = useState(saved.sort || 'new')
  const [page, setPage] = useState(saved.page || 1)

  const [goods, setGoods] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedGood, setSelectedGood] = useState(null)
  const [priceBounds, setPriceBounds] = useState(null)

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({filters, sort, page}))
    } catch { /* empty */ }
  }, [filters, sort, page])

  useEffect(() => {
    let cancelled = false
    Promise.all([
      api.getGoods({sort: 'price_asc', page: 1, pageSize: 1}),
      api.getGoods({sort: 'price_desc', page: 1, pageSize: 1}),
    ])
      .then(([lowest, highest]) => {
        if (cancelled) {
          return
        }
        const min = lowest.items?.[0]?.price
        const max = highest.items?.[0]?.price
        if (min !== undefined && max !== undefined) {
          setPriceBounds({min, max})
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    api
      .getGoods({...filters, sort, page, pageSize: DEFAULT_PAGE_SIZE})
      .then((data) => {
        if (cancelled) {
          return
        }
        setGoods(data.items || [])
        setTotalPages(data.totalPages || 1)
      })
      .catch(() => {
        if (!cancelled) {
          setError('Не удалось загрузить товары. Попробуйте позже.')
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [filters, sort, page])

  const handleApplyFilters = (next) => {
    setFilters(next)
    setPage(1)
  }

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS)
    setPage(1)
  }

  const handleSortChange = (next) => {
    setSort(next)
    setPage(1)
  }

  return (
    <div className="catalog-page container">
      <h1 className="catalog-page__title">Каталог товаров</h1>

      <div className="catalog-page__sort">
        <SortTabs value={sort} onChange={handleSortChange} />
      </div>

      <div className="catalog-page__layout">
        <div className="catalog-page__content">
          {isLoading && <p className="catalog-page__status">Загрузка...</p>}

          {!isLoading && error && <p className="catalog-page__status catalog-page__status--error">{error}</p>}

          {!isLoading && !error && goods.length === 0 && (
            <p className="catalog-page__status">По вашему запросу товары не найдены</p>
          )}

          {!isLoading && !error && goods.length > 0 && (
            <>
              <div className="catalog-page__grid">
                {goods.map((good) => (
                  <ProductCard key={good.id} good={good} onOpen={setSelectedGood} showCart />
                ))}
              </div>

              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </>
          )}
        </div>

        <FilterPanel
          initialFilters={filters}
          priceBounds={priceBounds}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />
      </div>

      {selectedGood && <ProductModal good={selectedGood} onClose={() => setSelectedGood(null)} />}
    </div>
  )
}
