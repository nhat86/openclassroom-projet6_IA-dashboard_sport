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
  const sendMessage = async (message?: string) => {
    const msg = message || currentMessage
    if (!msg.trim() || isLoading) return
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
          history: messages ,
          userInfo,
          activity                 
        }),
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`)
      }

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }])

    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.")
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