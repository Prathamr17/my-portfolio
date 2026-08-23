import { useState, useEffect, useCallback } from 'react'
import api from '../api/axios'

// Global in-memory cache & inflight request deduplication maps
const cacheMap = new Map()
const inflightMap = new Map()

export function clearFetchCache(endpoint) {
  if (endpoint) {
    cacheMap.delete(endpoint)
  } else {
    cacheMap.clear()
  }
}

export function useFetch(endpoint, deps = []) {
  const cachedValue = endpoint ? cacheMap.get(endpoint) : null
  const [data, setData]       = useState(cachedValue ?? null)
  const [loading, setLoading] = useState(!cachedValue)
  const [error, setError]     = useState(null)

  const fetchData = useCallback(async (bypassCache = false) => {
    if (!endpoint) { setLoading(false); return }

    // 1. If cached and not bypassing, return cached value instantly (0ms delay)
    if (!bypassCache && cacheMap.has(endpoint)) {
      setData(cacheMap.get(endpoint))
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      let rData = null

      // 2. If endpoint is a public sub-route and /public/all is currently in-flight or cached
      const isPublicSubRoute = endpoint.startsWith('/public/') && endpoint !== '/public/all'
      const allInflight = inflightMap.get('/public/all')

      if (!bypassCache && isPublicSubRoute && (cacheMap.has('/public/all') || allInflight)) {
        if (allInflight) {
          try { await allInflight } catch { /* ignore /all error to fallback */ }
        }
        if (cacheMap.has(endpoint)) {
          rData = cacheMap.get(endpoint)
          setData(rData)
          setLoading(false)
          return
        }
      }

      // 3. Otherwise fetch endpoint directly
      let promise = inflightMap.get(endpoint)
      if (!promise || bypassCache) {
        promise = api.get(endpoint)
        inflightMap.set(endpoint, promise)
      }

      const r = await promise
      rData = r.data.data ?? r.data

      cacheMap.set(endpoint, rData)

      // Automatically populate sub-caches when unified /public/all is fetched
      if (endpoint === '/public/all' && rData && typeof rData === 'object') {
        if (rData.about) cacheMap.set('/public/about', rData.about)
        if (rData.skills) cacheMap.set('/public/skills', rData.skills)
        if (rData.projects) cacheMap.set('/public/projects', rData.projects)
        if (rData.certificates) cacheMap.set('/public/certificates', rData.certificates)
        if (rData.platforms) cacheMap.set('/public/platforms', rData.platforms)
        if (rData.internships) cacheMap.set('/public/internships', rData.internships)
        if (rData.achievements) cacheMap.set('/public/achievements', rData.achievements)
        if (rData.stats) cacheMap.set('/public/stats', rData.stats)
      }

      setData(rData)
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Failed to load data'
      setError(msg)
      setData(null)
    } finally {
      inflightMap.delete(endpoint)
      setLoading(false)
    }
  }, [endpoint, ...(deps || [])])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    if (endpoint) cacheMap.delete(endpoint)
    return fetchData(true)
  }, [endpoint, fetchData])

  return { data, loading, error, refetch }
}
