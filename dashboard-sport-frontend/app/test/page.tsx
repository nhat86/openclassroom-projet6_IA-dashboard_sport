import { mockUserInfo } from "../../mockData/mockUserInfo"
import { mockActivity } from "../../mockData/mockActivity"
import { normalizeUserInfo, normalizeActivity } from "../../services/dataMapper"

export default function TestPage() {
  // Test normalizeUserInfo avec les mocks
  const userInfo = normalizeUserInfo(mockUserInfo)
  
  // Test normalizeActivity avec les mocks
  const activity = normalizeActivity(mockActivity)

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>🧪 Page de test</h1>

      <h2>✅ UserInfo normalisé</h2>
      <pre>{JSON.stringify(userInfo, null, 2)}</pre>

      <h2>✅ Activity normalisée</h2>
      <pre>{JSON.stringify(activity, null, 2)}</pre>
    </div>
  )
}