"use client"
import { useState } from "react"
import "../styleSheets/email.css"
const EnhancedEmailContact = () => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const emailAddress = "talktome.ai2025@gmail.com"
  const subject = "פנייה מהאתר TalkToMe.AI"
  const body = "שלום,\n\nאני מעוניין/ת לקבל מידע נוסף על השירות.\n\nתודה!"

  const handleEmailClick = () => {
    // נסה קודם mailto
    const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    // בדוק אם mailto עובד
    const testLink = document.createElement("a")
    testLink.href = mailtoLink

    try {
      // נסה לפתוח mailto
      window.location.href = mailtoLink

      // אם לא עבד תוך 3 שניות, הצג את המודל
      setTimeout(() => {
        setShowModal(true)
      }, 3000)
    } catch {
      // אם יש שגיאה, הצג מיד את המודל
      setShowModal(true)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setShowTooltip(true)
      setTimeout(() => setShowTooltip(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const openGmail = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(gmailUrl, "_blank")
    setShowModal(false)
  }

  const openOutlook = () => {
    const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${emailAddress}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(outlookUrl, "_blank")
    setShowModal(false)
  }

  return (
    <>
      <div className="email-contact-container">
        <button onClick={handleEmailClick} className="email-contact-btn" aria-label="שלח מייל" title="שלח מייל">
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
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </button>

        {showTooltip && <div className="copy-tooltip">הועתק ללוח!</div>}
      </div>

      {/* מודל עם אפשרויות */}
      {showModal && (
        <div className="email-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="email-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>

            <h3>צור קשר</h3>
            <p>בחר איך תרצה לשלוח מייל:</p>

            <div className="email-options">
              <button onClick={openGmail} className="email-option-btn gmail">
                <span>📧</span>
                פתח ב-Gmail
              </button>

              <button onClick={openOutlook} className="email-option-btn outlook">
                <span>📮</span>
                פתח ב-Outlook
              </button>

              <button onClick={() => copyToClipboard(emailAddress)} className="email-option-btn copy">
                <span>📋</span>
                העתק כתובת מייל
              </button>
            </div>

            <div className="email-details">
              <p>
                <strong>כתובת:</strong> {emailAddress}
              </p>
              <p>
                <strong>נושא:</strong> {subject}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default EnhancedEmailContact
