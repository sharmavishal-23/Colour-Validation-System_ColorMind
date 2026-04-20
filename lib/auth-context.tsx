"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// All sessionStorage keys used by the app
const SESSION_KEYS = [
  "colormind_user",
  "colormind_wardrobe",
  "colormind_palettes",
  "colormind_favorites",
  "colormind_validation",
  "colormind_suggestions",
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = sessionStorage.getItem("colormind_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate login - in real app, this would call an API
    if (email && password.length >= 4) {
      const newUser = { email, name: email.split("@")[0] }
      setUser(newUser)
      sessionStorage.setItem("colormind_user", JSON.stringify(newUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    // Clear all temp data on logout
    SESSION_KEYS.forEach(key => {
      sessionStorage.removeItem(key)
    })
    // Also clear any localStorage items
    localStorage.removeItem("colormind_theme")
    localStorage.removeItem("colormind_settings")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
