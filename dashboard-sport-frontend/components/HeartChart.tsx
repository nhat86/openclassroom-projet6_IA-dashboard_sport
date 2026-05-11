"use client"

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

import { ActivitySession } from "../types"
import styles from "./Chart.module.css"

interface Props {
  data: ActivitySession[]
}

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

// ======================================================
// Parse date locale sans bug timezone UTC
// ======================================================

const parseLocalDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split("-")

  return new Date(Number(y), Number(m) - 1, Number(d))
}

// ======================================================
// Retourne:
// 0 = lundi
// 1 = mardi
// ...
// 6 = dimanche
// ======================================================

const getDayIndex = (dateStr: string) => {
  const date = parseLocalDate(dateStr)

  const day = date.getDay()

  return day === 0 ? 6 : day - 1
}

// ======================================================
// Début de semaine (lundi)
// ======================================================

const startOfWeek = (date: Date) => {
  const d = new Date(date)

  const day = d.getDay()

  // JS:
  // dimanche = 0
  // lundi = 1

  const diff = day === 0 ? -6 : 1 - day

  d.setDate(d.getDate() + diff)

  d.setHours(0, 0, 0, 0)

  return d
}

export default function HeartChart({
  data
}: Props) {

  // ======================================================
  // Fenêtre:
  // 4 dernières semaines COMPLÈTES
  //
  // Exemple:
  // si aujourd'hui = mercredi
  // on exclut semaine actuelle
  // ======================================================

  const now = new Date()

  // lundi semaine actuelle
  const currentWeekStart = startOfWeek(now)

  // lundi il y a 4 semaines
  const fourWeeksAgo = new Date(currentWeekStart)

  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)
  const lastSunday = new Date(currentWeekStart)

  lastSunday.setDate(lastSunday.getDate() - 1)

  const formatter = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
  })

  const dateRange =
    `${formatter.format(fourWeeksAgo)} - ${formatter.format(lastSunday)}`
  // ======================================================
  // Filtrage
  // ======================================================

  const filtered = data.filter((session) => {
    const d = parseLocalDate(session.date)

    return d >= fourWeeksAgo && d < currentWeekStart
  })

  // ======================================================
  // Agrégation par jour
  // ======================================================

  const aggregated = Array.from({ length: 7 }, () => ({
    min: Infinity,
    max: -Infinity,
    avgSum: 0,
    count: 0,
  }))

  filtered.forEach((session) => {
    const idx = getDayIndex(session.date)

    const hr = session.heartRate

    aggregated[idx].min = Math.min(
      aggregated[idx].min,
      hr.min
    )

    aggregated[idx].max = Math.max(
      aggregated[idx].max,
      hr.max
    )

    aggregated[idx].avgSum += hr.average

    aggregated[idx].count += 1
  })

  // ======================================================
  // Format chart data
  // ======================================================

  const chartData = aggregated.map((d, i) => ({
    name: DAYS[i],

    min: d.count ? d.min : null,

    max: d.count ? d.max : null,

    avg: d.count
      ? Math.round(d.avgSum / d.count)
      : null,
  }))

  // ======================================================
  // BPM moyen global
  // ======================================================

  const weekAvgBPM =
    filtered.length > 0
      ? Math.round(
          filtered.reduce(
            (sum, s) =>
              sum + s.heartRate.average,
            0
          ) / filtered.length
        )
      : 0

  // ======================================================
  // Custom legend
  // ======================================================

  const renderLegend = (props: any) => {
    const { payload } = props

    if (!payload) return null

    return (
      <div className={styles.legendContainer}>
        {payload.map(
          (entry: any, index: number) => (
            <div
              key={index}
              className={styles.legendItem}
            >
              <span
                className={
                  entry.value === "Moyenne"
                    ? styles.legendLine
                    : styles.legendDot
                }
                style={{
                  backgroundColor: entry.color,
                }}
              />

              <span>{entry.value}</span>
            </div>
          )
        )}
      </div>
    )
  }

  // ======================================================
  // Empty state
  // ======================================================

  if (!filtered.length) {
    return (
      <div className={styles.card}>
        <div className={styles.empty}>
          Aucune donnée disponible
        </div>
      </div>
    )
  }

  return (
    <div className={styles.card}>

      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}

      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          <span className={styles.titleRed}>
            {weekAvgBPM} BPM
          </span>
        </h3>

        <div className={styles.dateRange}>
          <button className={styles.navBtn}>
            {"<"}
          </button>

          <span>{dateRange}</span>

          <button className={styles.navBtn}>
            {">"}
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* Subtitle */}
      {/* ================================================= */}

      <p className={styles.subtitle}>
        Moyenne par jour sur les 4 dernières
        semaines complètes
      </p>

      {/* ================================================= */}
      {/* Chart */}
      {/* ================================================= */}

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <ComposedChart
          data={chartData}
          barSize={17}
          barGap={2}
        >

          {/* Grid */}

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />

          {/* X axis */}

          <XAxis
            dataKey="name"
            tick={{
              fontSize: 12,
              fill: "#9ca3af",
            }}
          />

          {/* Y axis */}

          <YAxis
            tick={{
              fontSize: 12,
              fill: "#9ca3af",
            }}
            domain={["auto", "auto"]}
          />

          {/* Tooltip */}

          <Tooltip cursor={false} />

          {/* Legend */}

          <Legend content={renderLegend} />

          {/* Min BPM */}

          <Bar
            dataKey="min"
            name="Min"
            fill="#FFBBBB"
            radius={[10, 10, 10, 10]}
          />

          {/* Max BPM */}

          <Bar
            dataKey="max"
            name="Max BPM"
            fill="#FF0000"
            radius={[10, 10, 10, 10]}
          />

          {/* Average BPM */}

          <Line
            type="monotone"
            dataKey="avg"
            name="Moyenne"
            stroke="#0000FF"
            strokeWidth={2}
            dot={false}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}