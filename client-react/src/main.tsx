"use client"

import { StrictMode, useState, useEffect } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import "./styleSheets/loading-screen.css" // ייבוא CSS של מסך הטעינה
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import MainScreen from "./components/MainScreen.tsx"
import { SummaryProvider } from "./context/SummaryContext.tsx"
import { UserProvider } from "./context/UserContext.tsx"
import UserMeetings from "./components/UserMeetings.tsx"
import HomePage from "./components/home-page.tsx"
import OAuthCallback from "./components/OAuthCallback.tsx"
import LoadingScreen from "./components/loading-screen.tsx"

// הגדרת הנתיבים
const routes = createBrowserRouter([
  {
    path: "/", // דף הבית הראשי
    element: <Navigate to="/home" />, // הפניה אוטומטית ל-home
  },
  {
    path: "/home", // דף הבית
    element: <HomePage />, // קומפוננטת Home
  },
  {
    path: "/summary-up!", // דף הבית
    element: <MainScreen />, // קומפוננטת Dashboard
  },
  {
    path: "/myMeetings", // דף הבית
    element: <UserMeetings />, // קומפוננטת Dashboard
  },
  // {
  //   path: "/AiSummary", // דף הבית
  //   element: <UserProvider  />,
  // },
  
  { path: "/oauth", element: <OAuthCallback /> }, // דף הבית
])

// קומפוננט ראשי עם לוגיקת מסך הטעינה
const App = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // בדיקה אם יש טוקן בסשן סטורג'
    const token = sessionStorage.getItem("token")

    if (!token) {
      // אם אין טוקן - זה ביקור ראשון, הצג מסך טעינה למשך 5 שניות
      const timer = setTimeout(() => {
        setIsLoading(false)
        // שמירת טוקן כדי שלא יוצג שוב
        sessionStorage.setItem("token", "visited")
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

  // אחרי הטעינה - הצג את האפליקציה הרגילה
  return (
    <SummaryProvider>
      <UserProvider>
        <StrictMode>
          <RouterProvider router={routes} />
        </StrictMode>
      </UserProvider>
    </SummaryProvider>
  )
}

createRoot(document.getElementById("root")!).render(<App />)
