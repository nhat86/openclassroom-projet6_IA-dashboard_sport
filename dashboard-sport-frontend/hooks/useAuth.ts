//permet à n'importe quel composant d'accéder facilement au Context d'authentification
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider")
  }

  return context
}