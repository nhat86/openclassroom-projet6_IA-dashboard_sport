import { NextRequest, NextResponse } from "next/server"
import { getUserById, getUserIdFromRequest } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req)
  if (userId instanceof NextResponse) return userId

  const startWeek = req.nextUrl.searchParams.get("startWeek")
  const endWeek = req.nextUrl.searchParams.get("endWeek")

  if (!startWeek || !endWeek) {
    return NextResponse.json(
      { message: "startWeek and endWeek are required" },
      { status: 400 }
    )
  }

  const user = getUserById(userId)
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  const startDate = new Date(startWeek)
  const endDate = new Date(endWeek)
  const now = new Date()

  const filteredSessions = user.runningData.filter((session) => {
    const sessionDate = new Date(session.date)
    return sessionDate >= startDate && sessionDate <= endDate && sessionDate <= now
  })

  const sortedSessions = filteredSessions.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return NextResponse.json(sortedSessions)
}
