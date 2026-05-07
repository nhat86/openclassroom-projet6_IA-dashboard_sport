import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { AuthProvider } from "../context/AuthContext"
import "./globals.css"

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "SportSee",
  description: "Votre dashboard sportif personnalisé",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={geist.variable}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}