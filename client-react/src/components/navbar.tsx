"use client"

import type { Dispatch, SetStateAction } from "react"
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
  const navigate = useNavigate();

  const handleStartNowClick = () => {
    // Check if a valid token exists in session storage
    const token = sessionStorage.getItem("token")

    if (token) {
      // If token exists, redirect to the dashboard or next page
      navigate('/myMeetings')
    } else {
      // If no token, open the login/signup modal
      openModal()
    }
  }

  return (
    <header className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="container navbar-container">
        <div className="logo">
          <span className="logo-text">
            AI.<span className="logo-highlight">TalkToMe</span>
          </span>
        </div>

        <nav className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>
            איך זה עובד
          </a>
          <a href="#features" onClick={() => setIsMenuOpen(false)}>
            יתרונות
          </a>
          <a href="#testimonials" onClick={() => setIsMenuOpen(false)}>
            לקוחות
          </a>
          <a href="#pricing" onClick={() => setIsMenuOpen(false)}>
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
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
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
  )
}

export default Navbar
