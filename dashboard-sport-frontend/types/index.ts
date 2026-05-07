export interface HeartRate {
  min: number
  max: number
  average: number
}

export interface UserProfile {
  firstName: string
  lastName: string
  createdAt: string
  gender: string
  goal: number | null
  age: number | null
  weight: number | null
  height: number | null
  profilePicture: string | null
}

export interface UserStats {
  totalDistance: number
  totalSessions: number
  totalDuration: number
}
export interface RawUserInfoResponse {
  profile: {
    firstName: string
    lastName: string
    createdAt: string
    age: number
    weight: number
    height: number
    goal: number | null
    profilePicture: string
    gender: string
  }
  statistics: {
    totalDistance: string  // ← string dans l'API, converti en number par le mapper
    totalSessions: number
    totalDuration: number
  }
} 

export interface UserInfo {
  profile: UserProfile
  statistics: UserStats
}

// Réponse brute de l'API (avant normalisation)
export interface RawActivitySession {
  date: string
  distance: number
  duration: number
  heartRate: HeartRate
  caloriesBurned: number
}

// Données normalisées utilisées dans l'app
export interface ActivitySession {
  date: string
  day: string          
  distance: number
  duration: number
  heartRate: HeartRate
  caloriesBurned: number
}