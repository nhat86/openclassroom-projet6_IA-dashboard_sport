import { NextRequest, NextResponse } from "next/server"
import { getUserById, getUserIdFromRequest } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req)
  if (userId instanceof NextResponse) return userId

  const user = getUserById(userId)
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  const runningData = user.runningData

  const totalDistance = runningData
    .reduce((sum, session) => sum + session.distance, 0)
    .toFixed(1)
  const totalSessions = runningData.length
  const totalDuration = runningData.reduce(
    (sum, session) => sum + session.duration,
    0
  )

  const userProfile = {
    firstName: user.userInfos.firstName,
    lastName: user.userInfos.lastName,
    createdAt: user.userInfos.createdAt,
    gender: user.userInfos.gender,
    goal: user.userInfos.goal,
    age: user.userInfos.age,
    weight: user.userInfos.weight,
    height: user.userInfos.height,
    profilePicture: user.userInfos.profilePicture,
  }

  return NextResponse.json({
    profile: userProfile,
    statistics: {
      totalDistance,
      totalSessions,
      totalDuration,
    },
  })
}
