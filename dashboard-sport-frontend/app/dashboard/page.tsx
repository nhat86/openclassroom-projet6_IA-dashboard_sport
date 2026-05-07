"use client"

import { useAuth } from "../../hooks/useAuth"
import { useInfo } from "../../hooks/useInfo"
import { useActivity } from "../../hooks/useActivity"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import ProfileCard from "../../components/ProfileCard"
import ActivityChart from "../../components/ActivityChart"
import HeartRateChart from "../../components/HeartChart"
import WeekStats from "../../components/WeekStats"
import styles from "./dashboard.module.css"

export default function DashboardPage() {
  const { token } = useAuth()
  const currentDate = new Date().toISOString().split('T')[0]
  const { data: userInfo, loading: userLoading } = useInfo(token)
  const { data: activity, loading: actLoading } = useActivity(
    token,
    "2025-01-01",
    currentDate
  )

  if (userLoading || actLoading) {
    return (
      <div className={styles.loading}>
        <p>Chargement...</p>
      </div>
    )
  }

  if (!userInfo || !activity) {
    return (
      <div className={styles.loading}>
        <p>Erreur de chargement des données.</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        {/* Bandeau AI */}
        <div className={styles.aiBanner}>
          <p className={styles.aiText}>
            ✦ Posez vos questions sur votre programme, vos performances ou vos objectifs.
          </p>
          <button className={styles.aiBtn}>Lancer une conversation</button>
        </div>

        {/* Profil */}
        <ProfileCard userInfo={userInfo} />

        {/* Dernières performances */}
        <h2 className={styles.sectionTitle}>Vos dernières performances</h2>
        <div className={styles.chartsRow}>
          <ActivityChart
            data={activity}
          />
          
        </div>

        {/* Cette semaine */}
        <WeekStats
          data={activity}
        />
      </main>

      <Footer/>
    </div>
  )
}