"use client"

import type React from "react"
import { useEffect, useState, useRef, useCallback } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {
  Calendar,
  Menu,
  X,
  User,
  PlusCircle,
  FileText,
  Clock,
  ExternalLink,
  Share2,
  Trash2,
  RefreshCw,
  Filter,
  Copy,
  Printer,
  CheckCircle,
  MessageSquareText,
  Zap,
  ArrowRight,
  AlertTriangle,
  ChevronUp,
  Star,
  StarOff,
  Info,
  AlertCircle,
  RefreshCcw,
  Moon,
  Sun,
  FileDown,
} from "lucide-react"
import "../styleSheets/UserMeetings.css"
import { useUser } from "../context/UserContext"
import jsPDF from "jspdf"

// ===== TYPES =====
interface Meeting {
  id: number
  name: string
  summaryContent: string
  meetingDate: Date
}

interface ErrorNotification {
  id: string
  type: "error" | "warning" | "info"
  title: string
  message: string
  actions?: {
    label: string
    onClick: () => void
    primary?: boolean
  }[]
}

interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

// ===== SUBCOMPONENTS =====

/**
 * Confirmation Dialog Component
 * Displays a modal dialog for confirming actions like deletion
 */
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null

  return (
    <div className="confirmation-overlay" onClick={onCancel}>
      <div className="confirmation-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-header">
          <h3 className="confirmation-title">
            <AlertTriangle size={20} />
            {title}
          </h3>
        </div>
        <div className="confirmation-content">
          <p>{message}</p>
        </div>
        <div className="confirmation-actions">
          <button className="cancel-button" onClick={onCancel}>
            לא
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            כן
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Scroll to Top Button Component
 * Appears when scrolling down and allows quick navigation to the top
 */
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  return (
    <button
      className={`scroll-to-top-button ${isVisible ? "visible" : ""}`}
      onClick={scrollToTop}
      aria-label="חזרה לראש הדף"
    >
      <ChevronUp size={20} />
    </button>
  )
}

/**
 * Error Notification System Component
 * Displays notifications for errors, warnings, and information
 */
const ErrorNotificationSystem: React.FC<{ notifications: ErrorNotification[]; onDismiss: (id: string) => void }> = ({
  notifications,
  onDismiss,
}) => {
  if (notifications.length === 0) return null

  return (
    <div className="error-notification-container">
      {notifications.map((notification) => (
        <div key={notification.id} className={`error-notification ${notification.type}`}>
          <div className="error-icon-container">
            {notification.type === "error" && <AlertCircle size={20} />}
            {notification.type === "warning" && <AlertTriangle size={20} />}
            {notification.type === "info" && <Info size={20} />}
          </div>
          <div className="error-content">
            <div className="error-title">{notification.title}</div>
            <div className="error-message">{notification.message}</div>

            {notification.actions && notification.actions.length > 0 && (
              <div className="error-actions">
                {notification.actions.map((action, index) => (
                  <button
                    key={index}
                    className={`error-action-button ${action.primary ? "primary" : "secondary"}`}
                    onClick={() => {
                      action.onClick()
                      onDismiss(notification.id)
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            <div className="error-progress">
              <div className="error-progress-bar"></div>
            </div>
          </div>
          <div className="error-close" onClick={() => onDismiss(notification.id)}>
            <X size={16} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ===== MAIN COMPONENT =====
const UserMeetings = () => {
  // ===== STATE =====
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
  const [isClosing, setIsClosing] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    meetingId: null as number | null,
    meetingName: "",
  })
  // const [notifications, setNotifications] = useState<ErrorNotification[]>([])
  const [scrollY, setScrollY] = useState(0)
  const [favorites, setFavorites] = useState<number[]>(() => {
    // Load favorites from localStorage on initial render
    const savedFavorites = localStorage.getItem("userFavorites")
    return savedFavorites ? JSON.parse(savedFavorites) : []
  })
  // Add dark mode state
  const [darkMode, setDarkMode] = useState(false)
  // Add PDF download state
  const [downloadingPdf, setDownloadingPdf] = useState(false)

  // ===== REFS =====
  const meetingsRef = useRef<HTMLDivElement>(null)

  // ===== HOOKS =====
  const navigate = useNavigate()
  const { user } = useUser()
  const userId = localStorage.getItem("userID")

  // ===== CSS VARIABLES =====
  const setPrimaryColor = useCallback(() => {
    document.documentElement.style.setProperty("--primary-400-rgb", "101, 195, 249")
  }, [])

  // ===== DARK MODE TOGGLE =====
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev)
  }, [])

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [darkMode])

  // Check for user's preferred color scheme on initial load
  useEffect(() => {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    setDarkMode(prefersDarkMode)

    // Listen for changes in color scheme preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    setPrimaryColor()
  }, [setPrimaryColor])

  // ===== SCROLL HANDLING =====
  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY)

    const header = document.querySelector(".dashboard-header")
    if (window.scrollY > 50) {
      header?.classList.add("header-scrolled")
    } else {
      header?.classList.remove("header-scrolled")
    }

    // Animate elements when they come into view
    const animateElements = document.querySelectorAll(".scroll-trigger")
    animateElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const elementVisible = 150

      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add("animated")
      }
    })

    // Animate cards with staggered delay
    const cardElements = document.querySelectorAll(".card-scroll-trigger")
    cardElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const elementVisible = 150

      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add("animated")
      }
    })
  }, [])

  // ===== NOTIFICATION MANAGEMENT =====
  // This function is kept but we won't actually show notifications
  const addNotification = useCallback((notification: Omit<ErrorNotification, "id">) => {
    // We're keeping this function but not actually showing notifications
    console.log("Notification (suppressed):", notification)

    // For critical errors, we'll set the error state instead
    if (notification.type === "error") {
      setError(notification.message)
    }
  }, [])

  // const dismissNotification = (id: string) => {
  //   setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  // }

  // ===== ERROR HANDLING =====
  const handleError = useCallback(
    (error: any, context: string) => {
      console.error(`Error in ${context}:`, error)

      // Instead of showing notifications, we'll just log errors
      // and handle critical errors differently

      // Network error
      if (error.message === "Network Error" || !navigator.onLine) {
        console.error("Network error detected")
        setError("אין חיבור לאינטרנט. בדוק את החיבור שלך ונסה שוב.")
        return
      }

      // Server error
      if (error.response) {
        const status = error.response.status

        // Authentication errors
        if (status === 401) {
          console.error("Authentication error")
          setError("פג תוקף החיבור שלך. אנא התחבר מחדש.")
          navigate("/login")
          return
        }

        // Forbidden
        if (status === 403) {
          console.error("Forbidden access")
          setError("אין לך הרשאה לבצע פעולה זו.")
          return
        }

        // Not found
        if (status === 404) {
          if (context === "fetchMeetings") {
            console.log("No meetings found")
            // Don't set error for this case
          } else if (context === "deleteMeeting") {
            console.log("Meeting not found for deletion")
          } else {
            setError("המשאב המבוקש לא נמצא.")
          }
          return
        }

        // Server error
        if (status >= 500) {
          console.error("Server error")
          setError("אירעה שגיאה בשרת. אנא נסה שוב מאוחר יותר.")
          return
        }
      }

      // Context-specific errors
      switch (context) {
        case "fetchMeetings":
          console.error("Error fetching meetings")
          setError("לא ניתן לטעון את רשימת הפגישות שלך. אנא נסה שוב.")
          break

        case "deleteMeeting":
          console.error("Error deleting meeting")
          setError("לא ניתן למחוק את הפגישה. אנא נסה שוב.")
          break

        case "userAuthentication":
          console.error("User authentication error")
          setError("לא ניתן לזהות את המשתמש. אנא התחבר מחדש.")
          break

        case "downloadPdf":
          console.error("Error downloading PDF")
          setError("לא ניתן להוריד את הקובץ. אנא נסה שוב.")
          break

        default:
          console.error("Unexpected error")
          setError("אירעה שגיאה לא צפויה. אנא נסה שוב.")
      }
    },
    [navigate],
  )

  // ===== UI INTERACTIONS =====
  const toggleDrawer = (open: boolean) => {
    setMenuOpen(open)
    // Add body class to prevent scrolling when menu is open
    if (open) {
      document.body.classList.add("menu-open")
    } else {
      document.body.classList.remove("menu-open")
    }
  }

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

  const toggleFavorite = (meetingId: number, event: React.MouseEvent) => {
    event.stopPropagation()

    setFavorites((prev) => {
      const newFavorites = prev.includes(meetingId) ? prev.filter((id) => id !== meetingId) : [...prev, meetingId]

      // Save to localStorage
      localStorage.setItem("userFavorites", JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  // ===== CONTENT FORMATTING =====
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

  // ===== FILTERING =====
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesName = meeting.name.toLowerCase().includes(searchName.toLowerCase())
    const matchesDate = searchDate ? new Date(meeting.summaryContent).toISOString().split("T")[0] === searchDate : true

    // Apply additional filters based on activeFilter
    if (activeFilter === "recent") {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return matchesName && matchesDate && new Date(meeting.summaryContent) >= oneWeekAgo
    }

    // Filter by favorites
    if (activeFilter === "favorites") {
      return matchesName && matchesDate && favorites.includes(meeting.id)
    }

    return matchesName && matchesDate
  })

  // ===== MEETING ACTIONS =====
  const handleCardClick = (meeting: Meeting) => {
    // Check if user is authenticated
    if (!userId) {
      handleError(new Error("User not authenticated"), "userAuthentication")
      return
    }

    // בדיקה שיש לנו ID תקין לפני פתיחת החלון החדש
    if (meeting && meeting.id) {
      console.log("Opening meeting details with ID:", meeting.id)
      window.open(`${window.location.pathname}?meetingId=${meeting.id}`, "_blank")
    } else {
      console.error("Invalid meeting ID:", meeting)
      addNotification({
        type: "error",
        title: "שגיאה בפתיחת פגישה",
        message: "לא ניתן לפתוח את פגישה. מזהה פגישה אינו תקין.",
      })
    }
  }

  const showDeleteConfirmation = (meeting: Meeting, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent card click event

    if (!userId) {
      handleError(new Error("User not authenticated"), "userAuthentication")
      return
    }

    setConfirmDialog({
      isOpen: true,
      meetingId: meeting.id,
      meetingName: meeting.name,
    })
  }

  const handleDeleteMeeting = async () => {
    if (!userId || !confirmDialog.meetingId) {
      handleError(new Error("User not authenticated or invalid meeting ID"), "userAuthentication")
      return
    }

    setDeletingMeetingId(confirmDialog.meetingId)

    // Find the card element
    const card = document.querySelector(`.meeting-card[data-id="${confirmDialog.meetingId}"]`)
    if (card) {
      card.classList.add("deleting")
    }

    try {
      console.log("Deleting meeting with ID:", confirmDialog.meetingId)
      console.log("Current user:", userId)

      await axios.delete(`https://localhost:7136/api/Meeting/${confirmDialog.meetingId}/User/${userId}`)

      setTimeout(() => {
        setMeetings((prevMeetings) => prevMeetings.filter((meeting) => meeting.id !== confirmDialog.meetingId))
        setDeletingMeetingId(null)

        // Show success notification
        addNotification({
          type: "info",
          title: "פגישה נמחקה",
          message: `פגישה "${confirmDialog.meetingName}" נמחקה בהצלחה.`,
          actions: [
            {
              label: "בטל מחיקה",
              onClick: () => {
                // This would typically call an API to restore the meeting
                // For now, we'll just show a notification
                addNotification({
                  type: "info",
                  title: "שחזור לא זמין",
                  message: "פונקציית השחזור אינה זמינה כרגע.",
                })
              },
              primary: true,
            },
          ],
        })
      }, 500)
    } catch (error) {
      console.error("Failed to remove user from meeting:", error)
      if (card) {
        card.classList.remove("deleting")
      }
      setDeletingMeetingId(null)
      handleError(error, "deleteMeeting")
    } finally {
      // Close the confirmation dialog
      setConfirmDialog({
        isOpen: false,
        meetingId: null,
        meetingName: "",
      })
    }
  }

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      meetingId: null,
      meetingName: "",
    })
  }

  const handleCopyContent = () => {
    if (selectedMeeting) {
      navigator.clipboard
        .writeText(selectedMeeting.summaryContent)
        .then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)

          // Show success notification
          addNotification({
            type: "info",
            title: "הועתק ללוח",
            message: "תוכן פגישה הועתק ללוח בהצלחה.",
          })
        })
        .catch((error) => {
          console.error("Failed to copy content:", error)
          addNotification({
            type: "error",
            title: "שגיאה בהעתקה",
            message: "לא ניתן להעתיק את התוכן ללוח. ייתכן שהדפדפן שלך אינו תומך בפעולה זו.",
          })
        })
    }
  }

  const handlePrint = () => {
    if (selectedMeeting) {
      try {
        const printWindow = window.open("", "_blank")
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>${selectedMeeting.name}</title>
                <style>
                  body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    line-height: 1.6;
                    margin: 2cm;
                    direction: rtl;
                    color: #1f2937;
                  }
                  h1 {
                    color: #0078c8;
                    border-bottom: 1px solid #e5e7eb;
                    padding-bottom: 10px;
                    font-weight: 700;
                  }
                  .date {
                    color: #6b7280;
                    margin-bottom: 20px;
                    font-size: 0.9rem;
                  }
                  .content {
                    white-space: pre-wrap;
                    line-height: 1.7;
                  }
                  .footer {
                    margin-top: 40px;
                    border-top: 1px solid #e5e7eb;
                    padding-top: 10px;
                    font-size: 0.8rem;
                    color: #9ca3af;
                    text-align: center;
                  }
                </style>
              </head>
              <body>
                <h1>${selectedMeeting.name}</h1>
                <div class="date">תאריך: ${formatDate(selectedMeeting.summaryContent)}</div>
                <div class="content">${selectedMeeting.summaryContent}</div>
                <div class="footer">הודפס מתוך מערכת AI.TalkToMe &copy; ${new Date().getFullYear()}</div>
              </body>
            </html>
          `)
          printWindow.document.close()
          printWindow.focus()

          // Add event listener for when the print window is closed
          const printWindowClosedInterval = setInterval(() => {
            if (printWindow.closed) {
              clearInterval(printWindowClosedInterval)
              // Focus back on the parent window
              window.focus()
            }
          }, 500)

          // Start the print dialog
          printWindow.print()

          // Show success notification
          addNotification({
            type: "info",
            title: "הדפסה",
            message: "מסמך פגישה נשלח להדפסה.",
          })
        } else {
          throw new Error("Could not open print window")
        }
      } catch (error) {
        console.error("Failed to print:", error)
        addNotification({
          type: "error",
          title: "שגיאה בהדפסה",
          message: "לא ניתן להדפיס את המסמך. ייתכן שהדפדפן שלך חוסם חלונות קופצים.",
        })
      }
    }
  }

  // ===== PDF DOWNLOAD FUNCTIONALITY =====
  const handleDownloadPDF = (meeting: Meeting, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation() // Prevent card click event if called from card
    }

    try {
      setDownloadingPdf(true)

      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Add a custom Hebrew font
      // We'll use a workaround for Hebrew text by creating an HTML element and rendering it to the PDF
      const container = document.createElement("div")
      container.style.position = "absolute"
      container.style.left = "-9999px"
      container.style.top = "-9999px"
      container.style.direction = "rtl"
      container.style.fontFamily = "Arial, sans-serif"
      document.body.appendChild(container)

      // Create the PDF content using HTML with fixed logo
      container.innerHTML = `
    <div style="width: 170mm; direction: rtl; text-align: right; font-family: Arial, sans-serif;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div style="text-align: left;">
          <div style="font-size: 12px; color: #6b7280;">תאריך: ${formatDate(meeting.summaryContent)}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 28px; font-weight: bold; color: #0078c8;">
            <span style="color: #0078c8;">TalkToMe.AI</span>
          </div>
        </div>
      </div>
      
      <div style="border-bottom: 2px solid #0078c8; margin-bottom: 20px;"></div>
      
      <h1 style="color: #0078c8; padding-bottom: 10px; font-size: 24px;">${meeting.name}</h1>
      
      <div style="white-space: pre-wrap; line-height: 1.7; font-size: 14px;">${meeting.summaryContent}</div>
      
      <div style="margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 10px; font-size: 12px; color: #9ca3af; text-align: center;">
        TalkToMe.AI © ${new Date().getFullYear()}
      </div>
    </div>
  `

      // Use html2canvas to render the HTML to an image
      import("html2canvas")
        .then((html2canvasModule) => {
          const html2canvas = html2canvasModule.default

          html2canvas(container, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
          }).then((canvas) => {
            // Convert the canvas to an image
            const imgData = canvas.toDataURL("image/jpeg", 1.0)

            // Add the image to the PDF
            pdf.addImage(imgData, "JPEG", 10, 10, 190, 0)

            // Save the PDF with the meeting name
            pdf.save(`${meeting.name.replace(/[^\w\s]/gi, "")}.pdf`)

            // Clean up
            document.body.removeChild(container)

            // Show success notification
            addNotification({
              type: "info",
              title: "הורדת PDF",
              message: "קובץ ה-PDF הורד בהצלחה.",
            })

            setDownloadingPdf(false)
          })
        })
        .catch((error) => {
          console.error("Failed to load html2canvas:", error)
          document.body.removeChild(container)
          setDownloadingPdf(false)
          handleError(error, "downloadPdf")
        })
    } catch (error) {
      console.error("Failed to download PDF:", error)
      handleError(error, "downloadPdf")

      addNotification({
        type: "error",
        title: "שגיאה בהורדת PDF",
        message: "לא ניתן להוריד את קובץ ה-PDF. אנא נסה שוב.",
      })

      setDownloadingPdf(false)
    }
  }

  const handleBackToList = () => {
    // Start closing animation
    setIsClosing(true)

    // Add animation class to the body
    document.body.classList.add("tab-closing")

    // Close the tab after animation completes
    setTimeout(() => {
      window.close()
    }, 600) // Match this with the CSS animation duration
  }

  // ===== EFFECTS =====
  // Fetch meetings data
  useEffect(() => {
    let isMounted = true // Add a flag to track component mount status

    const fetchMeetings = async () => {
      if (!userId) {
        console.error("User not authenticated")
        setLoading(false)
        setError("משתמש לא מזוהה. אנא התחבר מחדש.")
        handleError(new Error("User not authenticated"), "userAuthentication")
        return
      }

      try {
        console.log("Fetching meetings for user ID:", userId)
        const response = await axios.get<Meeting[]>(`https://localhost:7136/api/files/get-user-meetings/${userId}`)
        console.log("Fetched meetings:", response.data)
        const meetingsData = response.data

        if (meetingsData.length === 0) {
          // Show info notification for no meetings
          addNotification({
            type: "info",
            title: "אין ישיבות",
            message: "לא נמצאו ישיבות במערכת. צור פגישה חדשה כדי להתחיל.",
            actions: [
              {
                label: "צור פגישה חדשה",
                onClick: () => navigate("/summary-up!"),
                primary: true,
              },
            ],
          })
        } else {
          // Show success notification
          addNotification({
            type: "info",
            title: "נטענו בהצלחה",
            message: `נטענו ${meetingsData.length} ישיבות.`,
          })
        }

        if (isMounted) {
          setMeetings(meetingsData)
        }

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
              if (isMounted) {
                setSelectedMeeting(meeting)
              }
            } else {
              console.error("Meeting not found with ID:", meetingIdNum)
              addNotification({
                type: "warning",
                title: "פגישה לא נמצאה",
                message: `פגישה עם המזהה ${meetingIdNum} לא נמצאה.`,
                actions: [
                  {
                    label: "חזור לרשימה",
                    onClick: () => {
                      window.location.href = window.location.pathname
                    },
                    primary: true,
                  },
                ],
              })
            }
          } else {
            console.error("Invalid meetingId format:", meetingId)
            addNotification({
              type: "error",
              title: "מזהה פגישה לא תקין",
              message: "מזהה פגישה בכתובת אינו תקין.",
            })
          }
        }
      } catch (err) {
        console.error("Error fetching meetings:", err)
        if (isMounted) {
          setError("שגיאה בטעינת המשימות")
        }
        handleError(err, "fetchMeetings")
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchMeetings()

    // Trigger header animation after a short delay
    setTimeout(() => {
      if (isMounted) {
        setAnimateHeader(true)
      }
    }, 300)

    // Initialize scroll event listener
    window.addEventListener("scroll", handleScroll)

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", handleScroll)
      isMounted = false // Set the flag to false when the component unmounts
    }
  }, [userId, navigate, handleScroll, handleError, addNotification])

  // Add keyboard support for Escape key to close tab
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (confirmDialog.isOpen) {
          closeConfirmDialog()
        } else if (selectedMeeting) {
          handleBackToList()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedMeeting, confirmDialog.isOpen])

  // Initialize scroll animations after component mounts
  useEffect(() => {
    // Add scroll-trigger class to elements that should animate on scroll
    const addScrollTriggerClass = () => {
      // Add to meeting cards
      const cards = document.querySelectorAll(".meeting-card")
      cards.forEach((card) => {
        card.classList.add("card-scroll-trigger")
      })

      // Add to search section
      const searchSection = document.querySelector(".search-section")
      if (searchSection) {
        searchSection.classList.add("scroll-trigger")
      }

      // Add to filter tabs
      const filterTabs = document.querySelector(".filter-tabs")
      if (filterTabs) {
        filterTabs.classList.add("scroll-trigger")
      }
    }

    // Initialize after a short delay to ensure DOM is ready
    setTimeout(() => {
      addScrollTriggerClass()
      // Trigger initial scroll check
      handleScroll()
    }, 100)
  }, [handleScroll, meetings])

  // Add this after other useEffect hooks
  useEffect(() => {
    // This ensures favorites stay in sync if modified elsewhere
    localStorage.setItem("userFavorites", JSON.stringify(favorites))
  }, [favorites])

  // ===== RENDER METHODS =====
  // Render meeting details view
  const renderMeetingDetails = () => {
    if (!selectedMeeting) return null

    return (
      <div className={`meeting-details-container ${isClosing ? "closing" : ""}`}>
        <div className="meeting-details-header">
          <button className="modern-back-button" onClick={handleBackToList} aria-label="חזרה לרשימת המשימות">
            <ArrowRight size={18} />
            <span>חזרה לרשימת הפגישות</span>
          </button>
        </div>

        <div className="meeting-details-card">
          <div className="meeting-details-title-section">
            <h2 className="meeting-details-title">{selectedMeeting.name}</h2>
            <div className="meeting-details-date">
              <Calendar size={16} />
              <span>{formatDate(selectedMeeting.summaryContent)}</span>
            </div>
          </div>

          <div className="meeting-details-content">
            <p>{selectedMeeting.summaryContent}</p>
          </div>

          <div className="meeting-details-actions">
            <button className="details-action details-action-fixed" onClick={handleCopyContent}>
              {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
              <span>{copied ? "הועתק!" : "העתק תוכן"}</span>
            </button>

            <button className="details-action details-action-fixed" onClick={handlePrint}>
              <Printer size={18} />
              <span>הדפס</span>
            </button>

            <button
              className={`details-action details-action-fixed ${downloadingPdf ? "downloading" : ""}`}
              onClick={() => handleDownloadPDF(selectedMeeting)}
              disabled={downloadingPdf}
            >
              <FileDown size={18} />
              <span>{downloadingPdf ? "מוריד..." : "הורד PDF"}</span>
            </button>

            <button className="details-action details-action-fixed">
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
          <div className="error-icon">
            <AlertCircle size={24} />
          </div>
          <p>{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            <RefreshCcw size={16} />
            <span>נסה שוב</span>
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
            <button className="add-meeting-button magic-btn" onClick={() => navigate("/summary-up!")}>
              <div className="btn-content">
                <PlusCircle size={20} className="btn-icon" />
                <span>הוסף פגישה חדשה</span>
              </div>
              <div className="btn-glow"></div>
            </button>
          )}
          <div className="logo">
            <MessageSquareText size={24} className="logo-icon" />
            <span className="logo-text">
              AI.<span className="logo-highlight">TalkToMe</span>
            </span>
          </div>
        </div>
      )
    }

    return (
      <div className="meetings-grid" ref={meetingsRef}>
        {filteredMeetings.map((meeting) => (
          <div
            key={meeting.id}
            data-id={meeting.id}
            className={`meeting-card ${deletingMeetingId === meeting.id ? "deleting" : ""}`}
            onClick={() => handleCardClick(meeting)}
          >
            <div className="card-header">
              <h3 className="meeting-title">{highlightMatch(meeting.name, searchName)}</h3>
              <div className="meeting-date">
                <Calendar size={14} />
                <span>{formatDate(meeting.summaryContent)}</span>
              </div>
            </div>
            <div className="card-content">
              <p className="meeting-summary">{meeting.summaryContent}</p>
            </div>
            <div className="card-actions">
              <button
                className="card-action"
                title={favorites.includes(meeting.id) ? "הסר ממועדפים" : "הוסף למועדפים"}
                onClick={(e) => toggleFavorite(meeting.id, e)}
              >
                {favorites.includes(meeting.id) ? <Star size={16} /> : <StarOff size={16} />}
              </button>
              <button
                className="card-action"
                title="הורד PDF"
                onClick={(e) => handleDownloadPDF(meeting, e)}
                disabled={downloadingPdf}
              >
                <FileDown size={16} />
              </button>
              <button className="card-action" title="שתף" onClick={(e) => e.stopPropagation()}>
                <Share2 size={16} />
              </button>
              <button className="card-action delete" title="מחק" onClick={(e) => showDeleteConfirmation(meeting, e)}>
                <Trash2 size={16} />
              </button>
              <button
                className="card-expand"
                title="פתח בחלון חדש"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(`${window.location.pathname}?meetingId=${meeting.id}`, "_blank")
                }}
              >
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ===== MAIN RENDER =====
  return (
    <div className={`dashboard-container ${isClosing ? "page-closing" : ""}`}>
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title="אישור מחיקה"
        message={`האם אתה בטוח שברצונך למחוק את פגישה "${confirmDialog.meetingName}"?`}
        onConfirm={handleDeleteMeeting}
        onCancel={closeConfirmDialog}
      />

      {/* Overlay for sidebar */}
      {menuOpen && <div className="sidebar-overlay" onClick={() => toggleDrawer(false)} />}

      {/* Header */}
      <header className={`dashboard-header ${animateHeader ? "animate-header" : ""}`}>
        <div className="header-content">
          <div className="header-controls">
            <button className="menu-button" onClick={() => toggleDrawer(true)} aria-label="תפריט">
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
            <h3>שלום, {user?.username || "משתמש"}</h3>
            <p>ברוך הבא לדשבורד</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <button onClick={() => console.log("Profile clicked")}>
                <User size={20} />
                <span>פרופיל שלי</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/summary-up!")}>
                <PlusCircle size={20} />
                <span>הוספת פגישה</span>
              </button>
            </li>
            <li className="active">
              <button onClick={() => toggleDrawer(false)}>
                <FileText size={20} />
                <span>כל הפגישות שלי</span>
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
                  <input
                    type="text"
                    placeholder="חיפוש לפי שם"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </div>
                <div className="search-input date-input">
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
                <Star size={16} />
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

      {/* Scroll to top button */}
      <ScrollToTopButton />
    </div>
  )
}
export default UserMeetings
