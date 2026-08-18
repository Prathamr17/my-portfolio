import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken]   = useState(() => localStorage.getItem('admin_token'))
  const [admin, setAdmin]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then(r => setAdmin(r.data.data))
        .catch(() => logout())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (email, password) => {
    const r = await api.post('/auth/login', { email, password })
    const t = r.data.data.access_token
    localStorage.setItem('admin_token', t)
    setToken(t)
    setAdmin(r.data.data.user)
    return r.data
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    setToken(null)
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ token, admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
