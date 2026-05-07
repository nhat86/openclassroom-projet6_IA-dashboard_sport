import styles from "./Footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>©Sportsee Tous droits réservés</span>
      <div className={styles.footerLinks}>
        <a>Conditions générales</a>
        <a>Contact</a>
        <span>📊</span>
      </div>
    </footer>
  )
}