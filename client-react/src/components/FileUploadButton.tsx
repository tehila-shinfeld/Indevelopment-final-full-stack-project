
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useSummary } from "../context/SummaryContext"
import {
  FileText,
  Upload,
  X,
  Check,
  FileUp,
  Sparkles,
  Menu,
  Moon,
  Sun,
  ArrowUp,
  Loader2,
  Edit3,
  Calendar,
  User,
  AlertCircle,
} from "lucide-react"
import SummaryFile from "./SummarizeFile"
import axios from "axios"
import mammoth from "mammoth"
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist"
import "../styleSheets/FileUploadButton.css" // This will be replaced by the new CSS file
import { useNavigate } from "react-router-dom"
import MySidebar from "../components/my-sidbar"

// הגדרת מצבי התהליך הראשיים
type ProcessState =
  | "meeting-details" // מצב הזנת פרטי הפגישה - חדש!
  | "idle" // מצב התחלתי - אין קובץ
  | "file-selected" // קובץ נבחר אבל לא הועלה
  | "uploading" // מעלה קובץ לשרת
  | "processing" // מעבד את תוכן הקובץ
  | "ready-to-summarize" // מוכן ליצירת סיכום
  | "summarizing" // יוצר סיכום
  | "completed" // הסיכום מוכן

const FileUploadButton = () => {
  // מצבי העלאת קובץ
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const { summary, setSummary } = useSummary()
  const [fileTextContent, setFileTextContent] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [celebrationActive, setCelebrationActive] = useState(false)
  const [dragFileValid, setDragFileValid] = useState<boolean | null>(null)
  const [showDropSuccess, setShowDropSuccess] = useState(false)
  const [showDropError, setShowDropError] = useState(false)

  // מצבי פרטי הפגישה - חדש!
  const [meetingName, setMeetingName] = useState<string>("")
  const [meetingDate, setMeetingDate] = useState<string>("")
  const [meetingDetailsError, setMeetingDetailsError] = useState<string | null>(null)

  // מצב התהליך הראשי - זה המצב המרכזי שקובע מה מוצג
  const [processState, setProcessState] = useState<ProcessState>("meeting-details")

  // מצבי ממשק
  const [darkMode, setDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [s3url, sets3url] = useState<string | null>(null)
  const navigate = useNavigate()

  // טיפול בלחיצה על כפתור בחירת קובץ
  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  // טיפול בבחירת קובץ מהקלט
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0]
      setFile(selectedFile)
      setProcessState("file-selected")
      setError(null)
    }
  }

  // טיפול באירועי גרירה ושחרור
  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setDragging(true)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (!dragging) {
      setDragging(true)
    }
    // בדיקה אם הקובץ הנגרר הוא מסוג מתאים
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      const item = event.dataTransfer.items[0]
      const isValidType = item.type === "text/plain" || item.type === "application/pdf" || item.type.includes("word")
      if (isValidType) {
        setDragFileValid(true)
      } else {
        setDragFileValid(false)
      }
    }
  }

  // פונקציה לטיפול באירוע עזיבת הגרירה
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    // בדיקה אם העכבר יצא מהאלמנט ולא נכנס לאלמנט בן
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX
    const y = event.clientY
    if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
      setDragging(false)
      setDragFileValid(null)
    }
  }

  //פונקציה לטיפול בשחרור הקובץ
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setDragging(false)
    setDragFileValid(null)
    if (event.dataTransfer.files.length > 0) {
      const selectedFile = event.dataTransfer.files[0]
      const isValidType =
        selectedFile.type === "text/plain" ||
        selectedFile.type === "application/pdf" ||
        selectedFile.type.includes("word")
      if (isValidType) {
        setFile(selectedFile)
        setProcessState("file-selected")
        setError(null)
        // הפעלת אנימציית הצלחת שחרור
        setShowDropSuccess(true)
        setTimeout(() => setShowDropSuccess(false), 1500)
      } else {
        // הצגת שגיאה אם הקובץ אינו מסוג מתאים
        setError("סוג קובץ לא נתמך. אנא השתמש בקבצי PDF, TXT, או DOCX.")
        setProcessState("idle")
        // הפעלת אנימציית שגיאת שחרור
        setShowDropError(true)
        setTimeout(() => setShowDropError(false), 1500)
      }
    }
  }

  const logOut = () => {
    sessionStorage.removeItem("token") // הסרת הטוקן מהאחסון
    navigate("/") // ניווט לעמוד הכניסה
  }

  // פונקציה לטיפול בשליחת פרטי הפגישה
  const handleMeetingDetailsSubmit = () => {
    setMeetingDetailsError(null)
    // בדיקת תקינות הנתונים
    if (!meetingName.trim()) {
      setMeetingDetailsError("אנא הזן שם פגישה")
      return
    }
    if (!meetingDate) {
      setMeetingDetailsError("אנא בחר תאריך פגישה")
      return
    }
    // אם הכל תקין, עבור לשלב הבא
    setProcessState("idle")
  }

  // פונקציה לחזרה לעריכת פרטי הפגישה
  const handleEditMeetingDetails = () => {
    setProcessState("meeting-details")
  }

  // פונקציה לסגירת הודעות שגיאה
  const handleCloseError = () => {
    setError(null)
  }

  const handleCloseMeetingError = () => {
    setMeetingDetailsError(null)
  }

  // פונקציה מאוחדת להעלאה ועיבוד הקובץ
  const handleFileUploadAndProcess = async (selectedFile: File) => {
    setProcessState("uploading")
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 5
      })
    }, 200)

    try {
      // שלב 1: עיבוד תוכן הקובץ
      setProcessState("processing")
      let textContent = ""
      if (selectedFile.type === "text/plain") {
        // TXT
        const reader = new FileReader()
        textContent = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsText(selectedFile)
        })
      } else if (selectedFile.type === "application/pdf") {
        // PDF
        console.log("Processing PDF file:", selectedFile.name)
        const pdfData = await selectedFile.arrayBuffer()
        console.log("PDF data loaded, size:", pdfData.byteLength, "bytes")
        try {
          const pdf = await getDocument({ data: pdfData }).promise
          console.log(`PDF loaded successfully with ${pdf.numPages} pages`)
          textContent = ""
          for (let i = 1; i <= pdf.numPages; i++) {
            console.log(`Processing page ${i}/${pdf.numPages}...`)
            const page = await pdf.getPage(i)
            const content = await page.getTextContent()
            const pageText = content.items
              .map((item) => {
                if ("str" in item) {
                  return (item as { str: string }).str
                }
                return ""
              })
              .join(" ")
            console.log(`Page ${i} text length: ${pageText.length} characters`)
            textContent += pageText + "\n"
          }
          console.log(`Total extracted text length: ${textContent.length} characters`)
          if (textContent.length > 0) {
            console.log(`First 100 characters: "${textContent.substring(0, 100)}"`)
          } else {
            console.log("Warning: No text content extracted from PDF")
          }
        } catch (error) {
          console.error("Error processing PDF:", error)
          let errorMessage = "Unknown error"
          if (error instanceof Error) {
            errorMessage = error.message
          }
          throw new Error("Failed to extract text from PDF: " + errorMessage)
        }
      } else if (selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // DOCX
        const arrayBuffer = await selectedFile.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        textContent = result.value
      } else {
        throw new Error("Unsupported file type")
      }
      setFileTextContent(textContent) // שומר את התוכן
      console.log("📄 תוכן הקובץ:", textContent.substring(0, 300)) // תצוגה חלקית

      // שלב 2: העלאה לשרת
      console.log("➡️ שולח בקשה ליצירת כתובת העלאה לשרת...")
      try {
        console.log("📅 פרטי הפגישה:", meetingDate, meetingName)
        const response1 = await axios.post(`https://${import.meta.env.VITE_API_BASE_URL}/api/files/upload`, {
          fileName: meetingName,
          fileType: selectedFile.type,
          date: meetingDate,
        })
        // בדקי את תגובת השרת
        console.log("Upload URL created successfully:", response1.data)
        console.log("📤 מעלה קובץ לשרת:", response1.data)
        const { fileUrl, s3Url } = response1.data
        setFileUrl(fileUrl)
        sets3url(s3Url)
        try {
          await axios.put(fileUrl, selectedFile)
          console.log("File uploaded successfully to S3.")
        } catch (error) {
          console.error("Error uploading file to S3:", error)
          if (axios.isAxiosError(error)) {
            alert(`שגיאה בהעלאת הקובץ: ${error.response?.status} - ${error.response?.data?.message || error.message}`)
          } else {
            alert("אירעה שגיאה בלתי צפויה במהלך ההעלאה ל-S3.")
          }
        }
        // תוכלי להמשיך מכאן עם קוד להעלאה בפועל ל-S3
      } catch (error) {
        console.error("Error creating upload URL:", error)
        if (axios.isAxiosError(error)) {
          // שגיאה מהשרת (לדוגמה 500/403)
          alert(`שגיאה מהשרת: ${error.response?.status} - ${error.response?.data?.message || error.message}`)
        } else {
          // שגיאה כללית אחרת
          alert("אירעה שגיאה בלתי צפויה בעת יצירת קישור ההעלאה.")
        }
      }
      setUploadProgress(100)
      clearInterval(progressInterval)
      // מעבר למצב מוכן לסיכום
      setTimeout(() => {
        setProcessState("ready-to-summarize")
      }, 1000)
    } catch (error) {
      console.error("❌ שגיאה:", error)
      setError("שגיאה בהעלאה או בקריאה, נסי שוב.")
      setProcessState("file-selected")
      clearInterval(progressInterval)
    }
  }

  // פונקציה ליצירת סיכום
  const handleSummarize = async () => {
    if (!fileUrl || !fileTextContent) {
      setError("אין תוכן קובץ זמין לסיכום")
      return
    }
    setProcessState("summarizing")
    try {
      console.log("📄 מתחיל ליצור סיכום עבור הקובץ:", fileTextContent.substring(0, 100))
      const response = await axios.post(`https://${import.meta.env.VITE_API_BASE_URL}/api/files/summarize`, {
        text: fileTextContent,
      })
      setSummary(response.data.summary)
      console.log(response.data.summary) // הצגת הסיכום בקונסול;
      // setSummary("בלה בלה")
      // Show success animation
      setCelebrationActive(true)
      setTimeout(() => {
        setCelebrationActive(false)
        setProcessState("completed")
      }, 2000)
    } catch (error) {
      console.error("שגיאה בשליחת הבקשה:", error)
      setError("אירעה שגיאה ביצירת הסיכום")
      setProcessState("ready-to-summarize")
    }
  }

  // Reset function
  const handleReset = () => {
    setFile(null)
    setError(null)
    setUploadProgress(0)
    setProcessState("meeting-details") // חזרה לשלב הראשון
    setFileUrl(null)
    sets3url(null)
    setFileTextContent(null)
    setSummary(null)
    // איפוס פרטי הפגישה
    setMeetingName("")
    setMeetingDate("")
    setMeetingDetailsError(null)
  }

  // קבלת אייקון מתאים לסוג הקובץ
  const getFileIcon = () => {
    if (!file) return <Upload className="upload-icon" />
    const fileType = file.type
    if (fileType === "application/pdf") {
      return <FileText className="file-icon pdf" />
    } else if (fileType === "text/plain") {
      return <FileText className="file-icon txt" />
    } else if (fileType.includes("word")) {
      return <FileText className="file-icon docx" />
    }
    return <FileText className="file-icon" />
  }

  // פונקציה להחלפת מצב חושך/בהיר
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
  }

  // פונקציה לפתיחה/סגירה של התפריט
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev)
    // הוספת/הסרת מחלקה לגוף המסמך למניעת גלילה כשהתפריט פתוח
    if (!menuOpen) {
      document.body.classList.add("menu-open")
    } else {
      document.body.classList.remove("menu-open")
    }
  }

  // החלת מצב חושך על המסמך
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark-mode")
    } else {
      document.documentElement.classList.remove("dark-mode")
    }
  }, [darkMode])

  // בדיקת העדפת מצב חושך של המשתמש בטעינה ראשונית
  useEffect(() => {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    setDarkMode(prefersDarkMode)
    // האזנה לשינויים בהעדפת ערכת הנושא
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches)
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Add this useEffect to set up PDF.js worker
  useEffect(() => {
    // Set the worker source path for PDF.js
    if (!GlobalWorkerOptions.workerSrc) {
      console.log("Initializing PDF.js worker")
      // Use a CDN version that matches your installed version
      GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`
    }
  }, [])

  // קביעת כותרת הדף בהתאם לשלב הנוכחי
  const getHeaderTitle = () => {
    switch (processState) {
      case "meeting-details":
        return "פרטי הפגישה"
      case "idle":
        return "העלאת מסמך לסיכום"
      case "file-selected":
        return `קובץ נבחר: ${file?.name}`
      case "uploading":
      case "processing":
        return "מעבד את הקובץ..."
      case "ready-to-summarize":
        return "מוכן ליצירת סיכום"
      case "summarizing":
        return "יוצר סיכום..."
      case "completed":
        return `סיכום הקובץ ${file?.name}`
      default:
        return "העלאת מסמך לסיכום"
    }
  }

  // קביעת תוכן הודעת המצב
  const getStatusMessage = () => {
    switch (processState) {
      case "file-selected":
        return "הקובץ מוכן להעלאה ועיבוד"
      case "uploading":
        return `מעלה קובץ... ${uploadProgress}%`
      case "processing":
        return "רק רגע ..."
      case "ready-to-summarize":
        return "הקובץ עלה בהצלחה! כעת ניתן ליצור סיכום"
      case "summarizing":
        return "יוצר סיכום חכם של התוכן..."
      case "completed":
        return "הסיכום מוכן!"
      default:
        return ""
    }
  }

  return (
    <div className={`main-container ${darkMode ? "dark-mode" : ""}`}>
      {/* אלמנטי רקע */}
      <div className="background-elements">
        <div className="bg-gradient"></div>
        <div className="bg-pattern"></div>
        <div className="geometric-shape shape1"></div>
        <div className="geometric-shape shape2"></div>
        <div className="geometric-shape shape3"></div>
        <div className="geometric-shape shape4"></div>
      </div>

      {/* תפריט צד */}
      <MySidebar
        isOpen={menuOpen}
        onClose={() => {
          setMenuOpen(false)
          document.body.classList.remove("menu-open")
        }}
        user={{
          username: "משתמש",
          email: "user@example.com",
        }}
        onNavigate={(path) => {
          navigate(path)
          setMenuOpen(false)
          document.body.classList.remove("menu-open")
        }}
        onLogout={logOut}
        currentPath={window.location.pathname}
      />

      {/* הדר (Header) */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-controls">
            <button className="menu-button" onClick={toggleMenu} aria-label="תפריט">
              <Menu size={24} />
            </button>
            <button className="theme-toggle" onClick={toggleDarkMode} aria-label={darkMode ? "מצב בהיר" : "מצב חושך"}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <h1 className="dashboard-title">
            <FileText className="title-icon" size={24} />
            <span>{getHeaderTitle()}</span>
          </h1>
          <div className="header-right-group">
            <div className="logo" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
              <span className="logo-text">
                Ai.<span className="logo-highlight">TalkToMe</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* אנימציות */}
      {celebrationActive && (
        <div className="celebration-container">
          <div className="firework"></div>
          <div className="firework"></div>
          <div className="firework"></div>
          <div className="firework"></div>
          <div className="firework"></div>
        </div>
      )}

      <main className="app-content">
        <div className="content-container">
          {/* פס מידע פגישה - מוצג בכל השלבים חוץ מהזנת הפרטים */}
          {(processState === "idle" || processState === "file-selected") && meetingName && (
            <div className="meeting-info-bar">
              <div className="meeting-info">
                <div className="meeting-info-item">
                  <User size={16} />
                  <span className="meeting-name">{meetingName}</span>
                </div>
                <div className="meeting-info-item">
                  <Calendar size={16} />
                  <span className="meeting-date">{meetingDate}</span>
                </div>
              </div>
              <button className="edit-meeting-button" onClick={handleEditMeetingDetails}>
                <Edit3 size={16} />
                <span>עריכת פרטי פגישה</span>
              </button>
            </div>
          )}

          {processState === "meeting-details" ? (
            <div className="meeting-details-section">
              <div className="upload-card">
                <div className="meeting-illustration">
                  <div className="upload-illustration">
                    <div className="upload-icon-wrapper">
                      <FileText className="upload-icon" />
                      <div className="icon-pulse"></div>
                    </div>
                  </div>
                  <h2 className="upload-heading">פרטי הפגישה</h2>
                  <div className="upload-instructions">
                    <p>אנא הזן את פרטי הפגישה לפני העלאת המסמך</p>
                    <p>הפרטים יעזרו לנו ליצור סיכום מותאם ומדויק יותר</p>
                  </div>
                </div>
                <div className="meeting-form-content">
                  <div className="meeting-form">
                    <div className="form-group">
                      <label htmlFor="meetingName" className="form-label">
                        שם הפגישה
                      </label>
                      <input
                        type="text"
                        id="meetingName"
                        className="form-input"
                        placeholder="לדוגמה: פגישת צוות שבועית"
                        value={meetingName}
                        onChange={(e) => setMeetingName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="meetingDate" className="form-label">
                        תאריך הפגישה
                      </label>
                      <input
                        type="date"
                        id="meetingDate"
                        className="form-input"
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                      />
                    </div>
                    {meetingDetailsError && (
                      <div className="error-message closable">
                        <div className="error-content">
                          <AlertCircle size={16} />
                          <span>{meetingDetailsError}</span>
                        </div>
                        <button
                          className="close-error-button"
                          onClick={handleCloseMeetingError}
                          aria-label="סגור הודעה"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                    <button className="upload-button" onClick={handleMeetingDetailsSubmit}>
                      <span className="button-text">המשך להעלאת קובץ</span>
                      <ArrowUp size={18} className="button-icon" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : processState === "completed" ? (
            <div className="summary-section">
              {summary && (
                <>
                  <SummaryFile fileUrl={s3url ?? "bla bla"} />
                  <button className="new-document-button" onClick={handleReset}>
                    <span className="button-text">העלאת מסמך נוסף</span>
                    <FileUp size={18} className="button-icon" />
                  </button>
                </>
              )}
            </div>
          ) : (
            // כל שאר התוכן הקיים נשאר כמו שהוא...
            <div className="upload-section">
              <div className="upload-container">
                {/* הודעת מצב */}
                {getStatusMessage() && processState !== "idle" && (
                  <div className="status-message">
                    <div className="status-content">
                      {(processState === "uploading" ||
                        processState === "processing" ||
                        processState === "summarizing") && <Loader2 size={20} className="status-spinner" />}
                      {processState === "ready-to-summarize" && <Check size={20} className="status-check" />}
                      <span>{getStatusMessage()}</span>
                    </div>
                  </div>
                )}

                {/* שכבת עיבוד */}
                {(processState === "uploading" || processState === "processing" || processState === "summarizing") && (
                  <div className="processing-overlay">
                    <div className="processing-content">
                      <div className="processing-spinner">
                        {processState === "uploading" ? (
                          <div className="upload-animation">
                            <div className="file-icon-animated">
                              <FileText size={40} />
                            </div>
                            <div className="upload-progress-ring">
                              <svg viewBox="0 0 100 100" className="progress-ring">
                                <circle cx="50" cy="50" r="45" className="progress-ring-circle" />
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="45"
                                  className="progress-ring-circle-fill"
                                  style={{
                                    strokeDashoffset: 283 - (283 * uploadProgress) / 100,
                                  }}
                                />
                              </svg>
                              <div className="upload-arrow">
                                <ArrowUp size={24} />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="processing-animation">
                            <Loader2 size={40} className="spinner-icon" />
                            <Sparkles size={24} className="sparkle-icon" />
                          </div>
                        )}
                      </div>
                      <h3 className="processing-title">
                        {processState === "uploading" && "מעלה מסמך"}
                        {processState === "processing" && " רק רגע..."}
                        {processState === "summarizing" && "יוצר סיכום"}
                      </h3>
                      <p className="processing-description">
                        {processState === "uploading" && `רק רגע.. ${uploadProgress}%`}
                        {processState === "processing" && "  ממש עכשיו הקובץ שלך עולה לענן  "}
                        {processState === "summarizing" && "ה AI שלנו מכין לך סיכום מהיר ומדויק"}
                      </p>
                      <div className="processing-progress">
                        <div
                          className="progress-bar"
                          style={{
                            width: processState === "uploading" ? `${uploadProgress}%` : "90%",
                          }}
                        >
                          <div className="progress-glow"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* כרטיס העלאה */}
                <div
                  className={`upload-card ${dragging ? "dragging" : ""} ${
                    processState !== "idle" ? "has-file" : ""
                  } ${processState === "ready-to-summarize" ? "ready-to-summarize" : ""} ${
                    dragFileValid === true ? "valid-file" : ""
                  } ${dragFileValid === false ? "invalid-file" : ""} ${
                    showDropSuccess ? "drop-success" : ""
                  } ${showDropError ? "drop-error" : ""}`}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="card-decoration">
                    <div className="decoration-line line1"></div>
                    <div className="decoration-line line2"></div>
                    <div className="decoration-line line3"></div>
                    <div className="decoration-dot dot1"></div>
                    <div className="decoration-dot dot2"></div>
                    <div className="decoration-dot dot3"></div>
                  </div>

                  {/* Drag overlay */}
                  {dragging && (
                    <div
                      className={`drag-overlay ${dragFileValid === false ? "invalid" : ""} ${
                        dragFileValid === true ? "valid" : ""
                      }`}
                    >
                      <div className="drag-icon">
                        {dragFileValid === true && <FileUp size={48} />}
                        {dragFileValid === false && <X size={48} />}
                        {dragFileValid === null && <FileUp size={48} />}
                      </div>
                      <h3 className="drag-message">
                        {dragFileValid === true && "שחרר כדי להעלות את הקובץ"}
                        {dragFileValid === false && "סוג קובץ לא נתמך"}
                        {dragFileValid === null && "שחרר כאן את הקובץ"}
                      </h3>
                      <p className="drag-submessage">
                        {dragFileValid === true && "הקובץ מוכן להעלאה"}
                        {dragFileValid === false && "אנא השתמש בקבצי PDF, TXT, או DOCX"}
                        {dragFileValid === null && "אנו תומכים בקבצי PDF, TXT, ו-DOCX"}
                      </p>
                    </div>
                  )}

                  {processState === "idle" ? (
                    <>
                      <div className="upload-illustration">
                        <div className="upload-icon-wrapper">
                          <FileUp className="upload-icon" />
                          <div className="icon-pulse"></div>
                        </div>
                      </div>
                      <h2 className="upload-heading">העלאת המסמך שלך</h2>
                      <div className="upload-instructions">
                        <p>בחר קובץ PDF, TXT, או DOCX ליצירת סיכום</p>
                        <p>גרור ושחרר כאן או השתמש בכפתור למטה</p>
                      </div>
                      <button className="upload-button" onClick={handleButtonClick}>
                        <span className="button-text">בחר קובץ</span>
                        <FileUp size={18} className="button-icon" />
                      </button>
                      <div className="upload-info">
                        <span className="info-badge">מקסימום 5MB</span>
                        <span className="info-badge">העלאה מאובטחת</span>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="file-input"
                        onChange={handleFileChange}
                        accept=".pdf,.txt,.docx"
                      />
                    </>
                  ) : (
                    <div className="file-status">
                      <div className="file-preview">
                        <div className="file-icon-container">{getFileIcon()}</div>
                        <div className="file-info">
                          <p className="file-name">{file?.name}</p>
                          <p className="file-size">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ""}</p>
                        </div>
                        {processState === "file-selected" && (
                          <button className="reset-button" onClick={handleReset} aria-label="הסר קובץ">
                            <X size={18} />
                          </button>
                        )}
                      </div>

                      {/* הצגת שגיאה עם אפשרות סגירה */}
                      {error && (
                        <div className="error-message closable">
                          <div className="error-content">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                          </div>
                          <button className="close-error-button" onClick={handleCloseError} aria-label="סגור הודעה">
                            <X size={14} />
                          </button>
                        </div>
                      )}

                      {/* כפתורי פעולה בהתאם למצב */}
                      {processState === "file-selected" && (
                        <button className="process-button" onClick={() => file && handleFileUploadAndProcess(file)}>
                          <span className="button-text">התחל עיבוד</span>
                          <FileUp size={18} className="button-icon" />
                        </button>
                      )}
                      {processState === "ready-to-summarize" && (
                        <div className="summarize-action">
                          <button className="process-button summarize-button" onClick={handleSummarize}>
                            <span className="button-text">יצירת סיכום</span>
                            <Sparkles size={18} className="button-icon" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} TalkToMe.Ai - מאת תהילה שינפלד</p>
      </footer>
    </div>
  )
}

export default FileUploadButton
