import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { message, systemPrompt, history } = await req.json()

  // ✅ Filtre le message de bienvenue initial
  const filteredHistory = history.filter(
    (msg: { role: string; content: string }) =>
      !(msg.role === "assistant" && msg.content.includes("Bonjour ! Je suis votre coach IA"))
  )

  const messages = [
    { role: "system", content: systemPrompt },
    ...filteredHistory.map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content
    })),
    { role: "user", content: message }
  ]

  console.log("=== MESSAGES ENVOYES A MISTRAL ===")
  console.log(JSON.stringify(messages, null, 2))

  const response = await fetch(process.env.MISTRAL_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`
    },
    body: JSON.stringify({
      model: "mistral-small-latest",
      messages,
      max_tokens: 1024,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error("Mistral error:", errorData)
    return NextResponse.json({ error: "Erreur API Mistral" }, { status: response.status })
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content ?? "Je n'ai pas pu répondre."

  return NextResponse.json({ response: text })
}