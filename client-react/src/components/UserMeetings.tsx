"use client"

import type React from "react"
import { useEffect, useState, useRef, useCallback } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import {
  Calendar,
  PlusCircle,
  FileText,
  Clock,
  ExternalLink,
  Trash2,
  RefreshCw,
  Filter,
  Copy,
  Printer,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  ChevronUp,
  Star,
  StarOff,
  AlertCircle,
  RefreshCcw,
  FileDown,
} from "lucide-react"
import { useUser } from "../context/UserContext"
import jsPDF from "jspdf"
import { Header } from "./header"
import "../styleSheets/UserMeetings.css"

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
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    meetingId: null as number | null,
    meetingName: "",
  })
  const [favorites, setFavorites] = useState<number[]>(() => {
    const savedFavorites = localStorage.getItem("userFavorites")
    return savedFavorites ? JSON.parse(savedFavorites) : []
  })
  const [darkMode, setDarkMode] = useState(false)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailSentSuccess, setEmailSentSuccess] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list" | "compact">(() => {
    const savedViewMode = localStorage.getItem("meetingsViewMode")
    return (savedViewMode as "grid" | "list" | "compact") || "grid"
  })

  const meetingsRef = useRef<HTMLDivElement>(null)

  const navigate = useNavigate()
  const { user } = useUser()
  const userId = localStorage.getItem("userID")

  const setPrimaryColor = useCallback(() => {
    document.documentElement.style.setProperty("--primary-400-rgb", "101, 195, 249")
  }, [])

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev)
  }, [])

  useEffect(() => {
    localStorage.setItem("meetingsViewMode", viewMode)
  }, [viewMode])

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [darkMode])

  useEffect(() => {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    setDarkMode(prefersDarkMode)

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

  const handleScroll = useCallback(() => {
    const header = document.querySelector(".dashboard-header")
    if (window.scrollY > 50) {
      header?.classList.add("header-scrolled")
    } else {
      header?.classList.remove("header-scrolled")
    }

    const animateElements = document.querySelectorAll(".scroll-trigger")
    animateElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const elementVisible = 150

      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add("animated")
      }
    })

    const cardElements = document.querySelectorAll(".card-scroll-trigger")
    cardElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const elementVisible = 150

      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add("animated")
      }
    })
  }, [])

  const addNotification = useCallback((notification: Omit<ErrorNotification, "id">) => {
    console.log("Notification (suppressed):", notification)

    if (notification.type === "error") {
      setError(notification.message)
    }
  }, [])

  const handleError = useCallback(
    (error: any, context: string) => {
      console.error(`Error in ${context}:`, error)

      if (error.message === "Network Error" || !navigator.onLine) {
        console.error("Network error detected")
        setError("אין חיבור לאינטרנט. בדוק את החיבור שלך ונסה שוב.")
        return
      }

      if (error.response) {
        const status = error.response.status

        if (status === 401) {
          console.error("Authentication error")
          setError("פג תוקף החיבור שלך. אנא התחבר מחדש.")
          navigate("/")
          return
        }

        if (status === 403) {
          console.error("Forbidden access")
          setError("אין לך הרשאה לבצע פעולה זו.")
          return
        }

        if (status === 404) {
          if (context === "fetchMeetings") {
            console.log("No meetings found")
          } else if (context === "deleteMeeting") {
            console.log("Meeting not found for deletion")
          } else {
            setError("המשאב המבוקש לא נמצא.")
          }
          return
        }

        if (status >= 500) {
          console.error("Server error")
          setError("אירעה שגיאה בשרת. אנא נסה שוב מאוחר יותר.")
          return
        }
      }

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

  const toggleDrawer = (open: boolean) => {
    setMenuOpen(open)
    if (open) {
      document.body.classList.add("menu-open")
    } else {
      document.body.classList.remove("menu-open")
    }
  }

  const resetSearch = () => {
    setSearchName("")
    setSearchDate("")

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

      localStorage.setItem("userFavorites", JSON.stringify(newFavorites))
      return newFavorites
    })
  }

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

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesName = meeting.name.toLowerCase().includes(searchName.toLowerCase())
    const matchesDate = searchDate ? new Date(meeting.summaryContent).toISOString().split("T")[0] === searchDate : true

    if (activeFilter === "recent") {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return matchesName && matchesDate && new Date(meeting.summaryContent) >= oneWeekAgo
    }

    if (activeFilter === "favorites") {
      return matchesName && matchesDate && favorites.includes(meeting.id)
    }

    return matchesName && matchesDate
  })

  const handleCardClick = (meeting: Meeting) => {
    console.log("Card clicked for meeting:", meeting.id, meeting.name)

    if (!userId) {
      handleError(new Error("User not authenticated"), "userAuthentication")
      return
    }

    if (meeting && meeting.id) {
      setSelectedMeeting(meeting)
      const newUrl = `${window.location.pathname}?meetingId=${meeting.id}`
      window.history.pushState({ meetingId: meeting.id }, "", newUrl)
      console.log("Meeting selected:", meeting.name)
    } else {
      console.error("Invalid meeting ID:", meeting)
      addNotification({
        type: "error",
        title: "שגיאה בפתיחת פגישה",
        message: "לא ניתן לפתוח את פגישה. מזהה פגישה אינו תקין.",
      })
    }
  }

  const handleOpenInNewTab = (meeting: Meeting, event: React.MouseEvent) => {
    event.stopPropagation()

    console.log("Opening in new tab:", meeting.id)

    if (!userId) {
      handleError(new Error("User not authenticated"), "userAuthentication")
      return
    }

    if (meeting && meeting.id) {
      // שמירת נתוני הפגישה ב-localStorage במקום sessionStorage כדי שיהיו זמינים בין כרטיסיות
      const tempKey = `meeting_${meeting.id}`
      localStorage.setItem(tempKey, JSON.stringify(meeting))

      // יצירת URL שמתאים לניתוב מבוסס האש של האפליקציה
      // שימוש ב-/user-meetings כנתיב במקום הנתיב הנוכחי
      const baseUrl = window.location.origin
      const newUrl = `${baseUrl}/user-meetings?meetingId=${meeting.id}&userId=${userId}`

      console.log("New tab URL:", newUrl)

      const newTab = window.open(newUrl, "_blank")

      if (!newTab) {
        addNotification({
          type: "warning",
          title: "חלון חדש נחסם",
          message: "הדפדפן חסם את פתיחת החלון החדש. אנא אפשר חלונות קופצים או נסה שוב.",
        })
      } else {
        addNotification({
          type: "info",
          title: "נפתח בכרטיסייה חדשה",
          message: `פגישה "${meeting.name}" נפתחה בכרטיסייה חדשה.`,
        })
      }
    }
  }

  const handleBackToMeetingsList = () => {
    setSelectedMeeting(null)
    const newUrl = window.location.pathname
    window.history.pushState({}, "", newUrl)
  }

  const showDeleteConfirmation = (meeting: Meeting, event: React.MouseEvent) => {
    event.stopPropagation()

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

    const card = document.querySelector(`.meeting-card[data-id="${confirmDialog.meetingId}"]`)
    if (card) {
      card.classList.add("deleting")
    }

    try {
      await axios.delete(
        `https://${import.meta.env.VITE_API_BASE_URL}/api/Meeting/${confirmDialog.meetingId}/User/${userId}`,
      )

      setTimeout(() => {
        setMeetings((prevMeetings) => prevMeetings.filter((meeting) => meeting.id !== confirmDialog.meetingId))
        setDeletingMeetingId(null)

        addNotification({
          type: "info",
          title: "פגישה נמחקה",
          message: `פגישה "${confirmDialog.meetingName}" נמחקה בהצלחה.`,
          actions: [
            {
              label: "בטל מחיקה",
              onClick: () => {
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

          const printWindowClosedInterval = setInterval(() => {
            if (printWindow.closed) {
              clearInterval(printWindowClosedInterval)
              window.focus()
            }
          }, 500)

          printWindow.print()

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

  const handleDownloadPDF = (meeting: Meeting, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }

    try {
      setDownloadingPdf(true)

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const container = document.createElement("div")
      container.style.position = "absolute"
      container.style.left = "-9999px"
      container.style.top = "-9999px"
      container.style.direction = "rtl"
      container.style.fontFamily = "Arial, sans-serif"
      document.body.appendChild(container)

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

      import("html2canvas")
        .then((html2canvasModule) => {
          const html2canvas = html2canvasModule.default

          html2canvas(container, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
          }).then((canvas) => {
            const imgData = canvas.toDataURL("image/jpeg", 1.0)

            pdf.addImage(imgData, "JPEG", 10, 10, 190, 0)

            pdf.save(`${meeting.name.replace(/[^\w\s]/gi, "")}.pdf`)

            document.body.removeChild(container)

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

  const logOut = () => {
    localStorage.removeItem("token")
    sessionStorage.removeItem("token")
    localStorage.removeItem("userID")
    navigate("/")
  }

  const handleSendToEmail = async (meeting: Meeting, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }

    try {
      setSendingEmail(true)

      const token = sessionStorage.getItem("token")

      if (!token) {
        addNotification({
          type: "error",
          title: "לא מחובר",
          message: "לא נמצא טוקן. אנא התחבר מחדש.",
        })
        setSendingEmail(false)
        return
      }
      let userEmail = ""
      try {
        const decodedToken: any = jwtDecode(token)

        userEmail = decodedToken.email
        console.log("email", userEmail)

        if (!userEmail) {
          addNotification({
            type: "error",
            title: "שגיאת טוקן",
            message: "לא נמצאה כתובת אימייל בטוקן.",
          })
          setSendingEmail(false)
          return
        }
      } catch (err) {
        console.error("שגיאה בפענוח הטוקן:", err)
        addNotification({
          type: "error",
          title: "טוקן לא תקין",
          message: "לא ניתן לפענח את הטוקן. אנא התחבר מחדש.",
        })
        setSendingEmail(false)
        return
      }

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const container = document.createElement("div")
      container.style.position = "absolute"
      container.style.left = "-9999px"
      container.style.top = "-9999px"
      container.style.direction = "rtl"
      container.style.fontFamily = "Arial, sans-serif"
      document.body.appendChild(container)

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

      const html2canvasModule = await import("html2canvas")
      const html2canvas = html2canvasModule.default

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      })

      const imgData = canvas.toDataURL("image/jpeg", 1.0)
      pdf.addImage(imgData, "JPEG", 10, 10, 190, 0)

      const pdfBlob = pdf.output("blob")

      const formData = new FormData()
      formData.append("email", userEmail)
      formData.append("subject", `סיכום פגישה: ${meeting.name}`)
      formData.append("message", `מצורף סיכום הפגישה "${meeting.name}" מתאריך ${formatDate(meeting.summaryContent)}.`)
      formData.append("attachment", pdfBlob, `${meeting.name.replace(/[^\w\s]/gi, "")}.pdf`)

      await axios.post(`https://${import.meta.env.VITE_API_BASE_URL}/api/email/send-with-attachment`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      document.body.removeChild(container)

      addNotification({
        type: "info",
        title: "אימייל נשלח",
        message: `סיכום הפגישה נשלח לכתובת ${userEmail} בהצלחה.`,
      })

      setEmailSentSuccess(true)
      setTimeout(() => {
        setEmailSentSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Failed to send email:", error)
      handleError(error, "sendEmail")

      addNotification({
        type: "error",
        title: "שגיאה בשליחת אימייל",
        message: "לא ניתן לשלוח את האימייל. אנא נסה שוב.",
      })
    } finally {
      setSendingEmail(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const fetchMeetings = async () => {
      if (!userId) {
        console.error("User not authenticated")
        setLoading(false)
        setError("משתמש לא מזוהה. אנא התחבר מחדש.")
        handleError(new Error("User not authenticated"), "userAuthentication")
        return
      }

      try {
        const response = await axios.get<Meeting[]>(
          `https://${import.meta.env.VITE_API_BASE_URL}/api/files/get-user-meetings/${userId}`,
        )
        const meetingsData = response.data

        if (meetingsData.length === 0) {
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
          addNotification({
            type: "info",
            title: "נטענו בהצלחה",
            message: `נטענו ${meetingsData.length} ישיבות.`,
          })
        }

        if (isMounted) {
          setMeetings(meetingsData)
        }

        // Handle meetingId from URL parameters
        const params = new URLSearchParams(window.location.search)
        const meetingId = params.get("meetingId")

        if (meetingId) {
          const meetingIdNum = Number.parseInt(meetingId, 10)

          if (!isNaN(meetingIdNum)) {
            // נסה למצוא את הפגישה ברשימת הפגישות שנטענו
            let meeting = meetingsData.find((m: Meeting) => m.id === meetingIdNum)

            // אם הפגישה לא נמצאה, נסה לקחת אותה מ-localStorage
            if (!meeting) {
              const tempKey = `meeting_${meetingIdNum}`
              const storedMeetingData = localStorage.getItem(tempKey)

              if (storedMeetingData) {
                try {
                  meeting = JSON.parse(storedMeetingData)
                  console.log("Found meeting in localStorage:", meeting)

                  // הוסף את הפגישה לרשימת הפגישות אם היא לא קיימת שם
                  if (!meetingsData.some((m) => m.id === meetingIdNum)) {
                    setMeetings((prev) => [...prev, meeting])
                  }
                } catch (error) {
                  console.error("Error parsing stored meeting data:", error)
                }
              }
            }

            if (meeting && isMounted) {
              setSelectedMeeting(meeting)
              console.log("Selected meeting from URL parameters:", meeting)
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

    setTimeout(() => {
      if (isMounted) {
        setAnimateHeader(true)
      }
    }, 300)

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      isMounted = false
    }
  }, [userId, navigate, handleScroll, handleError, addNotification])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (confirmDialog.isOpen) {
          closeConfirmDialog()
        } else if (selectedMeeting) {
          handleBackToMeetingsList()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedMeeting, confirmDialog.isOpen])

  useEffect(() => {
    const addScrollTriggerClass = () => {
      const cards = document.querySelectorAll(".meeting-card")
      cards.forEach((card) => {
        card.classList.add("card-scroll-trigger")
      })

      const searchSection = document.querySelector(".search-section")
      if (searchSection) {
        searchSection.classList.add("scroll-trigger")
      }

      const filterTabs = document.querySelector(".filter-tabs")
      if (filterTabs) {
        filterTabs.classList.add("scroll-trigger")
      }
    }

    setTimeout(() => {
      addScrollTriggerClass()
      handleScroll()
    }, 100)
  }, [handleScroll, meetings])

  useEffect(() => {
    localStorage.setItem("userFavorites", JSON.stringify(favorites))
  }, [favorites])

  const renderMeetingDetails = () => {
    if (!selectedMeeting) return null

    return (
      <div className="meeting-details-container">
        <div className="meeting-details-header">
          <button className="modern-back-button" onClick={handleBackToMeetingsList} aria-label="חזרה לרשימת הפגישות">
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

            <button
              className={`details-action details-action-fixed ${sendingEmail ? "downloading" : ""}`}
              onClick={() => handleSendToEmail(selectedMeeting)}
              disabled={sendingEmail}
            >
              <FileText size={18} />
              <span>{sendingEmail ? "שולח..." : "שלח לאימייל"}</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderMeetingsList = () => {
    if (loading) {
      return (
        <div className="loading-container-centered">
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
        </div>
      )
    }

    const renderGridView = () => (
      <div className="meetings-grid-enhanced" ref={meetingsRef}>
        {filteredMeetings.map((meeting, index) => (
          <div
            key={meeting.id}
            data-id={meeting.id}
            className={`meeting-card-enhanced ${deletingMeetingId === meeting.id ? "deleting" : ""}`}
            onClick={() => handleCardClick(meeting)}
          >
            <div className={`card-accent-bar accent-${(index % 5) + 1}`}></div>

            <div className="card-content-enhanced">
              <div className="card-header-enhanced">
                <div className="meeting-info-enhanced">
                  <h3 className="meeting-title-enhanced">{highlightMatch(meeting.name, searchName)}</h3>
                  <div className="meeting-date-enhanced">
                    <Calendar size={16} />
                    <span>{formatDate(meeting.summaryContent)}</span>
                  </div>
                </div>

                <div className="meeting-status-enhanced">
                  {favorites.includes(meeting.id) && (
                    <div className="favorite-indicator-enhanced">
                      <Star size={16} fill="currentColor" />
                    </div>
                  )}
                </div>
              </div>

              <div className="card-actions-enhanced">
                <button
                  className="action-btn-enhanced favorite-btn"
                  title={favorites.includes(meeting.id) ? "הסר ממועדפים" : "הוסף למועדפים"}
                  onClick={(e) => toggleFavorite(meeting.id, e)}
                >
                  {favorites.includes(meeting.id) ? <Star size={18} fill="currentColor" /> : <StarOff size={18} />}
                </button>
                <button
                  className="action-btn-enhanced download-btn"
                  title="הורד PDF"
                  onClick={(e) => handleDownloadPDF(meeting, e)}
                  disabled={downloadingPdf}
                >
                  <FileDown size={18} />
                </button>
                <button
                  className="action-btn-enhanced email-btn"
                  title="שלח לאימייל"
                  onClick={(e) => handleSendToEmail(meeting, e)}
                  disabled={sendingEmail}
                >
                  <FileText size={18} />
                </button>
                <button
                  className="action-btn-enhanced delete-btn"
                  title="מחק"
                  onClick={(e) => showDeleteConfirmation(meeting, e)}
                >
                  <Trash2 size={18} />
                </button>
                <button
                  className="action-btn-enhanced expand-btn"
                  title="פתח בחלון חדש"
                  onClick={(e) => handleOpenInNewTab(meeting, e)}
                >
                  <ExternalLink size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )

    const renderListView = () => (
      <div className="meetings-list-view" ref={meetingsRef}>
        {filteredMeetings.map((meeting, index) => (
          <div
            key={meeting.id}
            data-id={meeting.id}
            className={`meeting-item-list ${deletingMeetingId === meeting.id ? "deleting" : ""}`}
            onClick={() => handleCardClick(meeting)}
          >
            <div className={`list-accent-indicator accent-${(index % 5) + 1}`}></div>

            <div className="list-content">
              <div className="list-main-info">
                <h3 className="list-title">{highlightMatch(meeting.name, searchName)}</h3>
              </div>

              <div className="list-meta">
                <div className="list-date">
                  <Calendar size={14} />
                  <span>{formatDate(meeting.summaryContent)}</span>
                </div>
                {favorites.includes(meeting.id) && (
                  <div className="list-favorite">
                    <Star size={14} fill="currentColor" />
                  </div>
                )}
              </div>
            </div>

            <div className="list-actions">
              <button
                className="list-action-btn favorite-btn"
                title={favorites.includes(meeting.id) ? "הסר ממועדפים" : "הוסף למועדפים"}
                onClick={(e) => toggleFavorite(meeting.id, e)}
              >
                {favorites.includes(meeting.id) ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
              </button>

              <button
                className="list-action-btn download-btn"
                title="הורד PDF"
                onClick={(e) => handleDownloadPDF(meeting, e)}
                disabled={downloadingPdf}
              >
                <FileDown size={16} />
              </button>

              <button
                className="list-action-btn email-btn"
                title="שלח לאימייל"
                onClick={(e) => handleSendToEmail(meeting, e)}
                disabled={sendingEmail}
              >
                <FileText size={16} />
              </button>

              <button
                className="list-action-btn delete-btn"
                title="מחק"
                onClick={(e) => showDeleteConfirmation(meeting, e)}
              >
                <Trash2 size={16} />
              </button>

              <button
                className="list-action-btn expand-btn"
                title="פתח בחלון חדש"
                onClick={(e) => handleOpenInNewTab(meeting, e)}
              >
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    )

    const renderCompactView = () => (
      <div className="meetings-compact-view" ref={meetingsRef}>
        {filteredMeetings.map((meeting, index) => (
          <div
            key={meeting.id}
            data-id={meeting.id}
            className={`meeting-item-compact ${deletingMeetingId === meeting.id ? "deleting" : ""}`}
            onClick={() => handleCardClick(meeting)}
          >
            <div className={`compact-accent accent-${(index % 5) + 1}`}></div>

            <div className="compact-info">
              <h4 className="compact-title">{highlightMatch(meeting.name, searchName)}</h4>
              <span className="compact-date">{formatDate(meeting.summaryContent)}</span>
            </div>

            <div className="compact-status">
              {favorites.includes(meeting.id) && <Star size={12} fill="currentColor" className="compact-favorite" />}
            </div>

            <div className="compact-actions">
              <button className="compact-action-btn" title="פתח" onClick={(e) => handleOpenInNewTab(meeting, e)}>
                <ExternalLink size={14} />
              </button>
              <button
                className="compact-action-btn delete-btn"
                title="מחק"
                onClick={(e) => showDeleteConfirmation(meeting, e)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    )

    switch (viewMode) {
      case "list":
        return renderListView()
      case "compact":
        return renderCompactView()
      default:
        return renderGridView()
    }
  }

  return (
    <div className="dashboard-container">
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title="אישור מחיקה"
        message={`האם אתה בטוח שברצונך למחוק את פגישה "${confirmDialog.meetingName}"?`}
        onConfirm={handleDeleteMeeting}
        onCancel={closeConfirmDialog}
      />

      {menuOpen && <div className="sidebar-overlay" onClick={() => toggleDrawer(false)} />}

      <Header
        animateHeader={animateHeader}
        toggleDrawer={toggleDrawer}
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
        selectedMeeting={selectedMeeting}
        menuOpen={menuOpen}
        user={user ?? undefined}
        onLogout={logOut}
      />

      <main className="dashboard-content">
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

              <div className="view-mode-selector">
                <button
                  className={`view-mode-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="תצוגת כרטיסים"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </button>
                <button
                  className={`view-mode-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="תצוגת רשימה"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
                <button
                  className={`view-mode-btn ${viewMode === "compact" ? "active" : ""}`}
                  onClick={() => setViewMode("compact")}
                  title="תצוגה קומפקטית"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="2" />
                    <rect x="3" y="10" width="18" height="2" />
                    <rect x="3" y="16" width="18" height="2" />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="meetings-section">
          {selectedMeeting ? renderMeetingDetails() : renderMeetingsList()}
        </section>
      </main>

      <ScrollToTopButton />
      {sendingEmail && (
        <div className="email-overlay">
          <div className="email-container">
            <div className="email-animation">
              <div className="email-spinner">
                <div className="spinner-circle"></div>
                <div className="spinner-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
              <div className="email-content">
                <h3>שולח אימייל...</h3>
                <p>מכין את קובץ ה-PDF ושולח לתיבת הדואר שלך</p>
                <div className="loading-progress">
                  <div className="progress-bar"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {emailSentSuccess && (
        <div className="email-overlay">
          <div className="email-container success">
            <div className="email-animation">
              <div className="success-icon">
                <CheckCircle size={60} />
                <div className="success-ripple"></div>
              </div>
              <div className="email-content">
                <h3>המייל נשלח בהצלחה!</h3>
                <p>סיכום הפגישה נשלח לתיבת הדואר שלך</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="footer-bottom">
        <p className="copyright">© 2025 TalkToMe.AI. כל הזכויות שמורות.</p>
        <div className="social-links">
          <a href="mailto:talktome.ai2025@gmail.com" aria-label="Email">
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
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </a>
          <a href="#" aria-label="LinkedIn">
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
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
          <a href="https://github.com/tehila-shinfeld" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
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
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

export default UserMeetings
