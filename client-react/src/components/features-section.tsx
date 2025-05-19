"use client"

import type { RefObject } from "react"
import "../styleSheets/features-section.css"

interface FeaturesSectionProps {
  sectionRef: RefObject<HTMLElement>
  isVisible: boolean
}

const FeaturesSection = ({ sectionRef, isVisible }: FeaturesSectionProps) => {
  const features = [
    {
      title: "AI שמבין אותך",
      desc: "המערכת יודעת לזהות רעיונות מרכזיים, החלטות ומשימות מתוך טקסט של פגישה.",
      icon: "brain",
    },
    {
      title: "סיכום בלחיצת כפתור",
      desc: "העלו תמלול – וקבלו תקציר ברור, קצר וענייני לשיתוף עם הצוות.",
      icon: "zap",
    },
    {
      title: "הכל מתועד",
      desc: "אין יותר ״מה סיכמנו?״ – כל פגישה מתועדת, זמינה ומאורגנת.",
      icon: "folder",
    },
    {
      title: "תמיכה מלאה בעברית",
      desc: "האפליקציה יודעת לעבוד עם תמלולים בעברית – כולל שפה עסקית או טכנית.",
      icon: "globe",
    },
  ]

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "brain":
        return (
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
            className="feature-icon-svg"
          >
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04Z"></path>
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z"></path>
          </svg>
        )
      case "zap":
        return (
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
            className="feature-icon-svg"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        )
      case "folder":
        return (
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
            className="feature-icon-svg"
          >
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
            <path d="M8 10v4"></path>
            <path d="M12 10v4"></path>
            <path d="M16 10v4"></path>
          </svg>
        )
      case "globe":
        return (
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
            className="feature-icon-svg"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="m2 12 20 0"></path>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <section ref={sectionRef} id="features" className={`features-section ${isVisible ? "section-visible" : ""}`}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            יתרונות <span className="gradient-text">המערכת</span>
          </h2>
          <p className="section-description">
            המערכת שלנו מציעה מגוון כלים שיעזרו לך לנהל את הפגישות שלך ביעילות ולהפיק מהן את המרב
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div className={`feature-card feature-card-${index + 1}`} key={index}>
              <div className="feature-card-inner">
                <div className="feature-card-front">
                  <div className="feature-icon-wrapper">
                    {renderIcon(feature.icon)}
                    <div className="feature-icon-glow"></div>
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                </div>
                <div className="feature-card-back">
                  <p className="feature-description">{feature.desc}</p>
                  <div className="feature-learn-more">
                    <span>למידע נוסף</span>
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
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
