import { useState, useEffect } from "react"
import { getUserInfo } from "../services/apiService"
import { UserInfo } from "../types"

interface UseInfoReturn {
  data: UserInfo | null
  loading: boolean
  error: string | null
}

export const useInfo = (token: string | null): UseInfoReturn => {
  const [data, setData] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState<boolean>(!!token)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await getUserInfo(token)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  return { data, loading, error }
}