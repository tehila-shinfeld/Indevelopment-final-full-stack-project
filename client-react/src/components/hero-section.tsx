"use client"

import type React from "react"

import { useEffect, useState } from "react"
import "../styleSheets/hero-section.css"
import { AnimatePresence, motion } from "framer-motion"

interface HeroSectionProps {
  sectionRef: React.RefObject<HTMLElement>
  isVisible: boolean
  openModal: () => void
}

export default function HeroSection({ sectionRef, isVisible, openModal }: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeUsers, setActiveUsers] = useState(0)
  const [satisfactionRate, setSatisfactionRate] = useState(0)
  const [hoursSaved, setHoursSaved] = useState(0)
  const [isDocumentEnlarged, setIsDocumentEnlarged] = useState(false)
  // Toast state
  const [toast, setToast] = useState({ visible: false, message: "", type: "" })

  // Handle counter animation
  useEffect(() => {
    if (isVisible && isLoaded) {
      const duration = 2000 // 2 seconds for the animation
      const steps = 60 // Number of steps (for smoother animation)
      const interval = duration / steps

      const targetValues = {
        activeUsers: 5000,
        satisfactionRate: 98,
        hoursSaved: 30,
      }

      let step = 0

      const timer = setInterval(() => {
        step++
        const progress = step / steps

        // Easing function for smoother animation
        const easeOutQuad = (t: number) => t * (2 - t)
        const easedProgress = easeOutQuad(progress)

        setActiveUsers(Math.round(easedProgress * targetValues.activeUsers))
        setSatisfactionRate(Math.round(easedProgress * targetValues.satisfactionRate))
        setHoursSaved(Math.round(easedProgress * targetValues.hoursSaved))

        if (step >= steps) {
          clearInterval(timer)
          setActiveUsers(targetValues.activeUsers)
          setSatisfactionRate(targetValues.satisfactionRate)
          setHoursSaved(targetValues.hoursSaved)
        }
      }, interval)

      return () => clearInterval(timer)
    }
  }, [isVisible, isLoaded])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Auto-hide toast after duration
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }))
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [toast.visible])

  // Show toast notification
  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ visible: true, message, type })
  }

  // Handle document click to toggle enlarged view
  const toggleDocumentEnlarged = () => {
    setIsDocumentEnlarged(!isDocumentEnlarged)
  }

  // Close enlarged view when clicking outside
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDocumentEnlarged(false)
    }
  }

  // Handle start button click - check for token in session storage
  const handleStartButtonClick = () => {
    // Check if there's a valid token in session storage
    const token = sessionStorage.getItem("token")

    if (!token) {
      // If no token exists, open the login modal
      openModal()
      return
    }

    try {
      // Basic validation for JWT tokens
      const tokenParts = token.split(".")

      // Check if token has the correct format (header.payload.signature)
      if (tokenParts.length !== 3) {
        throw new Error("פורמט טוקן לא תקין")
      }

      // Decode the payload
      const payload = JSON.parse(atob(tokenParts[1]))

      // Check if token is expired
      if (payload.exp && payload.exp < Date.now() / 1000) {
        throw new Error("הטוקן פג תוקף, אנא התחבר מחדש")
      }

      // If we got here, token is valid - redirect to next page
      window.location.href = "/myMeetings" // Replace with your actual next page URL
    } catch (error) {
      // Show error message to user
      const errorMessage = error instanceof Error ? error.message : "טוקן לא תקין, אנא התחבר מחדש"

      // Display toast notification
      showToast(errorMessage, "error")

      // Clear the invalid token
      sessionStorage.removeItem("token")

      // Open the login modal
      setTimeout(() => {
        openModal()
      }, 1500) // Give user time to read the error message
    }
  }

  // Get toast icon based on type
  const getToastIcon = (type: string) => {
    switch (type) {
      case "success":
        return (
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case "error":
        return (
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      case "info":
      default:
        return (
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
    }
  }

  return (
    <section ref={sectionRef} id="hero" className={`hero-section ${isVisible ? "visible" : ""}`}>
      {/* Background elements with parallax effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-blob-1 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-blob-2 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/3 animate-pulse-slow"></div>
      </div>

      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="badge"
            >
              <span className="badge-text">חדש לגמרי</span>
              <svg
                className="badge-icon"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3l1.67 5.13h5.4l-4.37 3.18 1.67 5.13-4.37-3.18-4.37 3.18 1.67-5.13-4.37-3.18h5.4z" />
              </svg>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hero-title"
            >
              תנו ל־
              <span className="gradient-text">בינה מלאכותית</span> לסכם לכם את הפגישה
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hero-description"
            >
              העלו תמלול – ותקבלו סיכום ברור, מקצועי ומוכן לשיתוף.
              <br />
              מושלם לצוותים, סטארטאפים, ולכל מי שלא אוהב לבזבז זמן.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <button className="hero-button" onClick={handleStartButtonClick}>
                <span className="button-text">התחילו עכשיו</span>
                <svg
                  className="button-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                </svg>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="hero-stats"
            >
              <div className="stat-item">
                <div className="stat-value">+{activeUsers.toLocaleString()}</div>
                <div className="stat-label">משתמשים פעילים</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-value">{satisfactionRate}%</div>
                <div className="stat-label">שביעות רצון</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-value">{hoursSaved}+</div>
                <div className="stat-label">שעות נחסכות בחודש</div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-image"
          >
            <div
              className="document-preview"
              onClick={toggleDocumentEnlarged}
              role="button"
              tabIndex={0}
              aria-label="לחץ להגדלת המסמך"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  toggleDocumentEnlarged()
                }
              }}
            >
              <div className="document-glow"></div>
              <div className="document-card">
                <div className="document-header">
                  <div className="document-controls">
                    <div className="control-dot red"></div>
                    <div className="control-dot yellow"></div>
                    <div className="control-dot green"></div>
                  </div>
                  <div className="document-title">TalkToMe.AI</div>
                </div>
                <div className="document-content">
                  <div className="content-header"></div>
                  <div className="content-lines">
                    <div className="content-line" style={{ animationDelay: "0.2s" }}></div>
                    <div className="content-line" style={{ animationDelay: "0.4s" }}></div>
                    <div className="content-line short" style={{ animationDelay: "0.6s" }}></div>
                  </div>
                  <div className="content-action">
                    <div className="action-button" style={{ animationDelay: "0.8s" }}></div>
                  </div>
                </div>
              </div>
              <div className="document-zoom-hint">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enlarged document overlay */}
      <AnimatePresence>
        {isDocumentEnlarged && (
          <motion.div
            className="document-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
          >
            <motion.div
              className="document-enlarged"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="document-header">
                <div className="document-controls">
                  <div className="control-dot red"></div>
                  <div className="control-dot yellow"></div>
                  <div className="control-dot green"></div>
                </div>
                <div className="document-title">TalkToMe.AI</div>
                <button
                  className="document-close-button"
                  onClick={() => setIsDocumentEnlarged(false)}
                  aria-label="סגור מסמך מוגדל"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="document-content-enlarged">
                <div className="content-header"></div>
                <div className="content-section">
                  <h3 className="content-section-title">סיכום פגישה</h3>
                  <div className="content-section-date">12 במאי, 2025</div>
                  <div className="content-section-divider"></div>
                </div>
                <div className="content-section">
                  <h3 className="content-section-title">נושאים עיקריים</h3>
                  <div className="content-lines">
                    <div className="content-line"></div>
                    <div className="content-line"></div>
                    <div className="content-line short"></div>
                  </div>
                </div>
                <div className="content-section">
                  <h3 className="content-section-title">החלטות</h3>
                  <div className="content-lines">
                    <div className="content-line"></div>
                    <div className="content-line short"></div>
                  </div>
                </div>
                <div className="content-section">
                  <h3 className="content-section-title">משימות</h3>
                  <div className="content-lines">
                    <div className="content-line"></div>
                    <div className="content-line"></div>
                    <div className="content-line short"></div>
                  </div>
                </div>
                <div className="content-action">
                  <div className="action-button"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast notification */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            className="toast-container fixed top-4 left-1/2 transform -translate-x-1/2 z-50 rtl"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div
              className={`flex items-center p-4 mb-4 rounded-lg shadow-lg border ${
                toast.type === "success"
                  ? "bg-green-500 border-green-600"
                  : toast.type === "error"
                    ? "bg-red-500 border-red-600"
                    : "bg-blue-500 border-blue-600"
              }`}
              role="alert"
            >
              <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg text-white">
                {getToastIcon(toast.type)}
              </div>
              <div className="mr-3 text-sm font-normal text-white">{toast.message}</div>
              <button
                type="button"
                className="mr-auto -mx-1.5 -my-1.5 text-white rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8 hover:bg-white hover:bg-opacity-20"
                onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
                aria-label="סגור"
              >
                <span className="sr-only">סגור</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
