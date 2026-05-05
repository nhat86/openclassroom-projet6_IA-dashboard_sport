"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../hooks/useAuth"
import { loginUser } from "../../services/apiService"
import styles from "./login.module.css"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { token, userId } = await loginUser(username, password)
      login(token, userId)
      router.push("/dashboard")
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Erreur inconnue lors de la connexion")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>

      {/* Panneau gauche */}
      <div className={styles.leftPanel}>

        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoIcon}>📊</span>
          <span className={styles.logoText}>Sportsee</span>
        </div>

        {/* Carte formulaire */}
        <div className={styles.card}>
          <h1 className={styles.tagline}>
            Transformez<br />vos stats en résultats
          </h1>

          <h2 className={styles.formTitle}>Se connecter</h2>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Adresse email</label>
              <input
                className={styles.input}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder=""
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Mot de passe</label>
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
              />
            </div>

            {error && (
              <div className={styles.error}>⚠️ {error}</div>
            )}

            <button
              className={styles.button}
              type="submit"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>

            <button type="button" className={styles.forgotPassword}>
              Mot de passe oublié ?
            </button>
          </form>
        </div>
      </div>

      {/* Panneau droit — photo */}
      <div className={styles.rightPanel}>
        <img
          src="/images/marathon.jpg"
          alt="Marathon"
          className={styles.photo}
        />
      </div>

    </div>
  )
}