import { useState, useEffect } from "react"
import { getActivity } from "../services/apiService"
import { ActivitySession } from "../types"

interface UseActivityReturn {
  data: ActivitySession[] | null
  loading: boolean
  error: string | null
}

export const useActivity = (
  token: string | null,
  startWeek: string,
  endWeek: string
): UseActivityReturn => {
  const [data, setData] = useState<ActivitySession[] | null>(null)
  const [loading, setLoading] = useState<boolean>(!!token)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await getActivity(token, startWeek, endWeek)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token, startWeek, endWeek])

  return { data, loading, error }
}