import { normalizeUserInfo, normalizeActivity } from "./dataMapper"
import { API_URL } from "./config"
import { UserInfo, ActivitySession } from "../types"



// ===== LOGIN =====
export const loginUser = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Erreur lors de la connexion")
    }

    const data = await response.json()
    return { token: data.token, userId: data.userId }

  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error("Erreur réseau")
  }
}

// ===== USER INFO =====
export const getUserInfo = async (token: string): Promise<UserInfo> => {
  

  const response = await fetch(`${API_URL}/api/user-info`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) throw new Error("Erreur récupération profil")

  const data = await response.json()
  return normalizeUserInfo(data)
}

// ===== ACTIVITY =====
export const getActivity = async (
  token: string,
  startWeek: string,
  endWeek: string
): Promise<ActivitySession[]> => {
  

  const response = await fetch(
    `${API_URL}/api/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  if (!response.ok) throw new Error("Erreur récupération activité")

  const data = await response.json()
  return normalizeActivity(data)
}