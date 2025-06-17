"use client"

import { StrictMode, useState, useEffect } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import "./styleSheets/loading-screen.css"
import { createHashRouter, Navigate, RouterProvider } from "react-router-dom"
import { SummaryProvider } from "./context/SummaryContext.tsx"
import { UserProvider } from "./context/UserContext.tsx"
import UserMeetings from "./components/UserMeetings.tsx"
import HomePage from "./components/home-page.tsx"
import OAuthCallback from "./components/OAuthCallback.tsx"
import UserProfile from "./components/user-profile.tsx"
import LoadingScreen from "./components/loading-screen.tsx"
import FileUploadButton from "./components/FileUploadButton.tsx"
import MeetingDetail from "./components/UserMeetings.tsx"
import { ThemeProvider } from "./context/ThemeContext.tsx"

const routes = createHashRouter([
  {
    path: "/",
    element: <Navigate to="/home" />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/summary-up!",
    element: <FileUploadButton />,
  },
  {
    path: "/myMeetings",
    element: <UserMeetings />,
  },
  {
    path: "/meeting/:meetingId", // ← זה הroute החסר שהוספתי!
    element: <MeetingDetail />,
  },
  {
    path: "/my-profile",
    element: <UserProfile />,
  },
  {
    path: "/oauth",
    element: <OAuthCallback />,
  },
])

// קומפוננט ראשי עם לוגיקת מסך הטעינה
const App = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  useEffect(() => {
    // בדיקה אם זו הטעינה הראשונה (אין טוקן בסשן סטורג')
    const token = sessionStorage.getItem("token")

    if (token) {
      // אם יש טוקן או שהאפליקציה כבר נטענה, לא להציג מסך טעינה
      setIsLoading(false)
      setIsFirstLoad(false)
    }
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    setIsFirstLoad(false)
    // שמירה שהטעינה הראשונה הושלמה
  }

  if (isLoading && isFirstLoad) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <SummaryProvider>
      <UserProvider>
        <ThemeProvider>
          <StrictMode>
            <RouterProvider router={routes} />
          </StrictMode>
        </ThemeProvider>
      </UserProvider>
    </SummaryProvider>
  )
}

createRoot(document.getElementById("root")!).render(<App />)
