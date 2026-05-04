import { UserInfo, RawUserInfoResponse, ActivitySession, RawActivitySession } from "../types"

export const normalizeUserInfo = (apiResponse: RawUserInfoResponse): UserInfo => {
  return {
    profile: {
      firstName: apiResponse.profile?.firstName ?? "Utilisateur",
      lastName: apiResponse.profile?.lastName ?? "",
      createdAt: apiResponse.profile?.createdAt ?? "",
      age: apiResponse.profile?.age ?? null,
      weight: apiResponse.profile?.weight ?? null,
      height: apiResponse.profile?.height ?? null,
      profilePicture: apiResponse.profile?.profilePicture ?? null,
    },
    statistics: {
      // L'API retourne totalDistance en string → on convertit en number
      totalDistance: parseFloat(apiResponse.statistics?.totalDistance) || 0,
      totalSessions: apiResponse.statistics?.totalSessions || 0,
      totalDuration: apiResponse.statistics?.totalDuration || 0,
    }
  }
}

export const normalizeActivity = (apiResponse: RawActivitySession[]): ActivitySession[] => {
  if (!Array.isArray(apiResponse)) return []

  return apiResponse.map((session: RawActivitySession) => ({
    date: session.date,
    day: new Date(session.date).toLocaleDateString("fr-FR", { weekday: "short" }),
    distance: session.distance,
    duration: session.duration,
    heartRate: {
      min: session.heartRate.min,
      max: session.heartRate.max,
      average: session.heartRate.average,
    },
    caloriesBurned: session.caloriesBurned,
  }))
}