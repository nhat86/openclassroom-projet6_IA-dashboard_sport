import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import users from "@/data/data.json"

export const SECRET_KEY = "your-secret-key-12345" // In a real app, this would be in environment variables

export type UserRecord = (typeof users)[number]

export const getUserById = (userId: string) => {
  return users.find((user) => user.id === userId)
}

export const getUserIdFromRequest = (req: NextRequest): string | NextResponse => {
  const authHeader = req.headers.get("authorization")
  const token = authHeader?.split(" ")[1]

  if (!token) {
    return NextResponse.json({ message: "Authentication required" }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string }
    return decoded.userId
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 403 })
  }
}
