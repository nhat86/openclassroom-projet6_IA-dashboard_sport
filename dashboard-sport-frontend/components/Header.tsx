"use client"

import { useAuth } from "../hooks/useAuth"
import { useRouter } from "next/navigation"
import styles from "./Header.module.css"

export default function Header() {
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
        <a className={styles.navLink}>Dashboard</a>
        <a className={styles.navLink}>Coach AI</a>
        <a className={styles.navLink}>Mon profil</a>
        <span className={styles.divider}>|</span>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Se déconnecter
        </button>
      </nav>
    </header>
  )
}