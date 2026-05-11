"use client"

import { useAuth } from "../hooks/useAuth"
import { useRouter } from "next/navigation"
import ChatModal from "./Chat/ChatModal/ChatModal"
import styles from "./Header.module.css"
import { UserInfo, ActivitySession } from "../types"

interface Props {
  userInfo: UserInfo
  activity: ActivitySession[]
}

export default function Header({ userInfo, activity }: Props) {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>📊</span>
        <span className={styles.logoText}>SPORTSEE</span>
      </div>
      <nav className={styles.nav}>
        <a className={styles.navLink} onClick={() => router.push("/dashboard")}>
          Dashboard
        </a>

        {/* ✅ passe les données au ChatModal */}
        <ChatModal userInfo={userInfo} activity={activity} />

        <a className={styles.navLink} onClick={() => router.push("/profil")}>
          Mon profil
        </a>
        <span className={styles.divider}>|</span>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Se déconnecter
        </button>
      </nav>
    </header>
  )
}