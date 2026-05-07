"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  Cell,
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
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

const formatTooltipDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  return `${day}.${month}`
}

const formatDate = (date: Date): string =>
  date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })

const computeWeeklyStats = (data: ActivitySession[]) => {
  const today = new Date()

  // Trouve le lundi de la semaine actuelle
  const dayOfWeek = today.getDay()
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const thisMonday = new Date(today.getTime() + diffToMonday * MS_PER_DAY)

  // 4 semaines passées — S1 = il y a 3 semaines, S4 = semaine dernière
  const weekStarts = [
    new Date(new Date(thisMonday.getTime() - 28 * MS_PER_DAY).setHours(0, 0, 0, 0)), 
    new Date(new Date(thisMonday.getTime() - 21 * MS_PER_DAY).setHours(0, 0, 0, 0)), 
    new Date(new Date(thisMonday.getTime() - 14 * MS_PER_DAY).setHours(0, 0, 0, 0)), 
    new Date(new Date(thisMonday.getTime() -  7 * MS_PER_DAY).setHours(0, 0, 0, 0)), 
  ]
  // initialise les 4 semaines
  const weeklyData = [
    { name: "S1", km: 0, range: "" },
    { name: "S2", km: 0, range: "" },
    { name: "S3", km: 0, range: "" },
    { name: "S4", km: 0, range: "" },
  ]

  // Étape 4 — grouper chaque session dans sa semaine
  data.forEach((session) => {
    const sessionDate = new Date(session.date)

    for (let i = 0; i < 4; i++) {
      const start = weekStarts[i]
      const end = new Date(start.getTime() + 6 * MS_PER_DAY)
      end.setHours(23, 59, 59, 999)
      if (sessionDate >= start && sessionDate <= end) {
        weeklyData[i].km += session.distance
        break
      }
    }
  })

  // Étape 5 — arrondir et ajouter la plage de dates de chaque semaine
  const weeks = weeklyData.map((w, i) => {
    const start = weekStarts[i]
    const end = new Date(start.getTime() + 6 * MS_PER_DAY)

    return {
      ...w,
      km: parseFloat(w.km.toFixed(1)),
      range: `${formatTooltipDate(start)} au ${formatTooltipDate(end)}`
    }
  })

  // Étape 6 — moyenne des 4 semaines
  const totalKm = weeks.reduce((sum, w) => sum + w.km, 0)
  const averageKm = parseFloat((totalKm / 4).toFixed(1))

  // Étape 7 — date début S1 et date fin S4
  const startDate = formatDate(weekStarts[0])
  const endDate = formatDate(new Date(thisMonday.getTime() - MS_PER_DAY))

  return { weeks, averageKm, startDate, endDate }
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: { km: number; range: string } }>
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null

  const item = payload[0].payload

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipLabel}>{item.range}</div>
      <div className={styles.tooltipValue}>{item.km} km</div>
    </div>
  )
}

const renderLegend = (props: any) => {
  const { payload } = props
  if (!payload || payload.length === 0) return null

  return (
    <div className={styles.legendContainer}>
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className={styles.legendItem}>
          <span
            className={styles.legendDot}
            style={{ backgroundColor: entry.color || "#C7C7F0" }}
          />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function ActivityChart({ data }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const { weeks, averageKm, startDate, endDate } = computeWeeklyStats(data)

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>

        {/* Titre avec moyenne calculée */}
        <h3 className={styles.cardTitle}>
          <span>{averageKm}km</span> en moyenne
        </h3>

        {/* Date range calculé automatiquement */}
        <div className={styles.dateRange}>
          <button className={styles.navBtn}>{"<"}</button>
          <span>{startDate} - {endDate}</span>
          <button className={styles.navBtn}>{">"}</button>
        </div>

      </div>
      <div className={styles.description}>
        Total des kilomettres 4 dernierres semaines
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={weeks} barSize={17}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
          <XAxis
            dataKey="name"
            axisLine={true}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
          />
          <YAxis
            axisLine={true}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Legend content={renderLegend} />
          <Bar
            dataKey="km"
            name="Km"
            radius={[10, 10, 10, 10]}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {weeks.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === activeIndex ? "#0000FF" : "#C7C7F0"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}