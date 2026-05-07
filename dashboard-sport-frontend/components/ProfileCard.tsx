import { UserInfo } from "../types"
import styles from "./ProfileCard.module.css"

interface Props {
  userInfo: UserInfo
}

export default function ProfileCard({ userInfo }: Props) {
  const { profile, statistics } = userInfo

  const memberSince = new Date(profile.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <img
          src={profile.profilePicture ?? "/images/default-avatar.png"}
          alt={`${profile.firstName} ${profile.lastName}`}
          className={styles.avatar}
        />
        <div className={styles.info}>
          <h2 className={styles.name}>
            {profile.firstName} {profile.lastName}
          </h2>
          <p className={styles.member}>
            Membre depuis le {memberSince}
          </p>
        </div>
      </div>
      <div className={styles.right}>
        <p className={styles.distanceLabel}>Distance totale parcourue</p>
        <div className={styles.distanceBadge}>
          <span className={styles.distanceIcon}>
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                <circle cx="24" cy="7" r="3" fill="white"/>
                <line x1="24" y1="10" x2="20" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="22" y1="15" x2="14" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="22" y1="15" x2="28" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="20" y1="22" x2="14" y2="30" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="20" y1="22" x2="26" y2="30" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="14" y1="30" x2="10" y2="34" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="26" y1="30" x2="30" y2="35" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </span>
          <span className={styles.distanceValue}>
            {statistics.totalDistance} km
          </span>
        </div>
      </div>
    </div>
  )
}