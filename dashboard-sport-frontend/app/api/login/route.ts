import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import users from "@/data/data.json"
import { SECRET_KEY } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const { username, password } = body ?? {}

  if (!username || !password) {
    return NextResponse.json(
      { message: "username and password are required" },
      { status: 400 }
    )
  }

  const user = users.find((u) => u.username === username)

  if (!user || user.password !== password) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
  }

  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "24h" })
  return NextResponse.json({ token, userId: user.id })
}
