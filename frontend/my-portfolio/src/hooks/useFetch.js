import { useState, useEffect, useCallback } from 'react'
import api from '../api/axios'

export function useFetch(endpoint, deps = []) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchData = useCallback(async () => {
    if (!endpoint) { setLoading(false); return }
    setLoading(true)
    setError(null)
    try {
      const r = await api.get(endpoint)
      setData(r.data.data ?? r.data)
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Failed to load data'
      setError(msg)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [endpoint, ...(deps || [])])

  useEffect(() => { fetchData() }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
