"use client"

import type React from "react"
import { type RefObject, useState, useEffect, useCallback, useRef } from "react"
import "../styleSheets/testimonials-section.css"

interface TestimonialsSectionProps {
  sectionRef: RefObject<HTMLElement>
  isVisible: boolean
}

interface Testimonial {
  id: number
  name: string
  role: string
  rating: number
  text: string
  image: string
  fallbackImage: string
}

const TestimonialsSection = ({ sectionRef, isVisible }: TestimonialsSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartX = useRef<number | null>(null)

  // ✅ תמונות מהאינטרנט שעובדות תמיד - עם כמה אפשרויות לכל אחד
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "דוד כהן",
      role: "מנהל פרויקטים, חברת טכנולוגיות מתקדמות",
      rating: 5,
      text: "המערכת חסכה לנו שעות רבות של עבודה. הסיכומים מדויקים, ברורים ומאפשרים לנו להתמקד בעיקר במקום לבזבז זמן על תיעוד פגישות.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      fallbackImage: "https://i.pravatar.cc/200?img=32",
    },
    {
      id: 2,
      name: "אמיר לוי",
      role: 'מנכ"ל, סטארטאפ חדשנות',
      rating: 5,
      text: "אחרי שהתחלנו להשתמש במערכת, הפגישות שלנו הפכו יעילות יותר. כולם יודעים שיהיה סיכום מדויק, וזה מאפשר לנו להתמקד בשיחה במקום ברישום.",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      fallbackImage: "https://i.pravatar.cc/200?img=45",
    },
    {
      id: 3,
      name: "יוסי אברהם",
      role: "ראש צוות פיתוח, חברת תוכנה גלובלית",
      rating: 5,
      text: "הבינה המלאכותית מזהה בצורה מדהימה את הנקודות החשובות. אפילו בדיונים טכניים מורכבים, הסיכומים תמיד מדויקים ומתמקדים בדיוק במה שחשוב.",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      fallbackImage: "https://i.pravatar.cc/200?img=67",
    },
    {
      id: 4,
      name: "רון שמיר",
      role: 'סמנכ"ל משאבי אנוש, קבוצת פיננסים',
      rating: 5,
      text: "כמנהל משאבי אנוש, אני משתתף בהרבה פגישות יומיות. המערכת מאפשרת לי להיות נוכח ומעורב במקום לדאוג על רישום הפרטים. התוצאות מדהימות!",
      image: "https://randomuser.me/api/portraits/men/23.jpg",
      fallbackImage: "https://i.pravatar.cc/200?img=23",
    },
    {
      id: 5,
      name: "גיל רוזן",
      role: "מנהל מכירות, חברת ייעוץ עסקי",
      rating: 5,
      text: "בתור מנהל מכירות, אני פוגש לקוחות כל יום. המערכת עוזרת לי לזכור כל פרט חשוב מהפגישה ולעקוב אחרי התחייבויות. זה שינה לי את הדרך לעבוד!",
      image: "https://randomuser.me/api/portraits/men/89.jpg",
      fallbackImage: "https://i.pravatar.cc/200?img=89",
    },
    {
      id: 6,
      name: "אלון גולדברג",
      role: "מנהל תפעול, חברת לוגיסטיקה",
      rating: 5,
      text: "המערכת פשוט מושלמת לפגישות התיאום שלנו עם ספקים ולקוחות. הסיכומים כוללים את כל הפרטים הטכניים והלוגיסטיים בצורה מסודרת וברורה.",
      image: "https://randomuser.me/api/portraits/men/56.jpg",
      fallbackImage: "https://i.pravatar.cc/200?img=56",
    },
  ]

  // Get the previous and next indices
  const getPrevIndex = useCallback(
    (current: number) => (current - 1 + testimonials.length) % testimonials.length,
    [testimonials.length],
  )

  const getNextIndex = useCallback((current: number) => (current + 1) % testimonials.length, [testimonials.length])

  // Handle navigation
  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating || index === activeIndex) return
      setIsAnimating(true)
      setActiveIndex(index)

      setTimeout(() => {
        setIsAnimating(false)
      }, 500)
    },
    [activeIndex, isAnimating],
  )

  const goToNextSlide = useCallback(() => {
    goToSlide(getNextIndex(activeIndex))
  }, [activeIndex, getNextIndex, goToSlide])

  const goToPrevSlide = useCallback(() => {
    goToSlide(getPrevIndex(activeIndex))
  }, [activeIndex, getPrevIndex, goToSlide])

  // Setup keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!carouselRef.current || !carouselRef.current.contains(document.activeElement)) return

      if (e.key === "ArrowLeft") {
        e.preventDefault()
        goToNextSlide()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        goToPrevSlide()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [goToNextSlide, goToPrevSlide])

  // Setup autoplay
  useEffect(() => {
    if (!isVisible) {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
        autoplayRef.current = null
      }
      return
    }

    autoplayRef.current = setInterval(() => {
      goToNextSlide()
    }, 7000)

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
        autoplayRef.current = null
      }
    }
  }, [isVisible, goToNextSlide])

  const pauseAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
      autoplayRef.current = null
    }
  }, [])

  const resumeAutoplay = useCallback(() => {
    if (!autoplayRef.current && isVisible) {
      autoplayRef.current = setInterval(() => {
        goToNextSlide()
      }, 7000)
    }
  }, [goToNextSlide, isVisible])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return

      const touchEndX = e.changedTouches[0].clientX
      const diff = touchStartX.current - touchEndX

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToNextSlide()
        } else {
          goToPrevSlide()
        }
      }

      touchStartX.current = null
    },
    [goToNextSlide, goToPrevSlide],
  )

  // ✅ פונקציה חכמה לטיפול בשגיאות תמונות
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>, testimonial: Testimonial) => {
    const target = e.target as HTMLImageElement
    const currentSrc = target.src

    // אם זה הניסיון הראשון, נסה את ה-fallback
    if (currentSrc === testimonial.image) {
      console.log(`נסיון fallback לתמונה של ${testimonial.name}`)
      target.src = testimonial.fallbackImage
    }
    // אם גם ה-fallback נכשל, השתמש ב-placeholder מקומי
    else if (currentSrc === testimonial.fallbackImage) {
      console.log(`שני השירותים נכשלו עבור ${testimonial.name}, משתמש ב-placeholder`)
      target.src = "/placeholder.svg?height=200&width=200&text=👨‍💼"
    }
  }, [])

  const renderStarRating = (rating: number) => {
    return (
      <div className="testimonial-rating" aria-label={`דירוג ${rating} מתוך 5 כוכבים`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`star ${i < rating ? "filled" : ""}`} aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={i < rating ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </span>
        ))}
      </div>
    )
  }

  const getSlideClass = (index: number) => {
    if (index === activeIndex) return "active"
    if (index === getPrevIndex(activeIndex)) return "prev"
    if (index === getNextIndex(activeIndex)) return "next"
    return ""
  }

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className={`testimonials-section ${isVisible ? "section-visible" : ""}`}
    >
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            מה <span className="gradient-text">הלקוחות</span> שלנו אומרים
          </h2>
          <p className="section-description">
            אלפי לקוחות כבר משתמשים במערכת שלנו ונהנים מסיכומי פגישות מדויקים וחסכון בזמן יקר
          </p>
        </div>

        <div className="testimonials-outer-wrapper">
          <div
            className="testimonials-carousel"
            ref={carouselRef}
            onMouseEnter={pauseAutoplay}
            onMouseLeave={resumeAutoplay}
            onFocus={pauseAutoplay}
            onBlur={resumeAutoplay}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-label="המלצות לקוחות"
            aria-roledescription="קרוסלת המלצות"
          >
            <div className="carousel-container">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`testimonial-slide ${getSlideClass(index)}`}
                  role="group"
                  aria-roledescription="המלצה"
                  aria-label={`המלצה ${index + 1} מתוך ${testimonials.length}`}
                  aria-hidden={activeIndex !== index}
                >
                  <div className="testimonial-card">
                    <div className="testimonial-header">
                      <div className="testimonial-avatar">
                        <img
                          src={testimonial.image || "/placeholder.svg"}
                          alt={`תמונת פרופיל של ${testimonial.name}`}
                          loading="lazy"
                          onError={(e) => handleImageError(e, testimonial)}
                          onLoad={() => console.log(`✅ תמונה נטענה בהצלחה: ${testimonial.name}`)}
                        />
                      </div>
                      <div className="testimonial-meta">
                        <h3 className="testimonial-name">{testimonial.name}</h3>
                        <p className="testimonial-role">{testimonial.role}</p>
                        {renderStarRating(testimonial.rating)}
                      </div>
                    </div>
                    <div className="testimonial-content">
                      <div className="quote-icon" aria-hidden="true">
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
                          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                        </svg>
                      </div>
                      <p className="testimonial-text">{testimonial.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="carousel-navigation">
              <button
                className="carousel-arrow prev"
                onClick={goToPrevSlide}
                disabled={isAnimating}
                aria-label="המלצה קודמת"
                type="button"
              >
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
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              <div className="carousel-indicators" role="tablist">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-indicator ${index === activeIndex ? "active" : ""}`}
                    onClick={() => goToSlide(index)}
                    disabled={isAnimating}
                    aria-label={`המלצה ${index + 1}`}
                    aria-selected={index === activeIndex}
                    role="tab"
                    type="button"
                  />
                ))}
              </div>

              <button
                className="carousel-arrow next"
                onClick={goToNextSlide}
                disabled={isAnimating}
                aria-label="המלצה הבאה"
                type="button"
              >
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
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
