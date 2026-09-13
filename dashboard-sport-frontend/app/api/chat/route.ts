import { NextRequest, NextResponse } from "next/server"
import { buildUserContext } from "@/lib/ai/buildUserContext"
import { UserInfo, ActivitySession } from "@/types"

interface ChatBody {
  message?: string
  history?: Array<{ role: string; content: string }>
  userInfo?: UserInfo
  activity?: ActivitySession[]
}

export async function POST(req: NextRequest) {
  const apiUrl = process.env.MISTRAL_API_URL
  const apiKey = process.env.MISTRAL_API_KEY

  if (!apiUrl || !apiKey) {
    return NextResponse.json(
      { error: "Configuration Mistral manquante" },
      { status: 500 }
    )
  }

  let body: ChatBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 })
  }

  const { message, history = [], userInfo, activity = [] } = body

  if (!message?.trim() || !userInfo) {
    return NextResponse.json(
      { error: "message et userInfo sont requis" },
      { status: 400 }
    )
  }

  const systemPrompt = buildUserContext(userInfo, activity)
  // 📌 Filtre le message de bienvenue initial
  const filteredHistory = history.filter(
    (msg) =>
      !(msg.role === "assistant" && msg.content.includes("Bonjour ! Je suis votre coach IA"))
  )

  const messages = [
    { role: "system", content: systemPrompt },
    ...filteredHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content
    })),
    { role: "user", content: message }
  ]

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages,
        max_tokens: 1024,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      console.error("Mistral error:", errorData)
      return NextResponse.json({ error: "Erreur API Mistral" }, { status: response.status })
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content ?? "Je n'ai pas pu répondre."

    return NextResponse.json({ response: text })
  } catch (err) {
    console.error("Mistral fetch error:", err)
    return NextResponse.json({ error: "Erreur réseau vers Mistral" }, { status: 502 })
  }
}
