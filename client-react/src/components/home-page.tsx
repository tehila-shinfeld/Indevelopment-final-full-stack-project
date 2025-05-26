"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import "../styleSheets/home-page.css"
import Navbar from "./navbar"
import HeroSection from "./hero-section"
import HowItWorksSection from "./how-it-works-section"
import FeaturesSection from "./features-section"
import TestimonialsSection from "./testimonials-section"
import CtaSection from "./cta-section"
import Footer from "./footer"
import EnhancedLoginModal from "./login-modal"
import { useNavigate } from "react-router-dom"
import { m } from "framer-motion"

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [visibleSections, setVisibleSections] = useState({
    hero: false,
    howItWorks: false,
    features: false,
    testimonials: false,
    cta: false,
  })
  const navigate = useNavigate()

  const sectionsRef = {
    hero: useRef<HTMLElement>(null),
    howItWorks: useRef<HTMLElement>(null),
    features: useRef<HTMLElement>(null),
    testimonials: useRef<HTMLElement>(null),
    cta: useRef<HTMLElement>(null),
  }

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      Object.entries(sectionsRef).forEach(([key, ref]) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect()
          const isVisible = rect.top < window.innerHeight * 0.75 && rect.bottom > 0
          setVisibleSections((prev) => ({ ...prev, [key]: isVisible }))
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initially

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-advance steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Check for dark mode preference
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDarkMode(prefersDark)

    const storedTheme = localStorage.getItem("theme")
    if (storedTheme) {
      setIsDarkMode(storedTheme === "dark")
    }
  }, [])

  // Update body class when dark mode changes
  useEffect(() => {
    // הוסף קלאס גם ל-document.documentElement
    if (isDarkMode) {
      document.body.classList.add("dark-mode")
      document.documentElement.classList.add("dark-mode")
      document.documentElement.setAttribute("data-theme", "dark")
    } else {
      document.body.classList.remove("dark-mode")
      document.documentElement.classList.remove("dark-mode")
      document.documentElement.setAttribute("data-theme", "light")
    }
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

  // Open modal
  const openModal = () => {
    setIsModalOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
  }

  // Handle navigation after login/register
  const handleNavigate = () => {
    navigate("/myMeetings")
    closeModal()
  }

  return (
    <div
      className={`app-container ${isDarkMode ? "dark-mode" : "light-mode"}`}
      data-theme={isDarkMode ? "dark" : "light"}
    >
      <div className="background-decorations">
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
        <div className="gradient-blob blob-3"></div>
      </div>

      <Navbar
        isScrolled={isScrolled}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        openModal={openModal}
      />

      <main>
        <HeroSection
          sectionRef={sectionsRef.hero as React.RefObject<HTMLElement>}
          isVisible={visibleSections.hero}
          openModal={openModal}
          
        />

        <HowItWorksSection
          sectionRef={sectionsRef.howItWorks as React.RefObject<HTMLElement>}
          activeStep={activeStep}
          isDarkMode={isDarkMode}
        />
        <FeaturesSection
          sectionRef={sectionsRef.features as React.RefObject<HTMLElement>}
          isVisible={visibleSections.features}
        />

        <TestimonialsSection
          sectionRef={sectionsRef.testimonials as React.RefObject<HTMLElement>}
          isVisible={visibleSections.testimonials}
        />

        <CtaSection
          sectionRef={sectionsRef.cta as React.RefObject<HTMLElement>}
          isVisible={visibleSections.cta}
          openModal={openModal}
        />
      </main>

      <Footer />

      <EnhancedLoginModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
      />

      {/* הסר את FloatingThemeToggle כדי למנוע קונפליקט */}
      {/* <FloatingThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} /> */}
    </div>
  )
}

export default HomePage
