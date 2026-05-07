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
  ResponsiveContainer
} from "recharts"

import { ActivitySession } from "../types"
import styles from "./Chart.module.css"

interface Props {
  data: ActivitySession[]
  dateRange: string
}

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

// ✅ Parse ISO sans bug UTC
const parseLocalDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split("-")
  return new Date(Number(y), Number(m) - 1, Number(d))
}

// ✅ Jour de semaine stable (0 = Lun ... 6 = Dim)
const getDayIndex = (dateStr: string) => {
  const date = parseLocalDate(dateStr)
  const day = date.getDay()
  return day === 0 ? 6 : day - 1
}

export default function HeartRateChart({ data, dateRange }: Props) {

  // ✅ Filtrer sur 4 dernières semaines
  const now = new Date()
  const fourWeeksAgo = new Date()
  fourWeeksAgo.setDate(now.getDate() - 28)

  const filtered = data.filter((session) => {
    const d = parseLocalDate(session.date)
    return d >= fourWeeksAgo && d <= now
  })

  // ✅ Agrégation par jour
  const aggregated = Array.from({ length: 7 }, () => ({
    min: Infinity,
    max: -Infinity,
    avgSum: 0,
    count: 0,
  }))

  filtered.forEach((session) => {
    const idx = getDayIndex(session.date)
    const hr = session.heartRate

    aggregated[idx].min = Math.min(aggregated[idx].min, hr.min)
    aggregated[idx].max = Math.max(aggregated[idx].max, hr.max)
    aggregated[idx].avgSum += hr.average
    aggregated[idx].count += 1
  })

  // ✅ Format pour le chart
  const chartData = aggregated.map((d, i) => ({
    name: DAYS[i],
    min: d.count ? d.min : 0,
    max: d.count ? d.max : 0,
    avg: d.count ? Math.round(d.avgSum / d.count) : 0,
  }))

  // ✅ Moyenne globale
  const weekAvgBPM =
    filtered.length > 0
      ? Math.round(
          filtered.reduce((sum, s) => sum + s.heartRate.average, 0) /
          filtered.length
        )
      : 0

  const renderLegend = (props: any) => {
    const { payload } = props
    if (!payload) return null

    return (
      <div className={styles.legendContainer}>
        {payload.map((entry: any, index: number) => (
          <div key={index} className={styles.legendItem}>
            <span
              className={
                entry.value === "Moyenne"
                  ? styles.legendLine
                  : styles.legendDot
              }
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          <span className={styles.titleRed}>{weekAvgBPM} BPM</span>
        </h3>

        <div className={styles.dateRange}>
          <button className={styles.navBtn}>{"<"}</button>
          <span>{dateRange}</span>
          <button className={styles.navBtn}>{">"}</button>
        </div>
      </div>

      <p className={styles.subtitle}>
        Moyenne par jour sur les 4 dernières semaines
      </p>

      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={chartData} barSize={17} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>

          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#9ca3af" }}
          />

          <YAxis
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            domain={["auto", "auto"]}
          />

          <Tooltip cursor={false} />
          <Legend content={renderLegend}/>

          <Bar dataKey="min" name="Min" fill="#FFBBBB" radius={[10,10,10,10]}/>
          <Bar dataKey="max" name="Max BPM" fill="#FF0000" radius={[10,10,10,10]}/>
          <Line type="monotone" dataKey="avg" name="Moyenne" stroke="#0000FF" strokeWidth={2} dot={false}/>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}