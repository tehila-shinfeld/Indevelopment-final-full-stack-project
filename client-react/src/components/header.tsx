"use client"

import type React from "react"
import { FileText, Menu, Moon, Sun, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "../styleSheets/toogle.css"
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
      <header className={`dashboard-header ${animateHeader ? "animate-header" : ""}`}>
        <div className="header-content">
          <div className="header-controls">
            <button className="menu-button" onClick={handleMenuClick} aria-label="תפריט">
              <Menu size={24} />
            </button>
            <button className="theme-toggle" onClick={toggleDarkMode} aria-label={darkMode ? "מצב בהיר" : "מצב חושך"}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <h1 className="dashboard-title">
            <FileText className="title-icon" size={24} />
            <span>{selectedMeeting ? selectedMeeting.name : "סיכומי הפגישות שלי:"}</span>
          </h1>
          <div className="header-right-group">
            <button className="add-meeting-button magic-btn" onClick={() => navigate("/summary-up!")}>
              <div className="btn-content">
                <Zap size={18} className="btn-icon" />
                <span>פגישה חדשה</span>
              </div>
              <div className="btn-glow"></div>
            </button>
            <div className="logo" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
              <span className="logo-text">
                TalkToMe.<span className="logo-highlight">AI</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar - מוטמע בתוך ה-Header */}
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
