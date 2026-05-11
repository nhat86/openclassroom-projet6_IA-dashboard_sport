"use client"

import { useState, useRef, useEffect } from "react"
import styles from "./ChatBox.module.css"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { UserInfo } from "../../../types"
import { ActivitySession } from "../../../types"

interface Props {
  userInfo: UserInfo
  activity: ActivitySession[]
}

export default function ChatBox({ userInfo, activity }: Props) {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    { role: "assistant", content: "Bonjour ! Je suis votre coach IA. Comment puis-je vous aider ?" },
  ])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestions = [
    "Comment améliorer mon endurance ?",
    "Que signifie mon score de récupération ?",
    "Peux-tu analyser mes performances récentes ?",
  ]

  // ✅ Construit le contexte utilisateur pour le prompt
  const buildUserContext = (): string => {
    const { profile, statistics } = userInfo

    const totalCalories = activity.reduce((sum, s) => sum + s.caloriesBurned, 0)
    const avgHeartRate = activity.length > 0
      ? Math.round(activity.reduce((sum, s) => sum + s.heartRate.average, 0) / activity.length)
      : 0
    const avgDistance = activity.length > 0
      ? parseFloat((activity.reduce((sum, s) => sum + s.distance, 0) / activity.length).toFixed(1))
      : 0

    const today = new Date()
    today.setHours(23, 59, 59, 999)
    const last10Sessions = [...activity]
      .filter((s) => new Date(s.date) <= today)        // ✅ seulement passées
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // plus récent en premier
      .slice(0, 10)   

    const last10Text = last10Sessions
      .map((s, i) =>
        `${i + 1}. ${s.date} — ${s.distance}km en ${s.duration}min | BPM moy: ${s.heartRate.average} | Calories: ${s.caloriesBurned}`
      )
      .join("\n")
    return `
Tu es un coach sportif IA expert. Tu aides l'utilisateur à améliorer ses performances sportives.
Voici les informations de l'utilisateur :

--- PROFIL ---
Prénom : ${profile.firstName}
Âge : ${profile.age} ans
Poids : ${profile.weight} kg
Taille : ${profile.height} cm
Membre depuis : ${profile.createdAt}

--- STATISTIQUES GLOBALES ---
Distance totale : ${statistics.totalDistance} km
Nombre de sessions : ${statistics.totalSessions}
Durée totale : ${statistics.totalDuration} minutes
Calories brûlées au total : ${totalCalories} cal

--- PERFORMANCES RÉCENTES (${activity.length} sessions) ---
Distance moyenne par session : ${avgDistance} km
Fréquence cardiaque moyenne : ${avgHeartRate} BPM

--- 10 DERNIÈRES COURSES ---
${last10Text}

--- INSTRUCTIONS ---
- Réponds toujours en français
- Sois encourageant et bienveillant
- Personnalise tes réponses avec les données de l'utilisateur
- Donne des conseils concrets et adaptés
- Réponds de façon concise (max 3-4 phrases)
    `.trim()
  }

  const sendMessage = async (message?: string) => {
    const msg = message || currentMessage
    if (!msg.trim() || isLoading) return
    const systemPrompt = buildUserContext()
  console.log("=== SYSTEM PROMPT ===")
  console.log(systemPrompt)
    setIsLoading(true)
    setError(null)
    setCurrentMessage("")

    setMessages((prev) => [...prev, { role: "user", content: msg }])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          systemPrompt: buildUserContext(),  // ✅ contexte user envoyé
          history: messages                  // ✅ historique pour la continuité
        }),
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`)
      }

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }])

    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentMessage(suggestion)
    if (inputRef.current) inputRef.current.focus()
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <h2>
          Posez vos questions sur votre programme,
          <br />
          vos performances ou vos objectifs
        </h2>
      </div>

      <div className={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.messageBubble} ${msg.role === "user" ? styles.userBubble : styles.assistantBubble}`}
          >
            {msg.role === "assistant" ? (
            // ✅ Parse le Markdown pour les messages assistant
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.content}
            </ReactMarkdown>
          ) : (
            msg.content
          )}
          </div>
        ))}

        {isLoading && (
          <div className={`${styles.messageBubble} ${styles.assistantBubble}`}>
            <span className={styles.loadingIndicator}>
              <span className={styles.pulse}>●</span>
              <span className={styles.loadingText}>Réflexion en cours...</span>
            </span>
          </div>
        )}

        {error && (
          <div className={`${styles.messageBubble} ${styles.assistantBubble}`}>
            <span className={styles.errorText}>{error}</span>
          </div>
        )}
      </div>

      <div className={styles.suggestionsContainer}>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className={styles.suggestionButton}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className={styles.inputContainer}>
        <input
          ref={inputRef}
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écrivez votre message..."
          className={styles.messageInput}
          disabled={isLoading}
          maxLength={1000}
        />
        <button
          onClick={() => 
            {
              console.log("=== BOUTON CLIQUÉ ===")
              console.log("currentMessage:", currentMessage)
              sendMessage()
            }}
          disabled={isLoading || !currentMessage.trim()}
          className={styles.sendButton}
        >
          Envoyer
        </button>
      </div>
    </div>
  )
}