import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { flushSync } from 'react-dom'

export interface AuthContext {
  isAuthenticated: boolean
  token: string | null
  setToken: (token: string | null) => void
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [token, setToken] = useState<string | null>(null)
  const isAuthenticated = !!token
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setToken(token)
    }

    setIsLoading(false)
  }, [])

  const logout = useCallback(() => {
    flushSync(() => {
      setToken(null)
    })
    localStorage.removeItem('token')
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        setToken,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    )
  }
  return context
}
