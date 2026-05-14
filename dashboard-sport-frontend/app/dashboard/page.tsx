"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useInfo } from "../../hooks/useInfo";
import { useActivity } from "../../hooks/useActivity";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProfileCard from "../../components/ProfileCard";
import ActivityChart from "../../components/ActivityChart";
import HeartChart from "../../components/HeartChart";
import WeekStats from "../../components/WeekStats";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const router = useRouter();
  const { token } = useAuth();

  const currentDate = new Date().toISOString().split("T")[0];

  const { data: userInfo, loading: userLoading } = useInfo(token);
  const { data: activity, loading: actLoading } = useActivity(
    token,
    "2025-01-01",
    currentDate
  );

  // ✅ 1. REDIRECT AUTH (HOOKS EN HAUT)
  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  // ✅ 2. LOADING STATE
  if (userLoading || actLoading) {
    return (
      <div className={styles.loading}>
        <p>Chargement...</p>
      </div>
    );
  }

  // ✅ 3. ERROR STATE
  if (!userInfo || !activity) {
    return (
      <div className={styles.loading}>
        <p>Erreur de chargement des données.</p>
      </div>
    );
  }

  // ✅ 4. UI NORMAL
  return (
    <div className={styles.page}>
      <Header userInfo={userInfo} activity={activity} />

      <main className={styles.main}>
        <div className={styles.aiBanner}>
          <p className={styles.aiText}>
            ✦ Posez vos questions sur votre programme, vos performances ou vos objectifs.
          </p>
          <button className={styles.aiBtn}>Lancer une conversation</button>
        </div>

        <ProfileCard userInfo={userInfo} />

        <h2 className={styles.sectionTitle}>
          Vos dernières performances
        </h2>

        <div className={styles.chartsRow}>
          <ActivityChart data={activity} />
          <HeartChart data={activity} />
        </div>

        <WeekStats
          data={activity}
          goal={userInfo.profile.goal}
        />
      </main>

      <Footer />
    </div>
  );
}