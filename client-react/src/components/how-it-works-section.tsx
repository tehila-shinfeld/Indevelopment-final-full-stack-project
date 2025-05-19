"use client"

import { useEffect, useRef, type RefObject } from "react"
import "../styleSheets/how-it-works-section.css"

interface HowItWorksSectionProps {
  sectionRef: RefObject<HTMLElement>
  activeStep: number
}

const HowItWorksSection = ({ sectionRef, activeStep }: HowItWorksSectionProps) => {
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])
  const sectionInViewRef = useRef(false)

  useEffect(() => {
    // וודא שהסקשן גלוי תמיד
    if (sectionRef.current) {
      sectionRef.current.classList.add("section-visible")
    }

    // הגדרת האובזרבר לאנימציה בעת גלילה
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !sectionInViewRef.current) {
          sectionInViewRef.current = true

          // הפעלת אנימציה לכרטיסים בזה אחר זה
          const steps = stepsRef.current.filter(Boolean) as HTMLDivElement[]
          steps.forEach((step, index) => {
            setTimeout(
              () => {
                step.classList.add("animate-in")
                step.style.opacity = "1"
                step.style.transform = "translateY(0)"
              },
              300 + index * 400,
            ) // השהייה ארוכה יותר בין הכרטיסים
          })
        }
      },
      { threshold: 0.2 },
    )

    // צפייה בסקשן עצמו
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [sectionRef])

  return (
    <section ref={sectionRef} id="how-it-works" className="how-it-works-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            איך <span className="gradient-text">TalkToMe.AI</span> עובד?
          </h2>
          <p className="section-description">
            תהליך פשוט בשלושה שלבים שיחסוך לך שעות של עבודה ויאפשר לך להתמקד במה שחשוב באמת
          </p>
        </div>

        <div className="steps-container">
          <div
            ref={(el) => { stepsRef.current[0] = el }}
            className={`step-card step-upload ${activeStep === 0 ? "active" : ""}`}
          >
            <div className="step-icon-wrapper">
              <div className="step-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
            </div>
            <div className="step-number">1</div>
            <h3 className="step-title">העלאת מסמך הפגישה</h3>
            <p className="step-description">העלה את הקלטת הפגישה או מסמך הפגישה למערכת בקלות ובמהירות</p>
          </div>

          <div className="step-connector">
            <div className="connector-line"></div>
            <div className="connector-arrow">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11 19L4 12L11 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div
            ref={(el) => { stepsRef.current[1] = el }}
            className={`step-card step-ai ${activeStep === 1 ? "active" : ""}`}
          >
            <div className="step-icon-wrapper">
              <div className="step-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4 4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z"></path>
                  <path d="M18 8a4 4 0 0 1 4 4v1a4 4 0 0 1-4 4h-1"></path>
                  <path d="M6 8a4 4 0 0 0-4 4v1a4 4 0 0 0 4 4h1"></path>
                  <path d="M12 18v4"></path>
                  <path d="M8 22h8"></path>
                </svg>
              </div>
            </div>
            <div className="step-number">2</div>
            <h3 className="step-title">קבלת סיכום מדויק מה-AI</h3>
            <p className="step-description">המערכת מנתחת את התוכן באמצעות בינה מלאכותית ומייצרת סיכום מדויק ומקיף</p>
          </div>

          <div className="step-connector">
            <div className="connector-line"></div>
            <div className="connector-arrow">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11 19L4 12L11 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div
            ref={(el) => { stepsRef.current[2] = el }}
            className={`step-card step-share ${activeStep === 2 ? "active" : ""}`}
          >
            <div className="step-icon-wrapper">
              <div className="step-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </div>
            </div>
            <div className="step-number">3</div>
            <h3 className="step-title">שיתוף הסיכום</h3>
            <p className="step-description">שתף את הסיכום המפורט עם שאר המשתתפים בפגישה בלחיצת כפתור</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
