import { RawUserInfoResponse } from "../types"

export const mockUserInfo: RawUserInfoResponse = {
  profile: {
    firstName: "Sophie",
    lastName: "Martin",
    createdAt: "2025-01-01",
    gender: "female",
    goal: 2,
    age: 32,
    weight: 60,
    height: 165,
    profilePicture: "/images/sophie.jpg"
  },
  statistics: {
    totalDistance: "2250.2",
    totalSessions: 348,
    totalDuration: 14625
  }
}
