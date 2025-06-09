"use client"

import type React from "react"

import { useState } from "react"
import "../styleSheets/footer.css"
import EnhancedEmailContact from "../components/email-contact"

const FooterWithNotifications = () => {
  const [notification, setNotification] = useState<string | null>(null)

  // ✅ גלילה לסקשנים קיימים
  const scrollToSection = (sectionId: string, e: React.MouseEvent) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    } else {
      showNotification(`הסקשן "${sectionId}" לא נמצא בדף`)
    }
  }

  // ✅ הודעה למשתמש על קישורים שעדיין לא מומשו
  const handlePlaceholderClick = (e: React.MouseEvent, sectionName: string) => {
    e.preventDefault()
    showNotification(`הדף "${sectionName}" יהיה זמין בקרוב!`)
  }

  // ✅ הצגת הודעה זמנית
  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <span className="logo-text">
                TalkToMe<span className="logo-highlight">.AI</span>
              </span>
              <p className="footer-tagline">סיכומי פגישות חכמים בלחיצת כפתור</p>
            </div>
            <div className="footer-links">
              <div className="footer-links-column">
                <h3 className="footer-links-title">מוצר</h3>
                <a href="#features" onClick={(e) => scrollToSection("features", e)}>
                  יתרונות
                </a>
                <a href="#how-it-works" onClick={(e) => scrollToSection("how-it-works", e)}>
                  איך זה עובד
                </a>
                <a href="#testimonials" onClick={(e) => scrollToSection("testimonials", e)}>
                  לקוחות
                </a>
                <a href="#faq" onClick={(e) => handlePlaceholderClick(e, "שאלות נפוצות")}>
                  שאלות נפוצות
                </a>
              </div>
              <div className="footer-links-column">
                <h3 className="footer-links-title">חברה</h3>
                <a href="#about" onClick={(e) => handlePlaceholderClick(e, "אודות")}>
                  אודות
                </a>
                <a href="#blog" onClick={(e) => handlePlaceholderClick(e, "בלוג")}>
                  בלוג
                </a>
                <a href="#careers" onClick={(e) => handlePlaceholderClick(e, "קריירה")}>
                  קריירה
                </a>
                <a href="#contact" onClick={(e) => handlePlaceholderClick(e, "צור קשר")}>
                  צור קשר
                </a>
              </div>
              <div className="footer-links-column">
                <h3 className="footer-links-title">משפטי</h3>
                <a href="#terms" onClick={(e) => handlePlaceholderClick(e, "תנאי שימוש")}>
                  תנאי שימוש
                </a>
                <a href="#privacy" onClick={(e) => handlePlaceholderClick(e, "מדיניות פרטיות")}>
                  מדיניות פרטיות
                </a>
                <a href="#cookies" onClick={(e) => handlePlaceholderClick(e, "מדיניות עוגיות")}>
                  מדיניות עוגיות
                </a>
                <a href="#security" onClick={(e) => handlePlaceholderClick(e, "אבטחה")}>
                  אבטחה
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="copyright">© 2025 TalkToMe.AI. כל הזכויות שמורות.</p>
            <div className="social-links">
              <EnhancedEmailContact />

              <a href="#" aria-label="LinkedIn">
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
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a
                href="https://github.com/tehila-shinfeld"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
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
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ✅ הודעות זמניות למשתמש */}
      {notification && (
        <div className="notification-toast">
          <p>{notification}</p>
        </div>
      )}

      {/* Notification toast styles moved to footer.css */}
    </>
  )
}

export default FooterWithNotifications
