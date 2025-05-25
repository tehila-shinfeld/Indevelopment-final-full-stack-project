"use client"

import { useEffect, useState } from "react"
import "../styleSheets/loading-screen.css"

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = ["מאתחל מערכת AI...", "טוען מודלי שפה...", "מכין את הממשק שלך...", "כמעט מוכן..."]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 8 + 2

        const stepIndex = Math.floor((newProgress / 100) * steps.length)
        setCurrentStep(Math.min(stepIndex, steps.length - 1))

        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsVisible(false)
            setTimeout(onLoadingComplete, 600)
          }, 400)
          return 100
        }
        return newProgress
      })
    }, 200)

    return () => clearInterval(interval)
  }, [onLoadingComplete])

  if (!isVisible) return null

  return (
    <div className={`loading-screen ${!isVisible ? "fade-out" : ""}`}>
      <div className="loading-container">
        {/* לוגו מרכזי */}
        <div className="logo-section">
          <div className="logo-icon">
            <div className="ai-core">
              <div className="core-ring ring-1"></div>
              <div className="core-ring ring-2"></div>
              <div className="core-ring ring-3"></div>
              <div className="core-center">AI</div>

              {/* בועות יוצאות מהעיגול */}
              <div className="bubbles-container">
                <div className="bubble bubble-1"></div>
                <div className="bubble bubble-2"></div>
                <div className="bubble bubble-3"></div>
                <div className="bubble bubble-4"></div>
                <div className="bubble bubble-5"></div>
                <div className="bubble bubble-6"></div>
              </div>
            </div>
          </div>
          <h1 className="brand-title">
            <span className="brand-name">TalkToMe</span>
            <span className="brand-ai">.AI</span>
          </h1>
          <p className="brand-subtitle">מכין עבורך חוויית AI מתקדמת</p>
        </div>

        {/* בר התקדמות מרכזי - מוגבר */}
        <div className="progress-section">
          <div className="progress-header">
            <h2 className="progress-title">טוען את המערכת...</h2>
            <div className="progress-status">
              <span className="progress-percentage-large">{Math.round(progress)}%</span>
            </div>
          </div>

          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}>
                <div className="progress-glow"></div>
                <div className="progress-wave"></div>
              </div>
            </div>

            <div className="progress-info">
              <span className="progress-text">{steps[currentStep]}</span>
              <div className="progress-dots">
                <span className="loading-dot">●</span>
                <span className="loading-dot">●</span>
                <span className="loading-dot">●</span>
              </div>
            </div>
          </div>
        </div>

        {/* אינדיקטור מצב */}
        <div className="status-indicator">
          <div className="status-icon">⚡</div>
          <span className="status-text">מעבד נתונים...</span>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
