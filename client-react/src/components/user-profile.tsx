"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Mail,
  Building,
  Calendar,
  Edit3,
  Save,
  X,
  LogOut,
  Users,
  TrendingUp,
  Clock,
  Award,
  Moon,
  Sun,
  Heart,
  MessageSquare,
  Eye,
} from "lucide-react"
import "../styleSheets/user-prfile.css"

// Types
interface UserData {
  id: number
  username: string
  email: string
  company: string
  role: string
  createdAt: string
  updatedAt: string
}

interface Meeting {
  id: number
  title: string
  date: string
  participants: number
  status: "completed" | "active"
}

interface Activity {
  action: string
  item: string
  time: string
}

interface ChartData {
  month: string
  meetings: number
}

interface PieData {
  name: string
  value: number
  color: string
}

// Mock Data
const mockUserData: UserData = {
  id: 1,
  username: "יוסי כהן",
  email: "yossi@company.com",
  company: "טכנולוגיות מתקדמות בע״מ",
  role: "מנהל פרויקטים",
  createdAt: "2023-01-15T10:30:00Z",
  updatedAt: "2024-12-20T14:45:00Z",
}

const meetingsData: ChartData[] = [
  { month: "ינואר", meetings: 12 },
  { month: "פברואר", meetings: 19 },
  { month: "מרץ", meetings: 15 },
  { month: "אפריל", meetings: 22 },
  { month: "מאי", meetings: 18 },
  { month: "יוני", meetings: 25 },
]

const roleDistribution: PieData[] = [
  { name: "ישיבות שיצרתי", value: 65, color: "#d946ef" },
  { name: "ישיבות שהשתתפתי", value: 35, color: "#8b5cf6" },
]

const mockMeetings: Meeting[] = [
  { id: 1, title: "ישיבת צוות פיתוח", date: "2024-12-20", participants: 8, status: "completed" },
  { id: 2, title: "סקירת פרויקט Q4", date: "2024-12-19", participants: 12, status: "completed" },
  { id: 3, title: "תכנון אסטרטגי 2025", date: "2024-12-18", participants: 6, status: "completed" },
  { id: 4, title: "ישיבת לקוחות", date: "2024-12-17", participants: 4, status: "completed" },
  { id: 5, title: "סקירת ביצועים", date: "2024-12-16", participants: 10, status: "completed" },
  { id: 6, title: "ישיבת חירום", date: "2024-12-15", participants: 15, status: "completed" },
]

const mockRecentActivity: Activity[] = [
  { action: "יצר ישיבה", item: "ישיבת צוות פיתוח", time: "לפני שעתיים" },
  { action: "הצטרף לישיבה", item: "סקירת פרויקט Q4", time: "לפני 4 שעות" },
  { action: "עדכן פרופיל", item: "פרטי חברה", time: "לפני יום" },
  { action: "הוסיף למועדפים", item: "תכנון אסטרטגי 2025", time: "לפני יומיים" },
]

// Simple Chart Components
const BarChart = ({ data }: { data: ChartData[] }) => {
  const maxValue = Math.max(...data.map((d) => d.meetings))

  return (
    <div className="chart-container">
      <div className="bar-chart">
        {data.map((item, index) => (
          <div key={index} className="bar-item">
            <div
              className="bar"
              style={{
                height: `${(item.meetings / maxValue) * 100}%`,
              }}
            >
              <div className="bar-tooltip">{item.meetings}</div>
            </div>
            <div className="bar-label">{item.month}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const PieChart = ({ data }: { data: PieData[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  return (
    <div className="pie-chart-container">
      <svg className="pie-chart" viewBox="0 0 200 200">
        {data.map((item, index) => {
          const percentage = item.value / total
          const angle = percentage * 360
          const startAngle = currentAngle
          const endAngle = currentAngle + angle

          const x1 = 100 + 60 * Math.cos((startAngle * Math.PI) / 180)
          const y1 = 100 + 60 * Math.sin((startAngle * Math.PI) / 180)
          const x2 = 100 + 60 * Math.cos((endAngle * Math.PI) / 180)
          const y2 = 100 + 60 * Math.sin((endAngle * Math.PI) / 180)

          const largeArcFlag = angle > 180 ? 1 : 0

          const pathData = [`M 100 100`, `L ${x1} ${y1}`, `A 60 60 0 ${largeArcFlag} 1 ${x2} ${y2}`, `Z`].join(" ")

          currentAngle += angle

          return <path key={index} d={pathData} fill={item.color} className="pie-slice" />
        })}
        <circle cx="100" cy="100" r="30" fill="var(--background)" />
      </svg>
      <div className="pie-legend">
        {data.map((item, index) => (
          <div key={index} className="legend-item">
            <div className="legend-color" style={{ backgroundColor: item.color }} />
            <span className="legend-text">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Main Component
export default function UserProfile() {
  const [user, setUser] = useState<UserData>(mockUserData)
  const [isEditing, setIsEditing] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [showAllFavorites, setShowAllFavorites] = useState(false)
  const [editForm, setEditForm] = useState({
    username: user.username,
    email: user.email,
    company: user.company,
    role: user.role,
  })

  // Effects
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark-mode")
    }
  }, [])

  useEffect(() => {
    const savedFavorites = localStorage.getItem("userFavorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Handlers
  const toggleFavorite = (meetingId: number, event: React.MouseEvent) => {
    event.stopPropagation()

    setFavorites((prev) => {
      const newFavorites = prev.includes(meetingId) ? prev.filter((id) => id !== meetingId) : [...prev, meetingId]
      localStorage.setItem("userFavorites", JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add("dark-mode")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark-mode")
      localStorage.setItem("theme", "light")
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditForm({
      username: user.username,
      email: user.email,
      company: user.company,
      role: user.role,
    })
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          username: editForm.username,
          email: editForm.email,
          company: editForm.company,
          role: editForm.role,
        }),
      })

      if (response.ok) {
        setUser((prev) => ({ ...prev, ...editForm }))
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditForm({
      username: user.username,
      email: user.email,
      company: user.company,
      role: user.role,
    })
  }

  const handleLogout = () => {
    sessionStorage.removeItem("token")
    window.location.href = "/"
  }

  // Utility Functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Computed Values
  const favoriteMeetings = mockMeetings.filter((meeting) => favorites.includes(meeting.id))
  const displayedFavorites = showAllFavorites ? favoriteMeetings : favoriteMeetings.slice(0, 3)

  return (
    <div className="user-profile">
      <div className="profile-background" />
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <h1 className="profile-title">הפרופיל שלי</h1>
          <div className="header-actions">
            <button onClick={toggleDarkMode} className="btn btn-outline theme-toggle">
              {isDarkMode ? <Sun className="icon" /> : <Moon className="icon" />}
              {isDarkMode ? "מצב יום" : "מצב לילה"}
            </button>
            <button onClick={handleLogout} className="btn btn-destructive logout-btn">
              <LogOut className="icon" />
              יציאה מהחשבון
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-grid">
          {/* User Info Card */}
          <div className="card user-info-card">
            <div className="card-header user-header">
              <div className="user-avatar-section">
                <div className="avatar-container">
                  <div className="avatar user-avatar">
                    <div className="avatar-fallback">{getInitials(user.username)}</div>
                  </div>
                </div>
                {!isEditing && (
                  <button onClick={handleEdit} className="btn btn-ghost edit-btn">
                    <Edit3 className="icon" />
                  </button>
                )}
              </div>

              {!isEditing ? (
                <>
                  <h2 className="user-name">{user.username}</h2>
                  <p className="user-role">{user.role}</p>
                </>
              ) : (
                <div className="edit-form">
                  <div className="form-field">
                    <label htmlFor="username" className="form-label">
                      שם משתמש
                    </label>
                    <input
                      id="username"
                      value={editForm.username}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, username: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="role" className="form-label">
                      תפקיד
                    </label>
                    <input
                      id="role"
                      value={editForm.role}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, role: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="card-content user-details">
              {!isEditing ? (
                <>
                  <div className="detail-item email-item">
                    <Mail className="detail-icon" />
                    <span className="detail-text">{user.email}</span>
                  </div>

                  <div className="detail-item company-item">
                    <Building className="detail-icon" />
                    <span className="detail-text">{user.company}</span>
                  </div>

                  <div className="separator" />

                  <div className="date-info">
                    <div className="date-item">
                      <Calendar className="date-icon" />
                      <span>נרשם: {formatDate(user.createdAt)}</span>
                    </div>
                    <div className="date-item">
                      <Clock className="date-icon" />
                      <span>עודכן: {formatDate(user.updatedAt)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="edit-details">
                  <div className="form-field">
                    <label htmlFor="email" className="form-label">
                      אימייל
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="form-input"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="company" className="form-label">
                      חברה
                    </label>
                    <input
                      id="company"
                      value={editForm.company}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, company: e.target.value }))}
                      className="form-input"
                    />
                  </div>

                  <div className="form-actions">
                    <button onClick={handleSave} className="btn btn-primary save-btn">
                      <Save className="icon" />
                      שמור
                    </button>
                    <button onClick={handleCancel} className="btn btn-outline cancel-btn">
                      <X className="icon" />
                      ביטול
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Statistics and Content */}
          <div className="content-section">
            {/* Quick Stats */}
            <div className="stats-grid">
              <div className="card stat-card stat-upload">
                <div className="card-content stat-content">
                  <div className="stat-info">
                    <p className="stat-label">סה״כ ישיבות</p>
                    <p className="stat-value">127</p>
                  </div>
                  <Users className="stat-icon" />
                </div>
              </div>

              <div className="card stat-card stat-ai">
                <div className="card-content stat-content">
                  <div className="stat-info">
                    <p className="stat-label">ישיבות החודש</p>
                    <p className="stat-value">25</p>
                  </div>
                  <TrendingUp className="stat-icon" />
                </div>
              </div>

              <div className="card stat-card stat-share">
                <div className="card-content stat-content">
                  <div className="stat-info">
                    <p className="stat-label">דירוג פעילות</p>
                    <p className="stat-value">A+</p>
                  </div>
                  <Award className="stat-icon" />
                </div>
              </div>
            </div>

            {/* Practical Information */}
            <div className="info-grid">
              {/* Favorite Meetings */}
              <div className="card info-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <Heart className="title-icon" />
                    ישיבות מועדפות
                    <span className="badge count-badge">{favoriteMeetings.length}</span>
                  </h3>
                  <p className="card-description">הישיבות שסימנת כמועדפות</p>
                </div>
                <div className="card-content">
                  <div className="scroll-area favorites-scroll">
                    {favoriteMeetings.length === 0 ? (
                      <div className="empty-state">
                        <Heart className="empty-icon" />
                        <p className="empty-text">אין ישיבות מועדפות</p>
                      </div>
                    ) : (
                      <div className="favorites-list">
                        {displayedFavorites.map((meeting) => (
                          <div key={meeting.id} className="favorite-item">
                            <div className="favorite-content">
                              <h4 className="favorite-title">{meeting.title}</h4>
                              <div className="favorite-meta">
                                <span className="meta-item">
                                  <Calendar className="meta-icon" />
                                  {new Date(meeting.date).toLocaleDateString("he-IL")}
                                </span>
                                <span className="meta-item">
                                  <Users className="meta-icon" />
                                  {meeting.participants} משתתפים
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => toggleFavorite(meeting.id, e)}
                              className="btn btn-ghost favorite-btn"
                            >
                              <Heart className="favorite-heart filled" />
                            </button>
                          </div>
                        ))}
                        {favoriteMeetings.length > 3 && (
                          <button
                            onClick={() => setShowAllFavorites(!showAllFavorites)}
                            className="btn btn-ghost show-more-btn"
                          >
                            {showAllFavorites ? "הצג פחות" : `הצג עוד ${favoriteMeetings.length - 3}`}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card info-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <Eye className="title-icon" />
                    פעילות אחרונה
                  </h3>
                  <p className="card-description">הפעולות האחרונות שביצעת במערכת</p>
                </div>
                <div className="card-content">
                  <div className="scroll-area activity-scroll">
                    <div className="activity-list">
                      {mockRecentActivity.map((activity, index) => (
                        <div key={index} className="activity-item">
                          <div className="activity-dot" />
                          <div className="activity-content">
                            <p className="activity-text">
                              <span className="activity-action">{activity.action}</span>{" "}
                              <span className="activity-connector">את</span>{" "}
                              <span className="activity-item-name">"{activity.item}"</span>
                            </p>
                            <p className="activity-time">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="charts-grid">
              <div className="card chart-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <TrendingUp className="title-icon" />
                    ישיבות לפי חודש
                  </h3>
                  <p className="card-description">מגמת ההשתתפות בישיבות ב-6 החודשים האחרונים</p>
                </div>
                <div className="card-content">
                  <BarChart data={meetingsData} />
                </div>
              </div>

              <div className="card chart-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <Users className="title-icon" />
                    התפלגות תפקידים
                  </h3>
                  <p className="card-description">יחס בין ישיבות שיצרת לישיבות שהשתתפת בהן</p>
                </div>
                <div className="card-content">
                  <PieChart data={roleDistribution} />
                </div>
              </div>
            </div>

            {/* All Meetings */}
            <div className="card meetings-card">
              <div className="card-header">
                <h3 className="card-title">
                  <MessageSquare className="title-icon" />
                  כל הישיבות
                  <span className="badge count-badge">{mockMeetings.length}</span>
                </h3>
                <p className="card-description">רשימת כל הישיבות שלך - לחץ על הלב להוספה למועדפים</p>
              </div>
              <div className="card-content">
                <div className="scroll-area meetings-scroll">
                  <div className="meetings-list">
                    {mockMeetings.map((meeting) => (
                      <div key={meeting.id} className="meeting-item">
                        <div className="meeting-content">
                          <h4 className="meeting-title">{meeting.title}</h4>
                          <div className="meeting-meta">
                            <span className="meta-item">
                              <Calendar className="meta-icon" />
                              {new Date(meeting.date).toLocaleDateString("he-IL")}
                            </span>
                            <span className="meta-item">
                              <Users className="meta-icon" />
                              {meeting.participants} משתתפים
                            </span>
                            <span className={`badge status-badge ${meeting.status}`}>
                              {meeting.status === "completed" ? "הושלמה" : "פעילה"}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => toggleFavorite(meeting.id, e)}
                          className={`btn btn-ghost meeting-favorite-btn ${
                            favorites.includes(meeting.id) ? "favorited" : ""
                          }`}
                        >
                          <Heart className={`meeting-heart ${favorites.includes(meeting.id) ? "filled" : ""}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
