"use client"

import { useState, useEffect } from "react"
import ChatBox from "../ChatBox/ChatBox"
import styles from "./ChatModal.module.css"
import { UserInfo, ActivitySession } from "../../../types"

interface Props {
  userInfo: UserInfo
  activity: ActivitySession[]
}

export default function ChatModal({ userInfo, activity }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  return (
    <>
      {/* Bouton "Coach AI" dans la navbar */}
      <a onClick={openModal} className={styles.navLink}>
        Coach AI
      </a>

      {/* Overlay de la modale */}
      {isOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={handleModalClick}>
            {/* ✅ passe les données au ChatBox */}
            <ChatBox userInfo={userInfo} activity={activity} />
          </div>
        </div>
      )}
    </>
  )
}