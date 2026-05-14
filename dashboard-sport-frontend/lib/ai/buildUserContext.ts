import { UserInfo, ActivitySession } from "@/types"

export function buildUserContext(
  userInfo: UserInfo,
  activity: ActivitySession[]
) {
  const { profile, statistics } = userInfo

  const totalCalories = activity.reduce(
    (sum, s) => sum + s.caloriesBurned,
    0
  )

  const avgHeartRate = activity.length > 0
    ? Math.round(
        activity.reduce(
          (sum, s) => sum + s.heartRate.average,
          0
        ) / activity.length
      )
    : 0

  const avgDistance = activity.length > 0
    ? parseFloat(
        (
          activity.reduce(
            (sum, s) => sum + s.distance,
            0
          ) / activity.length
        ).toFixed(1)
      )
    : 0

  const last10Sessions = [...activity]
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )
    .slice(0, 10)

  const last10Text = last10Sessions
    .map(
      (s, i) =>
        `${i + 1}. ${s.date} — ${s.distance}km en ${s.duration}min | BPM moy: ${s.heartRate.average}`
    )
    .join("\n")

  return `
Tu es un coach sportif IA expert.

--- PROFIL ---
Prénom : ${profile.firstName}
Âge : ${profile.age}

--- STATISTIQUES ---
Distance totale : ${statistics.totalDistance}
Calories : ${totalCalories}

--- PERFORMANCES ---
Distance moyenne : ${avgDistance}
BPM moyen : ${avgHeartRate}

--- 10 DERNIÈRES COURSES ---
${last10Text}
`.trim()
}