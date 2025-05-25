"use client"
import { useState, useEffect } from "react"
import HomePage from "./components/home-page"
import "./styleSheets/App.css"
import { GoogleOAuthProvider } from "@react-oauth/google"
import LoadingScreen from "./components/loading-screen"

const App = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // בדיקה אם יש טוקן בסשן סטורג'
    const token = sessionStorage.getItem("token")

    if (!token) {
      // אם אין טוקן - זה ביקור ראשון, הצג מסך טעינה למשך 5 שניות
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 5000)

      return () => clearTimeout(timer)
    } else {
      // אם יש טוקן - הצג ישירות את התוכן
      setIsLoading(false)
    }
  }, [])

  // אם עדיין בטעינה - הצג את מסך הטעינה
  if (isLoading) {
    return <LoadingScreen />
  }

  // אחרי הטעינה - הצג את עמוד הבית
  return (
    <GoogleOAuthProvider clientId="656531420385-nnep8t03os9k5pm2ccq6nncftv0subva.apps.googleusercontent.com">
      <>
        <HomePage />
      </>
    </GoogleOAuthProvider>
  )
}

export default App
