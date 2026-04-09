'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export interface AuthUser {
  id: string
  name: string
  phone: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isAuthHydrated: boolean
  logout: () => Promise<void>
  updateUser: (updates: Partial<Pick<AuthUser, 'name'>>) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isAuthHydrated, setIsAuthHydrated] = useState(false)

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const { user: u } = await res.json()
        setUser(u ?? null)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    refreshUser().finally(() => setIsAuthHydrated(true))
  }, [refreshUser])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }, [])

  const updateUser = useCallback((updates: Partial<Pick<AuthUser, 'name'>>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev))
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isAuthHydrated, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
