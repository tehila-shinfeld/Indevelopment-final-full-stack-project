"use client"
import { useEffect, useState } from "react"
import "../styleSheets/loading-screen.css"

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0)
  const [currentText, setCurrentText] = useState(0)

  const loadingTexts = ["מכין הכל בשבילך...", "טוען נתונים...", "כמעט מוכן...", "ברוך הבא!"]

  useEffect(() => {
    // אנימציית התקדמות
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer)
          return 100
        }
        return prev + 2
      })
    }, 100)

    // החלפת טקסטים
    const textTimer = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % loadingTexts.length)
    }, 1200)

    return () => {
      clearInterval(progressTimer)
      clearInterval(textTimer)
    }
  }, [])

  return (
    <div className="loading-container">
      {/* רקע עם גרדיאנט דינמי */}
      <div className="animated-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* חלקיקים מרחפים */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>

      {/* תוכן מרכזי */}
      <div className="loading-content">
        {/* לוגו/אייקון מרכזי */}
        <div className="logo-container">
          <div className="logo-circle">
            <div className="logo-inner">
              <div className="logo-spark"></div>
            </div>
          </div>
          <div className="pulse-ring ring-1"></div>
          <div className="pulse-ring ring-2"></div>
          <div className="pulse-ring ring-3"></div>
        </div>

        {/* ספינר מתקדם */}
        <div className="advanced-spinner">
          <div className="spinner-ring ring-outer"></div>
          <div className="spinner-ring ring-middle"></div>
          <div className="spinner-ring ring-inner"></div>
        </div>

        {/* טקסט דינמי */}
        <div className="loading-text">
          <h2 className="main-title">{loadingTexts[currentText]}</h2>
        </div>

        {/* בר התקדמות */}
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            <div className="progress-glow"></div>
          </div>
          <div className="progress-text">{progress}%</div>
        </div>

        {/* גלים דקורטיביים */}
        <div className="wave-container">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>
      </div>

      {/* אפקט כוכבים */}
      <div className="stars">
        {[...Array(50)].map((_, i) => (
          <div key={i} className={`star star-${i + 1}`}></div>
        ))}
      </div>
    </div>
  )
}

export default LoadingScreen
