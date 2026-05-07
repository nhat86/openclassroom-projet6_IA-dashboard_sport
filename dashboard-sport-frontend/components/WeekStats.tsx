"use client"

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ActivitySession } from "../types"
import styles from "./WeekStats.module.css"

interface Props {
  data: ActivitySession[]
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

const formatDate = (date: Date): string =>
  date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })

const getCurrentWeekSessions = (data: ActivitySession[]) => {
  const today = new Date()
  today.setHours(23, 59, 59, 999)

  // Même logique que ActivityChart — trouve le lundi actuel
  const dayOfWeek = today.getDay()
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

  const monday = new Date(
    new Date(today.getTime() + diffToMonday * MS_PER_DAY).setHours(0, 0, 0, 0)
  )
  const sunday = new Date(monday.getTime() + 6 * MS_PER_DAY)
  sunday.setHours(23, 59, 59, 999)

  // Filtre les sessions de la semaine actuelle
  // Équivalent avec forEach
const sessions: ActivitySession[] = []

data.forEach((session) => {
  const d = new Date(session.date)
  d.setHours(0, 0, 0, 0) // ignore l'heure pour la comparaison
  console.log("session date:", d.toISOString())
  console.log("monday:", monday.toISOString())
  console.log("today:", today.toISOString())
  console.log("d >= monday:", d >= monday)
  console.log("d <= today:", d <= today)
  if (d >= monday && d <= today) {
    sessions.push(session) 
  }
})
console.log("Sessions de la semaine", sessions)
console.log("Lundi", formatDate(monday), "Aujourd'hui", formatDate(today))

  return { sessions, monday, sunday }
}

export default function WeekStats({ data }: Props) {

  const { sessions, monday, sunday } = getCurrentWeekSessions(data)

  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0)
  const totalDistance = parseFloat(
    sessions.reduce((sum, s) => sum + s.distance, 0).toFixed(1)
  )
  const sessionsCount = sessions.length
  const goal = 6
  const remaining = Math.max(0, goal - sessionsCount)

  const weekRange = `Du ${formatDate(monday)} au ${formatDate(sunday)}`

  const donutData = [
    { name: `${sessionsCount} réalisées`, value: sessionsCount },
    { name: `${remaining} restants`, value: remaining > 0 ? remaining : 0.01 }, // évite donut vide
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null

    const item = payload[0]
    let content = `${item.value} sessions`

    if (item.name.includes("réalisées")) {
      const dates = sessions.map(s => formatDate(new Date(s.date))).join(", ")
      content += `\nDates: ${dates}`
    }

    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltipValue}>{content}</div>
      </div>
    )
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Cette semaine</h2>
      <p className={styles.sectionDate}>{weekRange}</p>

      <div className={styles.grid}>
        {/* Donut Card */}
        <div className={styles.card}>
          <p className={styles.donutTitle}>
            <span className={styles.blue}>x{sessionsCount}</span>
            {" "}sur objectif de {goal}
          </p>
          <p className={styles.donutSubtitle}>Courses hebdomadaire réalisées</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                <Cell fill="#0000FF"/>
                <Cell fill="#C7C7F0"/>
              </Pie>
              <Legend
                formatter={(value) => (
                  <span style={{ color: "#9ca3af", fontSize: "12px" }}>{value}</span>
                )}
              />
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsCol}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Durée d'activité</p>
            <p className={styles.statValue}>
              <span className={styles.blue}>{totalDuration}</span>
              {" "}
              <span className={styles.statUnit}>minutes</span>
            </p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Distance</p>
            <p className={styles.statValue}>
              <span className={styles.red}>{totalDistance}</span>
              {" "}
              <span className={styles.statUnit}>kilomètres</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}