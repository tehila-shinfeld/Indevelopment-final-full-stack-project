"use client"

import type React from "react"
import { FileText, Menu, Moon, Sun, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "../styleSheets/header.css"
import MySidebar from "./my-sidbar"

interface HeaderProps {
  animateHeader: boolean
  toggleDrawer: (open: boolean) => void
  toggleDarkMode: () => void
  darkMode: boolean
  selectedMeeting: { name: string } | null
  menuOpen: boolean
  user?: {
    username?: string
    email?: string
  }
  onLogout: () => void
}

export const Header: React.FC<HeaderProps> = ({
  animateHeader,
  toggleDrawer,
  toggleDarkMode,
  darkMode,
  selectedMeeting,
  menuOpen,
  user,
  onLogout,
}) => {
  const navigate = useNavigate()

  const handleSidebarNavigate = (path: string) => {
    navigate(path)
  }

  const handleMenuClick = () => {
    console.log("Menu button clicked, current menuOpen:", menuOpen)
    toggleDrawer(true)
  }

  return (
    <>
      <header className={`dashboard-header ${animateHeader ? "animate-header" : ""} ${darkMode ? "dark-mode" : ""}`}>
        <div className="header-content">
          <div className="header-left">
            <div className="header-controls">
              <button className="menu-button" onClick={handleMenuClick} aria-label="תפריט">
                <Menu size={20} />
              </button>
              <button className="theme-toggle" onClick={toggleDarkMode} aria-label={darkMode ? "מצב בהיר" : "מצב חושך"}>
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>

          <div className="header-center">
            <h1 className="dashboard-title">
              <FileText className="title-icon" size={24} />
              <span className="title-text">{selectedMeeting ? selectedMeeting.name : "סיכומי הפגישות שלי"}</span>
            </h1>
          </div>

          <div className="header-right">
            <button className="add-meeting-button magic-button" onClick={() => navigate("/summary-up!")}>
              <div className="magic-bg"></div>
              <div className="btn-content">
                <Zap size={18} className="btn-icon" />
                <span className="btn-text">פגישה חדשה</span>
              </div>
              <div className="btn-glow"></div>
              <div className="btn-sparkles">
                <div className="sparkle sparkle-1"></div>
                <div className="sparkle sparkle-2"></div>
                <div className="sparkle sparkle-3"></div>
              </div>
            </button>

            <div
              className="logo"
              onClick={() => navigate("/home")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate("/home")
                }
              }}
            >
              <span className="logo-text">
                TalkToMe.<span className="logo-highlight">AI</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <MySidebar
        isOpen={menuOpen}
        onClose={() => toggleDrawer(false)}
        user={user}
        onNavigate={handleSidebarNavigate}
        onLogout={onLogout}
        currentPath="/meetings"
      />
    </>
  )
}
