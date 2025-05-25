"use client"

import type { RefObject } from "react"
import "../styleSheets/cta-section.css"

interface CtaSectionProps {
  sectionRef: RefObject<HTMLElement>
  isVisible: boolean
  openModal: () => void
}

const CtaSection = ({ sectionRef, isVisible, openModal }: CtaSectionProps) => {
  return (
    <section ref={sectionRef} id="cta" className={`cta-section ${isVisible ? "section-visible" : ""}`}>
      <div className="container">
        <div className="cta-card">
          <div className="cta-header">
            <h2 className="cta-title">
              מוכנים <span className="gradient-text">להתחיל?</span>
            </h2>
            <p className="cta-description">
              הצטרפו לאלפי לקוחות מרוצים וגלו כיצד המערכת שלנו יכולה לשפר את הפגישות והתקשורת בארגון שלכם
            </p>
          </div>
          <div className="cta-buttons">
            <button className="btn btn-primary btn-lg" onClick={openModal}>
              התחל תקופת ניסיון בחינם
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaSection
