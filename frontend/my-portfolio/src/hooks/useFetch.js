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

    // If cached and not bypassing, return cached value instantly (0ms delay)
    if (!bypassCache && cacheMap.has(endpoint)) {
      setData(cacheMap.get(endpoint))
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Deduplicate simultaneous requests for the exact same endpoint
      let promise = inflightMap.get(endpoint)
      if (!promise || bypassCache) {
        promise = api.get(endpoint)
        inflightMap.set(endpoint, promise)
      }

      const r = await promise
      const result = r.data.data ?? r.data

      cacheMap.set(endpoint, result)

      // Automatically populate sub-caches when unified /public/all is fetched
      if (endpoint === '/public/all' && result && typeof result === 'object') {
        if (result.about) cacheMap.set('/public/about', result.about)
        if (result.skills) cacheMap.set('/public/skills', result.skills)
        if (result.projects) cacheMap.set('/public/projects', result.projects)
        if (result.certificates) cacheMap.set('/public/certificates', result.certificates)
        if (result.platforms) cacheMap.set('/public/platforms', result.platforms)
        if (result.internships) cacheMap.set('/public/internships', result.internships)
        if (result.achievements) cacheMap.set('/public/achievements', result.achievements)
        if (result.stats) cacheMap.set('/public/stats', result.stats)
      }

      setData(result)
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
