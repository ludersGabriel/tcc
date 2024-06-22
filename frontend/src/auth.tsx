import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { flushSync } from 'react-dom'
import toast from 'react-hot-toast'
import { User, useUser } from './api/user/user.query'

export interface AuthContext {
  isAuthenticated: boolean
  token: string | null
  user: User | null
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
  const { user, isPending } = useUser(token ?? '')
  const isAuthenticated = !!user
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
    toast.success('Logged out')
    window.location.reload()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        token,
        setToken,
        isLoading: isPending || isLoading,
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
