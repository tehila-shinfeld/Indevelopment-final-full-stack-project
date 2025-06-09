"use client"

import type React from "react"

import { useEffect, useState } from "react"
import "../styleSheets/loading-screen.css"

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 8 + 2

        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsExiting(true)
            setTimeout(() => {
              setIsVisible(false)
              setTimeout(onLoadingComplete, 100)
            }, 1000)
          }, 500)
          return 100
        }
        return newProgress
      })
    }, 150)

    return () => clearInterval(interval)
  }, [onLoadingComplete])

  if (!isVisible) return null

  // יצירת חלקיקים רנדומליים
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.5,
    angle: (360 / 20) * i,
    distance: 100 + Math.random() * 50,
    size: 3 + Math.random() * 4,
  }))

  return (
    <div className={`loading-screen ${isExiting ? "exit-animation" : ""}`}>
      <div className={`loading-circle-container ${isExiting ? "circle-exit" : ""}`}>
        <svg className="loading-circle" viewBox="0 0 100 100">
          <circle className="loading-circle-bg" cx="50" cy="50" r="45" />
          <circle
            className="loading-circle-progress"
            cx="50"
            cy="50"
            r="45"
            style={{
              strokeDashoffset: `${283 - (283 * progress) / 100}px`,
            }}
          />
        </svg>
        <div className={`loading-percentage ${isExiting ? "percentage-exit" : ""}`}>{Math.round(progress)}%</div>

        {/* חלקיקים */}
        {isExiting && (
          <div className="particles-container">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="particle"
                style={
                  {
                    "--angle": `${particle.angle}deg`,
                    "--distance": `${particle.distance}px`,
                    "--size": `${particle.size}px`,
                    "--delay": `${particle.delay}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LoadingScreen
