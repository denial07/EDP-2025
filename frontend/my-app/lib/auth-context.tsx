"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

import { API_BASE_URL } from "./config"

interface User {
  id: string
  email: string
  name: string
  hasTwoFactorEnabled: boolean
}

type LoginResult =
  | { status: "success" }
  | { status: "two-factor"; twoFactorToken: string }

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<LoginResult>
  verifyTwoFactor: (twoFactorToken: string, code: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name?: string
    hasTwoFactorEnabled?: boolean
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_USER_KEY = "user"
const STORAGE_TOKEN_KEY = "token"

function mapUser(data: AuthResponse["user"], fallbackName?: string): User {
  return {
    id: data.id,
    email: data.email,
    name: data.name ?? fallbackName ?? data.email,
    hasTwoFactorEnabled: data.hasTwoFactorEnabled ?? false,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const persistSession = (nextToken: string, nextUser: User) => {
    setToken(nextToken)
    setUser(nextUser)
    localStorage.setItem(STORAGE_TOKEN_KEY, nextToken)
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(nextUser))
  }

  const clearSession = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(STORAGE_TOKEN_KEY)
    localStorage.removeItem(STORAGE_USER_KEY)
  }

  const refreshUser = async () => {
    const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY)
    if (!storedToken) {
      clearSession()
      return
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
        cache: "no-store",
      })

      if (!res.ok) {
        throw new Error("Unable to fetch profile")
      }

      const data = await res.json()
      const mappedUser = mapUser(data.user ?? data, user?.name)
      persistSession(storedToken, mappedUser)
    } catch (error) {
      clearSession()
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_USER_KEY)
    const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY)

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser) as User
        setUser(parsedUser)
        setToken(storedToken)
      } catch (error) {
        clearSession()
      }
    }

    refreshUser().finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = async (email: string, password: string): Promise<LoginResult> => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const errorBody = await res.json().catch(() => null)
      const message = errorBody?.message ?? "Invalid email or password"
      throw new Error(message)
    }

    const data = await res.json()

    if (data.requiresTwoFactor && data.twoFactorToken) {
      return { status: "two-factor", twoFactorToken: data.twoFactorToken as string }
    }

    const authData = data as AuthResponse
    const mappedUser = mapUser(authData.user)
    persistSession(authData.token, mappedUser)

    return { status: "success" }
  }

  const verifyTwoFactor = async (twoFactorToken: string, code: string) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/totp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ twoFactorToken, code }),
    })

    if (!res.ok) {
      const errorBody = await res.json().catch(() => null)
      const message = errorBody?.message ?? "Invalid verification code"
      throw new Error(message)
    }

    const data = (await res.json()) as AuthResponse
    const mappedUser = mapUser(data.user)
    persistSession(data.token, mappedUser)
  }

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    })

    if (!res.ok) {
      const errorBody = await res.json().catch(() => null)
      const message =
        Array.isArray(errorBody) && errorBody.length > 0
          ? errorBody[0]
          : errorBody?.message ?? "Unable to register"
      throw new Error(message)
    }

    const result = await login(email, password)

    if (result.status === "two-factor") {
      // New accounts shouldn't require 2FA but handle gracefully
      throw new Error("Two-factor authentication is required to complete sign in. Please log in with your code.")
    }

    if (name) {
      setUser((prev) => {
        if (!prev) return prev
        const updated = { ...prev, name }
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updated))
        return updated
      })
    }
  }

  const logout = () => {
    clearSession()
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, verifyTwoFactor, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
