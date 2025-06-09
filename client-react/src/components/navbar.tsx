"use client"

import type React from "react"
import type { Dispatch, SetStateAction } from "react"
import { useState } from "react"
import "../styleSheets/navbar.css"
import { useNavigate } from "react-router-dom"

interface NavbarProps {
  isScrolled: boolean
  isDarkMode: boolean
  toggleDarkMode: () => void
  isMenuOpen: boolean
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>
  openModal: () => void
}

const Navbar = ({ isScrolled, isDarkMode, toggleDarkMode, isMenuOpen, setIsMenuOpen, openModal }: NavbarProps) => {
  const navigate = useNavigate()
  const [isPricingPopupOpen, setIsPricingPopupOpen] = useState(false)

  const handleStartNowClick = () => {
    // Check if a valid token exists in session storage
    const token = sessionStorage.getItem("token")

    if (token) {
      navigate("/myMeetings")
    } else {
      openModal()
    }
  }

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsPricingPopupOpen(true)
    setIsMenuOpen(false)
  }

  const closePricingPopup = () => {
    setIsPricingPopupOpen(false)
  }

  // New function to handle smooth scrolling to sections
  const scrollToSection = (sectionId: string, e: React.MouseEvent) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }

  return (
    <>
      <header style={{ marginBottom: "40px" }} className={`navbar ${isScrolled ? "scrolled" : ""} `}>
        <div className="container navbar-container">
          <div className="logo">
            <span className="logo-text">
              AI.<span className="logo-highlight">TalkToMe</span>
            </span>
          </div>

          <nav className={`nav-links ${isMenuOpen ? "open" : ""}`}>
            <a href="#how-it-works" onClick={(e) => scrollToSection("how-it-works", e)}>
              איך זה עובד
            </a>
            <a href="#features" onClick={(e) => scrollToSection("features", e)}>
              יתרונות
            </a>
            <a href="#testimonials" onClick={(e) => scrollToSection("testimonials", e)}>
              לקוחות
            </a>
            <a href="#pricing" onClick={handlePricingClick}>
              תמחור
            </a>
          </nav>

          <div className="navbar-actions">
            <button className="theme-toggle" onClick={toggleDarkMode} aria-label="Toggle dark mode">
              {isDarkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              )}
            </button>
            <button className="btn btn-primary" onClick={handleStartNowClick}>
              התחל עכשיו
            </button>
            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Pricing Popup */}
      {isPricingPopupOpen && (
        <div className="pricing-popup-overlay" onClick={closePricingPopup}>
          <div className="pricing-popup" onClick={(e) => e.stopPropagation()}>
            <button className="pricing-popup-close" onClick={closePricingPopup}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
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

            <div className="pricing-popup-content">
              <div className="celebration-icon">🎉</div>
              <h2 className="pricing-popup-title">חגיגת השקה!</h2>
              <div className="pricing-popup-subtitle">לרגל השקת האפליקציה החדשה</div>

              <div className="free-offer">
                <div className="free-badge">חינם לחלוטין!</div>
                <div className="free-text">
                  האפליקציה זמינה לשימוש חופשי
                  <br />
                  <strong>בחודש זה בלבד</strong>
                </div>
              </div>

              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-icon">✨</span>
                  <span>גישה מלאה לכל התכונות</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🚀</span>
                  <span>ללא הגבלת זמן שיחה</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💎</span>
                  <span>תמיכה מלאה ועדכונים</span>
                </div>
              </div>

              <div className="limited-time">⏰ הצעה מוגבלת לחודש זה בלבד</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
