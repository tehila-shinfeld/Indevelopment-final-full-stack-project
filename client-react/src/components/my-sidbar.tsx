"use client"

import React from "react"
import { useState, useEffect } from "react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  user?: {
    username?: string
    email?: string
  }
  onNavigate?: (path: string) => void
  onLogout?: () => void
  currentPath?: string
}

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  path: string
}

const MySidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  user,
  onNavigate,
  onLogout,
  currentPath = "/meetings",
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // אייקונים מינימליסטיים עם קו מתאר דק
  const HomeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  )

  const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )

  const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  )

  const UploadIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  )

  const ClipboardIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  )

  const StarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  )

  const DownloadIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7,10 12,15 17,10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )

  const MessageIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )

  const SettingsIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )

  const HelpIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <point x="12" y="17" />
    </svg>
  )

  const LogoutIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16,17 21,12 16,7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )

  const CloseIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )

  const menuItems: MenuItem[] = [
    {
      id: "home",
      label: "דף הבית",
      icon: <HomeIcon />,
      path: "/dashboard",
    },
    {
      id: "profile",
      label: "פרופיל שלי",
      icon: <UserIcon />,
      path: "/my-profile",
    },
    {
      id: "add-meeting",
      label: "הוספת פגישה חדשה",
      icon: <PlusIcon />,
      path: "/summary-up!",
    },
    {
      id: "upload",
      label: "העלאת קובץ",
      icon: <UploadIcon />,
      path: "/upload",
    },
    {
      id: "meetings",
      label: "כל הפגישות שלי",
      icon: <ClipboardIcon />,
      path: "/meetings",
    },
    {
      id: "favorites",
      label: "פגישות מועדפות",
      icon: <StarIcon />,
      path: "/favorites",
    },
    {
      id: "downloads",
      label: "הורדות",
      icon: <DownloadIcon />,
      path: "/downloads",
    },
    {
      id: "messages",
      label: "הודעות",
      icon: <MessageIcon />,
      path: "/messages",
    },
    {
      id: "settings",
      label: "הגדרות",
      icon: <SettingsIcon />,
      path: "/settings",
    },
    {
      id: "help",
      label: "עזרה ותמיכה",
      icon: <HelpIcon />,
      path: "/help",
    },
  ]

  const handleItemClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path)
    }
    onClose()
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!mounted) return null

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.1)",
    backdropFilter: "blur(2px)",
    zIndex: 9998,
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? "visible" : "hidden",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  }

  const sidebarStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    right: isOpen ? 0 : "-320px",
    height: "100vh",
    width: "320px",
    backgroundColor: "#ffffff",
    borderLeft: "1px solid #e2e8f0",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    transition: "right 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    boxShadow: isOpen ? "-8px 0 32px rgba(15, 23, 42, 0.06)" : "none",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  }

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 20px 16px 20px",
    borderBottom: "1px solid #f1f5f9",
    backgroundColor: "#ffffff",
  }

  const titleStyle: React.CSSProperties = {
    fontSize: "15px",
    fontWeight: "600",
    color: "#0f172a",
    margin: 0,
    letterSpacing: "-0.02em",
    lineHeight: "1.2",
  }

  const closeButtonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    backgroundColor: "#ffffff",
    color: "#64748b",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    fontWeight: "400",
  }

  const userProfileStyle: React.CSSProperties = {
    padding: "18px 20px",
    borderBottom: "1px solid #f1f5f9",
    backgroundColor: "#fafbfc",
  }

  const userInfoStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  }

  const avatarStyle: React.CSSProperties = {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#475569",
  }

  const userNameStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0f172a",
    margin: "0 0 2px 0",
    letterSpacing: "-0.01em",
    lineHeight: "1.3",
  }

  const userEmailStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#64748b",
    margin: 0,
    letterSpacing: "0",
    lineHeight: "1.4",
  }

  const navStyle: React.CSSProperties = {
    flex: 1,
    overflowY: "auto",
    padding: "16px 0",
  }

  const navListStyle: React.CSSProperties = {
    listStyle: "none",
    margin: 0,
    padding: 0,
  }

  const getNavButtonStyle = (isActive: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    padding: "10px 20px",
    border: "none",
    backgroundColor: isActive ? "#f8fafc" : "transparent",
    color: isActive ? "#0f172a" : "#475569",
    fontSize: "13px",
    fontWeight: isActive ? "500" : "400",
    textAlign: "left" as const,
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    borderRight: isActive ? "2px solid #0f172a" : "2px solid transparent",
    letterSpacing: "-0.01em",
    lineHeight: "1.4",
    position: "relative" as const,
  })

  const iconContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "18px",
    height: "18px",
  }

  const labelStyle: React.CSSProperties = {
    flex: 1,
    textAlign: "right",
  }

  const separatorStyle: React.CSSProperties = {
    height: "1px",
    backgroundColor: "#f1f5f9",
    margin: "8px 20px",
  }

  const footerStyle: React.CSSProperties = {
    padding: "18px 20px 20px 20px",
    borderTop: "1px solid #f1f5f9",
    backgroundColor: "#fafbfc",
  }

  const logoutButtonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    padding: "10px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    backgroundColor: "#ffffff",
    color: "#dc2626",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    marginBottom: "16px",
    letterSpacing: "-0.01em",
    lineHeight: "1.4",
  }

  const copyrightStyle: React.CSSProperties = {
    textAlign: "center",
    fontSize: "11px",
    color: "#94a3b8",
    margin: 0,
    letterSpacing: "0.01em",
    lineHeight: "1.4",
  }

  return (
    <>
      {/* Overlay */}
      <div style={overlayStyle} onClick={handleOverlayClick} />

      {/* Sidebar */}
      <aside style={sidebarStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>תפריט ניווט</h2>
          <button
            style={closeButtonStyle}
            onClick={onClose}
            aria-label="סגור תפריט"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f8fafc"
              e.currentTarget.style.borderColor = "#cbd5e1"
              e.currentTarget.style.color = "#334155"
              e.currentTarget.style.transform = "scale(1.05)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff"
              e.currentTarget.style.borderColor = "#e2e8f0"
              e.currentTarget.style.color = "#64748b"
              e.currentTarget.style.transform = "scale(1)"
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* User Profile */}
        <div style={userProfileStyle}>
          <div style={userInfoStyle}>
            <div style={avatarStyle}>
              <UserIcon />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={userNameStyle}>{user?.username || "משתמש"}</h3>
              <p style={userEmailStyle}>{user?.email || "ברוך הבא למערכת"}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={navStyle}>
          <ul style={navListStyle}>
            {menuItems.map((item, index) => {
              const isActive = currentPath === item.path
              return (
                <React.Fragment key={item.id}>
                  <li style={{ margin: 0 }}>
                    <button
                      style={getNavButtonStyle(isActive)}
                      onClick={() => handleItemClick(item.path)}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = "#f8fafc"
                          e.currentTarget.style.color = "#1e293b"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = "transparent"
                          e.currentTarget.style.color = "#475569"
                        }
                      }}
                    >
                      <div style={iconContainerStyle}>{item.icon}</div>
                      <span style={labelStyle}>{item.label}</span>
                    </button>
                  </li>
                  {/* קווי הפרדה אסתטיים */}
                  {(index === 1 || index === 4 || index === 7) && <div style={separatorStyle} />}
                </React.Fragment>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div style={footerStyle}>
          <button
            style={logoutButtonStyle}
            onClick={handleLogout}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#fef2f2"
              e.currentTarget.style.borderColor = "#fecaca"
              e.currentTarget.style.color = "#b91c1c"
              e.currentTarget.style.transform = "translateY(-1px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff"
              e.currentTarget.style.borderColor = "#e2e8f0"
              e.currentTarget.style.color = "#dc2626"
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            <LogoutIcon />
            <span style={{ flex: 1, textAlign: "right" }}>התנתק</span>
          </button>

          <div style={{ textAlign: "center" }}>
            <p style={copyrightStyle}>© {new Date().getFullYear()} TalkToMe.AI</p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default MySidebar
