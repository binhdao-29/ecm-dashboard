import { useCallback, useMemo, useEffect, useRef } from 'react'
import { useSearchParams, NavigateOptions, useLocation } from 'react-router-dom'

/**
 * Custom hook: useSearchParam (Enhanced TypeScript)
 * -------------------------------------------------
 * Helpers exposed:
 *  - getParam(key): string | null
 *  - setParam(key, value, options?)      // chỉ giữ value có ý nghĩa
 *  - setMany({ key: value, ... }, opts?) // chỉ giữ value có ý nghĩa
 *  - deleteParam(key, options?)
 *  - deleteMany([key1, key2], options?)
 *  - queryObject → { [key: string]: string }
 *  - clearCache() → xóa cache localStorage cho route hiện tại
 */

type ParamValue = string | number | boolean | null | undefined

// Chỉ giữ những giá trị thực sự có ý nghĩa
const hasValue = (v: ParamValue): v is string | number => {
  if (v === undefined || v === null || v === false || v === '') return false
  if (typeof v === 'string' && v.trim() === '') return false
  if (typeof v === 'number' && (isNaN(v) || v === 0)) return false
  return true
}

// Kiểm tra xem có phải giá trị mặc định không (để loại bỏ khỏi URL)
const isDefaultValue = (key: string, value: ParamValue): boolean => {
  // Có thể customize theo nhu cầu
  const defaults: Record<string, any> = {
    page: 1,
    limit: 10,
    sort: 'id',
    order: 'asc'
  }

  return defaults[key] !== undefined && String(value) === String(defaults[key])
}

type UpdateOptions = NavigateOptions & {
  /** Có lưu vào localStorage không (default: true) */
  persist?: boolean
  /** Có thay thế URL hiện tại không (default: false) */
  replace?: boolean
}

export interface UseSearchParam {
  getParam: (key: string) => string | null
  setParam: (key: string, value: ParamValue, options?: UpdateOptions) => void
  setMany: (entries: Record<string, ParamValue>, options?: UpdateOptions) => void
  deleteParam: (key: string, options?: UpdateOptions) => void
  deleteMany: (keys: string[], options?: UpdateOptions) => void
  clearCache: () => void
  /** Toàn bộ query dưới dạng object */
  queryObject: Record<string, string>
}

export default function useSearchParam(): UseSearchParam {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const isInitialized = useRef(false)
  const lastCleanUrlRef = useRef<string>('')

  // Tạo key duy nhất cho mỗi route
  const cacheKey = `search-params-${location.pathname}`

  // Hàm tạo URLSearchParams sạch (chỉ giữ giá trị có ý nghĩa)
  const createCleanParams = (entries: Record<string, ParamValue>): URLSearchParams => {
    const params = new URLSearchParams()

    Object.entries(entries).forEach(([key, value]) => {
      if (hasValue(value) && !isDefaultValue(key, value)) {
        params.set(key, String(value))
      }
    })

    return params
  }

  // Khôi phục state từ localStorage khi component mount
  useEffect(() => {
    if (isInitialized.current) return

    try {
      const cached = localStorage.getItem(cacheKey)
      const currentParams = Object.fromEntries(searchParams.entries())
      const hasCurrentParams = Object.keys(currentParams).length > 0

      // Chỉ khôi phục nếu URL hiện tại không có params hoặc ít params hơn cache
      if (cached && !hasCurrentParams) {
        const cachedParams = JSON.parse(cached) as Record<string, unknown>
        const cleanParams = createCleanParams(cachedParams as Record<string, ParamValue>)

        if (cleanParams.toString() && cleanParams.toString() !== searchParams.toString()) {
          setSearchParams(cleanParams, { replace: true })
        }
      } else if (hasCurrentParams) {
        // Nếu URL có params, lưu vào cache và làm sạch URL
        const cleanParams = createCleanParams(currentParams)

        // Lưu vào cache
        if (Object.keys(currentParams).length > 0) {
          localStorage.setItem(cacheKey, JSON.stringify(currentParams))
        }

        // Làm sạch URL nếu cần
        if (cleanParams.toString() !== searchParams.toString()) {
          setSearchParams(cleanParams, { replace: true })
        }
      }
    } catch (error) {
      console.warn('Failed to restore search params from cache:', error)
    }

    isInitialized.current = true
  }, [cacheKey, searchParams, setSearchParams])

  // Lưu state vào localStorage và làm sạch URL
  useEffect(() => {
    if (!isInitialized.current) return

    const currentParamsString = searchParams.toString()

    // Tránh loop vô hạn
    if (currentParamsString === lastCleanUrlRef.current) return

    try {
      const paramsObject: Record<string, string> = {}
      searchParams.forEach((value, key) => {
        paramsObject[key] = value
      })

      // Lưu vào localStorage (bao gồm cả giá trị rỗng để nhớ state)
      if (Object.keys(paramsObject).length > 0) {
        localStorage.setItem(cacheKey, JSON.stringify(paramsObject))
      }

      // Tạo URL sạch (chỉ giữ giá trị có ý nghĩa)
      const cleanParams = createCleanParams(paramsObject)
      const cleanParamsString = cleanParams.toString()

      // Cập nhật URL nếu khác với hiện tại
      if (cleanParamsString !== currentParamsString) {
        lastCleanUrlRef.current = cleanParamsString
        setSearchParams(cleanParams, { replace: true })
      } else {
        lastCleanUrlRef.current = currentParamsString
      }
    } catch (error) {
      console.warn('Failed to save search params to cache:', error)
    }
  }, [searchParams, cacheKey, setSearchParams])

  /** Lấy giá trị 1 param */
  const getParam = useCallback<UseSearchParam['getParam']>(
    (key) => {
      // Thử lấy từ URL trước
      const urlValue = searchParams.get(key)
      if (urlValue !== null) return urlValue

      // Nếu không có trong URL, thử lấy từ cache
      try {
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          const cachedParams = JSON.parse(cached) as Record<string, unknown>
          const cachedValue = cachedParams[key]
          return cachedValue ? String(cachedValue) : null
        }
      } catch (error) {
        console.warn('Failed to get param from cache:', error)
      }

      return null
    },
    [searchParams, cacheKey]
  )

  /** Thêm / cập nhật 1 param */
  const setParam = useCallback<UseSearchParam['setParam']>(
    (key, value, options = {}) => {
      const { persist = true, ...navigateOptions } = options

      // Lấy tất cả params hiện tại (bao gồm từ cache)
      const currentParams: Record<string, ParamValue> = {}

      // Lấy từ cache trước
      if (persist) {
        try {
          const cached = localStorage.getItem(cacheKey)
          if (cached) {
            const cachedParams = JSON.parse(cached) as Record<string, unknown>
            Object.assign(currentParams, cachedParams)
          }
        } catch (error) {
          console.warn('Failed to read cache:', error)
        }
      }

      // Ghi đè với params từ URL
      searchParams.forEach((val, k) => {
        currentParams[k] = val
      })

      // Cập nhật giá trị mới
      if (hasValue(value)) {
        currentParams[key] = value
      } else {
        delete currentParams[key]
      }

      // Tạo params sạch cho URL
      const cleanParams = createCleanParams(currentParams)
      setSearchParams(cleanParams, navigateOptions)

      // Lưu vào cache (bao gồm cả giá trị rỗng)
      if (persist) {
        try {
          if (Object.keys(currentParams).length > 0) {
            localStorage.setItem(cacheKey, JSON.stringify(currentParams))
          } else {
            localStorage.removeItem(cacheKey)
          }
        } catch (error) {
          console.warn('Failed to update cache:', error)
        }
      }
    },
    [searchParams, setSearchParams, cacheKey]
  )

  /** Ghi đè toàn bộ param bằng entries */
  const setMany = useCallback<UseSearchParam['setMany']>(
    (entries, options = {}) => {
      const { persist = true, ...navigateOptions } = options

      // Tạo object mới chỉ với giá trị có ý nghĩa
      const cleanEntries: Record<string, ParamValue> = {}
      Object.entries(entries).forEach(([k, v]) => {
        if (hasValue(v)) {
          cleanEntries[k] = v
        }
      })

      const cleanParams = createCleanParams(cleanEntries)
      setSearchParams(cleanParams, navigateOptions)

      // Lưu vào cache
      if (persist) {
        try {
          if (Object.keys(entries).length > 0) {
            localStorage.setItem(cacheKey, JSON.stringify(entries))
          } else {
            localStorage.removeItem(cacheKey)
          }
        } catch (error) {
          console.warn('Failed to update cache:', error)
        }
      }
    },
    [setSearchParams, cacheKey]
  )

  /** Xoá 1 param */
  const deleteParam = useCallback<UseSearchParam['deleteParam']>(
    (key, options = {}) => {
      const { persist = true, ...navigateOptions } = options

      // Lấy params hiện tại
      const currentParams: Record<string, ParamValue> = {}
      searchParams.forEach((val, k) => {
        if (k !== key) currentParams[k] = val
      })

      const cleanParams = createCleanParams(currentParams)
      setSearchParams(cleanParams, navigateOptions)

      // Cập nhật cache
      if (persist) {
        try {
          const cached = localStorage.getItem(cacheKey)
          if (cached) {
            const cachedParams = JSON.parse(cached) as Record<string, unknown>
            delete cachedParams[key]

            if (Object.keys(cachedParams).length > 0) {
              localStorage.setItem(cacheKey, JSON.stringify(cachedParams))
            } else {
              localStorage.removeItem(cacheKey)
            }
          }
        } catch (error) {
          console.warn('Failed to update cache:', error)
        }
      }
    },
    [searchParams, setSearchParams, cacheKey]
  )

  /** Xoá nhiều param */
  const deleteMany = useCallback<UseSearchParam['deleteMany']>(
    (keys, options = {}) => {
      const { persist = true, ...navigateOptions } = options

      // Lấy params hiện tại
      const currentParams: Record<string, ParamValue> = {}
      searchParams.forEach((val, k) => {
        if (!keys.includes(k)) currentParams[k] = val
      })

      const cleanParams = createCleanParams(currentParams)
      setSearchParams(cleanParams, navigateOptions)

      // Cập nhật cache
      if (persist) {
        try {
          const cached = localStorage.getItem(cacheKey)
          if (cached) {
            const cachedParams = JSON.parse(cached) as Record<string, unknown>
            keys.forEach((key) => delete cachedParams[key])

            if (Object.keys(cachedParams).length > 0) {
              localStorage.setItem(cacheKey, JSON.stringify(cachedParams))
            } else {
              localStorage.removeItem(cacheKey)
            }
          }
        } catch (error) {
          console.warn('Failed to update cache:', error)
        }
      }
    },
    [searchParams, setSearchParams, cacheKey]
  )

  /** Xóa cache cho route hiện tại */
  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(cacheKey)
      setSearchParams(new URLSearchParams(), { replace: true })
    } catch (error) {
      console.warn('Failed to clear cache:', error)
    }
  }, [cacheKey, setSearchParams])

  /** Biến URLSearchParams → object (bao gồm cả cache) */
  const queryObject = useMemo<UseSearchParam['queryObject']>(() => {
    const obj: Record<string, string> = {}

    // Lấy từ cache trước
    try {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const cachedParams = JSON.parse(cached) as Record<string, unknown>
        Object.entries(cachedParams).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            obj[key] = String(value)
          }
        })
      }
    } catch (error) {
      console.warn('Failed to read cache for queryObject:', error)
    }

    // Ghi đè với params từ URL
    searchParams.forEach((value, key) => {
      obj[key] = value
    })

    return obj
  }, [searchParams, cacheKey])

  return {
    getParam,
    setParam,
    setMany,
    deleteParam,
    deleteMany,
    clearCache,
    queryObject
  }
}
