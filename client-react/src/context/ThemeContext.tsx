"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface ThemeContextType {
  darkMode: boolean
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false)

  // טעינת העדפת המשתמש מ-localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme !== null) {
      setDarkMode(savedTheme === "true")
    } else {
      setDarkMode(prefersDark)
    }
  }, [])

  // עדכון ה-DOM וה-localStorage כשהמצב משתנה
  useEffect(() => {
    const header = document.querySelector(".dashboard-header")

    if (darkMode) {
      document.body.classList.add("dark-mode")
      document.documentElement.classList.add("dark-mode")
      if (header) {
        header.classList.add("dark-mode")
      }
    } else {
      document.body.classList.remove("dark-mode")
      document.documentElement.classList.remove("dark-mode")
      if (header) {
        header.classList.remove("dark-mode")
      }
    }

    localStorage.setItem("darkMode", darkMode.toString())
  }, [darkMode])

  // האזנה לשינויים בהעדפות המערכת
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = (e: MediaQueryListEvent) => {
      // רק אם המשתמש לא הגדיר העדפה ידנית
      const savedTheme = localStorage.getItem("darkMode")
      if (savedTheme === null) {
        setDarkMode(e.matches)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
  }

  const value = {
    darkMode,
    toggleDarkMode,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
