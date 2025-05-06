"use client"

import type React from "react"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Calendar,
  Menu,
  X,
  User,
  PlusCircle,
  FileText,
  Clock,
  ExternalLink,
  Download,
  Share2,
  Trash2,
  RefreshCw,
  Filter,
  Sparkles,
  ArrowLeft,
  Copy,
  Printer,
  CheckCircle,
} from "lucide-react"
import "../styleSheets/UserMeetings.css"

interface Meeting {
  id: number
  name: string
  summaryContent: string
  summaryDate: Date
}

const UserMeetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchName, setSearchName] = useState("")
  const [searchDate, setSearchDate] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "recent" | "favorites">("all")
  const [animateHeader, setAnimateHeader] = useState(false)
  const [deletingMeetingId, setDeletingMeetingId] = useState<number | null>(null)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  // Toggle sidebar
  const toggleDrawer = (open: boolean) => {
    setMenuOpen(open)
    // Add body class to prevent scrolling when menu is open
    if (open) {
      document.body.classList.add("menu-open")
    } else {
      document.body.classList.remove("menu-open")
    }
  }

  // Reset search filters
  const resetSearch = () => {
    setSearchName("")
    setSearchDate("")

    // Add animation to show the reset action
    const searchContainer = document.querySelector(".search-container")
    searchContainer?.classList.add("reset-animation")
    setTimeout(() => {
      searchContainer?.classList.remove("reset-animation")
    }, 500)
  }

  // Highlight search matches
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text

    const parts = text.split(new RegExp(`(${query})`, "gi"))
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="highlight-text">
          {part}
        </span>
      ) : (
        part
      ),
    )
  }

  // Filter meetings based on search criteria and active filter
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesName = meeting.name.toLowerCase().includes(searchName.toLowerCase())
    const matchesDate = searchDate ? new Date(meeting.summaryDate).toISOString().split("T")[0] === searchDate : true

    // Apply additional filters based on activeFilter
    if (activeFilter === "recent") {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return matchesName && matchesDate && new Date(meeting.summaryDate) >= oneWeekAgo
    }

    // For demo purposes, let's assume meetings with even IDs are favorites
    if (activeFilter === "favorites") {
      return matchesName && matchesDate && meeting.id % 2 === 0
    }

    return matchesName && matchesDate
  })

  // Format date for display
  const formatDate = (dateString: Date | string | null | undefined) => {
    try {
      if (!dateString) {
        return "תאריך לא זמין"
      }

      const date = new Date(dateString)

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "תאריך לא תקין"
      }

      return new Intl.DateTimeFormat("he-IL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date)
    } catch (error) {
      console.error("Error formatting date:", error)
      return "תאריך לא זמין"
    }
  }

  // Handle card click to open in new tab
  const handleCardClick = (meeting: Meeting, event: React.MouseEvent) => {
    // בדיקה שיש לנו ID תקין לפני פתיחת החלון החדש
    if (meeting && meeting.id) {
      console.log("Opening meeting details with ID:", meeting.id)
      window.open(`${window.location.pathname}?meetingId=${meeting.id}`, "_blank")
    } else {
      console.error("Invalid meeting ID:", meeting)
    }
  }

  // Handle delete meeting
  const handleDeleteMeeting = (id: number, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent card click event
    setDeletingMeetingId(id)

    // Add exit animation to the card
    const card = (event.currentTarget as HTMLElement).closest(".meeting-card")
    if (card) {
      card.classList.add("deleting")
    }

    // Simulate API call to delete meeting
    setTimeout(() => {
      setMeetings((prevMeetings) => prevMeetings.filter((meeting) => meeting.id !== id))
      setDeletingMeetingId(null)
    }, 500) // Match this with the CSS animation duration
  }

  // Copy meeting summary to clipboard
  const handleCopyContent = () => {
    if (selectedMeeting) {
      navigator.clipboard.writeText(selectedMeeting.summaryContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Print meeting summary
  const handlePrint = () => {
    if (selectedMeeting) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${selectedMeeting.name}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  margin: 2cm;
                  direction: rtl;
                }
                h1 {
                  color: #333;
                  border-bottom: 1px solid #ddd;
                  padding-bottom: 10px;
                }
                .date {
                  color: #666;
                  margin-bottom: 20px;
                }
                .content {
                  white-space: pre-wrap;
                }
              </style>
            </head>
            <body>
              <h1>${selectedMeeting.name}</h1>
              <div class="date">תאריך: ${formatDate(selectedMeeting.summaryDate)}</div>
              <div class="content">${selectedMeeting.summaryContent}</div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
      }
    }
  }

  // Back to meetings list
  const handleBackToList = () => {
    // Remove the query parameter and reload the page
    const url = window.location.pathname
    window.history.pushState({}, "", url)
    setSelectedMeeting(null)
  }

  // Fetch meetings data
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get<Meeting[]>(`https://localhost:7136/api/files/get-user-meetings/9`)
        const meetingsData = response.data
        setMeetings(meetingsData)

        // Check if there's a meetingId in the URL
        const params = new URLSearchParams(window.location.search)
        const meetingId = params.get("meetingId")

        console.log("URL meetingId:", meetingId)
        console.log("Available meetings:", meetingsData)

        if (meetingId && meetingsData && meetingsData.length > 0) {
          // המרה ל-number רק אם meetingId הוא string תקין
          const meetingIdNum = Number.parseInt(meetingId, 10)

          if (!isNaN(meetingIdNum)) {
            console.log("Looking for meeting with ID:", meetingIdNum)
            const meeting = meetingsData.find((m: Meeting) => m.id === meetingIdNum)

            if (meeting) {
              console.log("Found meeting:", meeting)
              setSelectedMeeting(meeting)
            } else {
              console.error("Meeting not found with ID:", meetingIdNum)
            }
          } else {
            console.error("Invalid meetingId format:", meetingId)
          }
        }
      } catch (err) {
        console.error("Error fetching meetings:", err)
        setError("שגיאה בטעינת המשימות")
      } finally {
        setLoading(false)
      }
    }

    fetchMeetings()

    // Trigger header animation after a short delay
    setTimeout(() => {
      setAnimateHeader(true)
    }, 300)
  }, [])

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".dashboard-header")
      if (window.scrollY > 50) {
        header?.classList.add("header-scrolled")
      } else {
        header?.classList.remove("header-scrolled")
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Render meeting details view
  const renderMeetingDetails = () => {
    if (!selectedMeeting) return null

    return (
      <div className="meeting-details-container">
        <div className="meeting-details-header">
          <button className="back-button" onClick={handleBackToList}>
            <ArrowLeft size={20} />
            <span>חזרה לרשימת הישיבות</span>
          </button>
        </div>

        <div className="meeting-details-card">
          <div className="meeting-details-title-section">
            <h2 className="meeting-details-title">{selectedMeeting.name}</h2>
            <div className="meeting-details-date">
              <Calendar size={16} />
              <span>{formatDate(selectedMeeting.summaryDate)}</span>
            </div>
          </div>

          <div className="meeting-details-content">
            <p>{selectedMeeting.summaryContent}</p>
          </div>

          <div className="meeting-details-actions">
            <button className="details-action" onClick={handleCopyContent}>
              {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
              <span>{copied ? "הועתק!" : "העתק תוכן"}</span>
            </button>

            <button className="details-action" onClick={handlePrint}>
              <Printer size={18} />
              <span>הדפס</span>
            </button>

            <button className="details-action">
              <Share2 size={18} />
              <span>שתף</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Render meetings list view
  const renderMeetingsList = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loader">
            <svg viewBox="0 0 50 50" className="spinner">
              <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
            </svg>
          </div>
          <p>טוען סיכומי ישיבות...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="error-container">
          <div className="error-icon">!</div>
          <p>{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            נסה שוב
          </button>
        </div>
      )
    }

    if (filteredMeetings.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">
            <FileText size={48} />
          </div>
          <h3>אין סיכומי ישיבות</h3>
          <p>{searchName || searchDate ? "לא נמצאו תוצאות התואמות את החיפוש שלך" : "אין לך סיכומים כרגע"}</p>
          {searchName || searchDate ? (
            <button className="reset-search-button" onClick={resetSearch}>
              איפוס חיפוש
            </button>
          ) : (
            <button className="add-meeting-button" onClick={() => navigate("/summary-up!")}>
              <PlusCircle size={20} />
              <span>הוסף ישיבה חדשה</span>
            </button>
          )}
        </div>
      )
    }

    return (
      <div className="meetings-grid">
        {filteredMeetings.map((meeting, index) => (
          <div
            key={meeting.id}
            className={`meeting-card ${deletingMeetingId === meeting.id ? "deleting" : ""}`}
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={(e) => handleCardClick(meeting, e)}
          >
            <div className="card-header">
              <h3 className="meeting-title">{highlightMatch(meeting.name, searchName)}</h3>
              <div className="meeting-date">
                <Calendar size={14} />
                <span>{formatDate(meeting.summaryDate)}</span>
              </div>
            </div>
            <div className="card-content">
              <p className="meeting-summary">{meeting.summaryContent}</p>
            </div>
            <div className="card-actions">
              <button className="card-action" title="הורד" onClick={(e) => e.stopPropagation()}>
                <Download size={16} />
              </button>
              <button className="card-action" title="שתף" onClick={(e) => e.stopPropagation()}>
                <Share2 size={16} />
              </button>
              <button className="card-action delete" title="מחק" onClick={(e) => handleDeleteMeeting(meeting.id, e)}>
                <Trash2 size={16} />
              </button>
              <button className="card-expand" title="פתח בחלון חדש" onClick={(e) => e.stopPropagation()}>
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Overlay for sidebar */}
      {menuOpen && <div className="sidebar-overlay" onClick={() => toggleDrawer(false)} />}

      {/* Header */}
      <header className={`dashboard-header ${animateHeader ? "animate-header" : ""}`}>
        <div className="header-content">
          <button className="menu-button" onClick={() => toggleDrawer(true)} aria-label="תפריט">
            <Menu size={24} />
          </button>
          <h1 className="dashboard-title">
            <Sparkles className="title-icon" size={24} />
            <span>{selectedMeeting ? selectedMeeting.name : "סיכומי הישיבות שלי"}</span>
          </h1>
          <div className="header-actions">
            <button className="action-button add-meeting" onClick={() => navigate("/summary-up!")}>
              <PlusCircle size={20} />
              <span>ישיבה חדשה</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <button className="close-menu" onClick={() => toggleDrawer(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="user-profile">
          <div className="avatar">
            <User size={24} />
          </div>
          <div className="user-info">
            <h3>שלום, משתמש</h3>
            <p>ברוך הבא לדשבורד</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <button onClick={() => alert("האפשרות בתהליך פיתוח ותיפתח בקרוב 😋....")}>
                <User size={20} />
                <span>פרופיל שלי</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/summary-up!")}>
                <PlusCircle size={20} />
                <span>הוספת ישיבה</span>
              </button>
            </li>
            <li className="active">
              <button onClick={() => toggleDrawer(false)}>
                <FileText size={20} />
                <span>כל הישיבות שלי</span>
              </button>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <p>© {new Date().getFullYear()} סיכומי ישיבות</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard-content">
        {/* Show search and filters only in list view */}
        {!selectedMeeting && (
          <section className="search-section">
            <div className="search-container">
              <div className="search-input-group">
                <div className="search-input">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="חיפוש לפי שם"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </div>
                <div className="search-input">
                  <Calendar size={20} />
                  <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
                </div>
              </div>
              <button className="reset-button" onClick={resetSearch}>
                <RefreshCw size={16} />
                <span>איפוס</span>
              </button>
            </div>

            <div className="filter-tabs">
              <button
                className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                <Filter size={16} />
                <span>הכל</span>
              </button>
              <button
                className={`filter-tab ${activeFilter === "recent" ? "active" : ""}`}
                onClick={() => setActiveFilter("recent")}
              >
                <Clock size={16} />
                <span>אחרונים</span>
              </button>
              <button
                className={`filter-tab ${activeFilter === "favorites" ? "active" : ""}`}
                onClick={() => setActiveFilter("favorites")}
              >
                <Sparkles size={16} />
                <span>מועדפים</span>
              </button>
            </div>
          </section>
        )}

        {/* Meetings section - conditionally render list or details */}
        <section className="meetings-section">
          {selectedMeeting ? renderMeetingDetails() : renderMeetingsList()}
        </section>
      </main>
    </div>
  )
}

export default UserMeetings
