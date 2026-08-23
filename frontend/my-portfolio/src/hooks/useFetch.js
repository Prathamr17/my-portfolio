import { useState, useEffect, useCallback } from 'react'
import api from '../api/axios'

// Global in-memory cache & inflight request deduplication maps
const cacheMap = new Map()
const inflightMap = new Map()

let publicAllPromise = null

export function prefetchPublicData() {
  if (!publicAllPromise) {
    publicAllPromise = api.get('/public/all')
      .then(r => {
        const result = r.data.data ?? r.data
        cacheMap.set('/public/all', result)
        if (result && typeof result === 'object') {
          if (result.about) cacheMap.set('/public/about', result.about)
          if (result.skills) cacheMap.set('/public/skills', result.skills)
          if (result.projects) cacheMap.set('/public/projects', result.projects)
          if (result.certificates) cacheMap.set('/public/certificates', result.certificates)
          if (result.platforms) cacheMap.set('/public/platforms', result.platforms)
          if (result.internships) cacheMap.set('/public/internships', result.internships)
          if (result.achievements) cacheMap.set('/public/achievements', result.achievements)
          if (result.stats) cacheMap.set('/public/stats', result.stats)
        }
        return result
      })
      .catch(() => null)
  }
  return publicAllPromise
}

// Immediately trigger prefetch as soon as the JS module is loaded!
if (typeof window !== 'undefined') {
  prefetchPublicData()
}

export function clearFetchCache(endpoint) {
  publicAllPromise = null
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

    // 1. Return cached value immediately if available
    if (!bypassCache && cacheMap.has(endpoint)) {
      setData(cacheMap.get(endpoint))
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      let rData = null
      const isPublicSubRoute = endpoint.startsWith('/public/') && endpoint !== '/public/all'

      // 2. For public sub-routes, await the top-level prefetch promise first
      if (!bypassCache && isPublicSubRoute) {
        await prefetchPublicData()
        if (cacheMap.has(endpoint)) {
          rData = cacheMap.get(endpoint)
          setData(rData)
          setLoading(false)
          return
        }
      }

      // 3. Fallback: fetch endpoint directly if not populated by /public/all
      let promise = inflightMap.get(endpoint)
      if (!promise || bypassCache) {
        promise = api.get(endpoint)
        inflightMap.set(endpoint, promise)
      }

      const r = await promise
      rData = r.data.data ?? r.data

      cacheMap.set(endpoint, rData)

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
