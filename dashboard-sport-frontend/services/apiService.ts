export const loginUser = async (username: string, password: string) => {
  try{
    const response = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    })

    if (!response.ok) {
        const errorData = await response.json()
      throw new Error(errorData.message || "Erreur lors de la connexion")
    }

    const data = await response.json()
    return { token: data.token, userId: data.userId }
  } catch (error) {
    if (error instanceof Error) {
        throw error
    }
    throw new Error("Erreur lors de la connexion")
  }
}