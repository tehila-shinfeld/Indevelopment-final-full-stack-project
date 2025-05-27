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
            <div className="ai-symbol">AI</div>
          </div>
          <h1 className="brand-title">TalkToMe.AI</h1>
          <p className="brand-subtitle">מכין עבורך חוויית AI מתקדמת</p>
        </div>

        {/* בר התקדמות */}
        <div className="progress-section">
          <div className="progress-info">
            <span className="progress-text">{steps[currentStep]}</span>
            <span className="progress-percentage">{Math.round(progress)}%</span>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* נקודות טעינה */}
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
