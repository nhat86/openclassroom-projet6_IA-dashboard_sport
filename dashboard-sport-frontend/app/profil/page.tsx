"use client"

import { useAuth } from "../../hooks/useAuth"
import { useInfo } from "../../hooks/useInfo"
import { useActivity } from "../../hooks/useActivity"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import styles from "./profil.module.css"

export default function ProfilPage() {
  const { token } = useAuth()
  const currentDate = new Date().toISOString().split('T')[0]
  const { data: userInfo, loading: userLoading } = useInfo(token)
  const { data: activity, loading: actLoading } = useActivity(
    token,
    "2025-01-01",
    currentDate
  )

  if (userLoading || actLoading) {
    return <div className={styles.loading}>Chargement...</div>
  }

  if (!userInfo || !activity) {
    return <div className={styles.loading}>Erreur de chargement.</div>
  }

  const { profile, statistics } = userInfo
  // gender
  const genderMap: Record<string, string> = {
    male: "Homme",
    female: "Femme",
    other: "Autre",
    }
  // Calculs depuis activity
  const totalCalories = activity.reduce((sum, s) => sum + s.caloriesBurned, 0)
  const totalSessions = activity.length
  // ✅ Jours de repos = jours depuis membre - nombre de sessions
  const MS_PER_DAY = 24 * 60 * 60 * 1000
  const memberDate = new Date(profile.createdAt)
  const today = new Date()
  const totalDays = Math.floor((today.getTime() - memberDate.getTime()) / MS_PER_DAY)
  const restDays = Math.max(0, totalDays - totalSessions)

  // Formatage date membre
  const memberSince = new Date(profile.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  // Formatage durée totale
  const totalHours = Math.floor(statistics.totalDuration / 60)
  const totalMinutes = statistics.totalDuration % 60

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.grid}>

          {/* Colonne gauche */}
          <div className={styles.leftCol}>

            {/* Card identité */}
            <div className={styles.card}>
              <img
                src={profile.profilePicture ?? "/images/default-avatar.png"}
                alt={profile.firstName}
                className={styles.avatar}
              />
              <div className={styles.identity}>
                <h2 className={styles.name}>
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className={styles.memberSince}>
                  Membre depuis le {memberSince}
                </p>
              </div>
            </div>

            {/* Card profil */}
            <div className={styles.card}>
              <h3 className={styles.profileTitle}>Votre profil</h3>
              <hr className={styles.divider}/>
              <ul className={styles.profileList}>
                <li>Âge : {profile.age}</li>
                <li>Genre: {genderMap[profile.gender] || profile.gender}</li>
                <li>Taille : {profile.height ? `${(profile.height / 100).toFixed(2).replace(".", "m")}` : "—"}</li>
                <li>Poids : {profile.weight}kg</li>
              </ul>
            </div>

          </div>

          {/* Colonne droite — statistiques */}
          <div className={styles.rightCol}>
            <h2 className={styles.statsTitle}>Vos statistiques</h2>
            <p className={styles.statsSince}>depuis le {memberSince}</p>

            <div className={styles.statsGrid}>

              <div className={styles.statCard}>
                <p className={styles.statLabel}>Temps total couru</p>
                <p className={styles.statValue}>
                  {totalHours}h
                  <span className={styles.statUnit}> {totalMinutes}min</span>
                </p>
              </div>

              <div className={styles.statCard}>
                <p className={styles.statLabel}>Calories brûlées</p>
                <p className={styles.statValue}>
                  {totalCalories.toLocaleString("fr-FR")}
                  <span className={styles.statUnit}> cal</span>
                </p>
              </div>

              <div className={styles.statCard}>
                <p className={styles.statLabel}>Distance totale parcourue</p>
                <p className={styles.statValue}>
                  {statistics.totalDistance}
                  <span className={styles.statUnit}> km</span>
                </p>
              </div>

              <div className={styles.statCard}>
                <p className={styles.statLabel}>Nombre de jours de repos</p>
                <p className={styles.statValue}>
                  {restDays}
                  <span className={styles.statUnit}> jours</span>
                </p>
              </div>

              <div className={styles.statCard}>
                <p className={styles.statLabel}>Nombre de sessions</p>
                <p className={styles.statValue}>
                  {totalSessions}
                  <span className={styles.statUnit}> sessions</span>
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}