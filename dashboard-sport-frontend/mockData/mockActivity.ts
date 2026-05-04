import { ActivitySession } from "../types"

export const mockActivity: ActivitySession[] = [
  {
    date: "2025-01-01",
    day: "mer.",
    distance: 6.2,
    duration: 42,
    heartRate: { min: 135, max: 172, average: 158 },
    caloriesBurned: 460
  },
  {
    date: "2025-01-02",
    day: "jeu.",
    distance: 4.1,
    duration: 27,
    heartRate: { min: 142, max: 175, average: 162 },
    caloriesBurned: 310
  },
  {
    date: "2025-01-03",
    day: "ven.",
    distance: 7.3,
    duration: 48,
    heartRate: { min: 138, max: 180, average: 165 },
    caloriesBurned: 530
  },
  {
    date: "2025-01-04",
    day: "sam.",
    distance: 5.8,
    duration: 38,
    heartRate: { min: 140, max: 178, average: 163 },
    caloriesBurned: 422
  },
  {
    date: "2025-01-05",
    day: "dim.",
    distance: 3.2,
    duration: 20,
    heartRate: { min: 148, max: 184, average: 171 },
    caloriesBurned: 248
  },
  {
    date: "2025-01-06",
    day: "lun.",
    distance: 8.0,
    duration: 52,
    heartRate: { min: 136, max: 176, average: 160 },
    caloriesBurned: 580
  },
  {
    date: "2025-01-07",
    day: "mar.",
    distance: 4.7,
    duration: 31,
    heartRate: { min: 143, max: 179, average: 166 },
    caloriesBurned: 345
  }
]