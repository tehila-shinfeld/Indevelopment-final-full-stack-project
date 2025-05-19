"use client"

import "../styleSheets/footer.css"

const Footer = () => {
  return (
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
              <a href="#features">יתרונות</a>
              <a href="#how-it-works">איך זה עובד</a>
              <a href="#pricing">תמחור</a>
              <a href="#faq">שאלות נפוצות</a>
            </div>
            <div className="footer-links-column">
              <h3 className="footer-links-title">חברה</h3>
              <a href="#about">אודות</a>
              <a href="#blog">בלוג</a>
              <a href="#careers">קריירה</a>
              <a href="#contact">צור קשר</a>
            </div>
            <div className="footer-links-column">
              <h3 className="footer-links-title">משפטי</h3>
              <a href="#terms">תנאי שימוש</a>
              <a href="#privacy">מדיניות פרטיות</a>
              <a href="#cookies">מדיניות עוגיות</a>
              <a href="#security">אבטחה</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">© 2025 TalkToMe.AI. כל הזכויות שמורות.</p>
          <div className="social-links">
            <a href="#" aria-label="Twitter">
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
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
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
            <a href="#" aria-label="Facebook">
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
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
