"use client"

import { createContext, useState, useEffect, ReactNode } from "react"
import Cookies from "js-cookie"

interface AuthContextType {
  token: string | null
  userId: number | null
  isAuthenticated: boolean
  login: (token: string, userId: number) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  userId: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)

  // Restaure la session au démarrage depuis les cookies
  useEffect(() => {
    const savedToken = Cookies.get("token")
    const savedUserId = Cookies.get("userId")

    if (savedToken && savedUserId) {
      setToken(savedToken)
      setUserId(Number(savedUserId))
    }
  }, [])

  const login = (newToken: string, newUserId: number) => {
    setToken(newToken)
    setUserId(newUserId)

    // expires: 7 = le cookie dure 7 jours
    Cookies.set("token", newToken, {
      expires: 7,
      secure: true,        // HTTPS uniquement en production
      sameSite: "strict"   // protection CSRF
    })
    Cookies.set("userId", String(newUserId), {
      expires: 7,
      secure: true,
      sameSite: "strict"
    })
  }

  const logout = () => {
    setToken(null)
    setUserId(null)
    Cookies.remove("token")
    Cookies.remove("userId")
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        isAuthenticated: !!token, //pour convertir n'importe quelle valeur en booléen
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}