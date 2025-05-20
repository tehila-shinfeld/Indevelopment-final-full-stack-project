"use client"

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
  User,
  Settings,
  ArrowUp,
  Loader2,
} from "lucide-react"
import SummaryFile from "./SummarizeFile"
import axios from "axios"
import mammoth from "mammoth"
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist"
import "pdfjs-dist/build/pdf.worker.entry"
import "../styleSheets/FileUploadButton.css"

const FileUploadButton = () => {
  // מצבי העלאת קובץ
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const { summary, setSummary } = useSummary()
  const [fileTextContent, setFileTextContent] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [uploading, setUploading] = useState(false)
  const [celebrationActive, setCelebrationActive] = useState(false)
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false)
  const [dragFileValid, setDragFileValid] = useState<boolean | null>(null)
  const [showDropSuccess, setShowDropSuccess] = useState(false)
  const [showDropError, setShowDropError] = useState(false)
  // מצבי מעבר תצוגה
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [processingStep, setProcessingStep] = useState<"upload" | "summarize" | "complete">("upload")
  const [showUploadAnimation, setShowUploadAnimation] = useState(false)
  // מצבי ממשק
  const [darkMode, setDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  // מצב חדש לבקרת תהליך העבודה
  const [isReadyToSummarize, setIsReadyToSummarize] = useState(false)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [s3url, sets3url] = useState<string | null>(null)

  // טיפול בלחיצה על כפתור בחירת קובץ
  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  // טיפול בבחירת קובץ מהקלט
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0]
      setFile(selectedFile)
      setUploadStatus("success") // הגדרת סטטוס להצלחה מיידית להצגת מידע על הקובץ
      setShowUploadAnimation(true)
      setTimeout(() => setShowUploadAnimation(false), 2000)
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
        setUploadStatus("success")
        setShowUploadAnimation(true)
        setTimeout(() => setShowUploadAnimation(false), 2000)

        // הפעלת אנימציית הצלחת שחרור
        setShowDropSuccess(true)
        setTimeout(() => setShowDropSuccess(false), 1500)
      } else {
        // הצגת שגיאה אם הקובץ אינו מסוג מתאים
        setError("סוג קובץ לא נתמך. אנא השתמש בקבצי PDF, TXT, או DOCX.")
        setUploadStatus("error")

        // הפעלת אנימציית שגיאת שחרור
        setShowDropError(true)
        setTimeout(() => setShowDropError(false), 1500)
      }
    }
  }

  // פונקציה 1: טיפול בהעלאת הקובץ בלבד
  const handleFileUpload = async (selectedFile: File) => {
    setUploading(true)
    setFile(selectedFile)
    setLoading(true)
    setProcessingStep("upload")

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
        const pdfData = await selectedFile.arrayBuffer()
        const pdf = await getDocument({ data: pdfData }).promise
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          const strings = content.items.map((item: any) => item.str)
          textContent += strings.join(" ") + "\n"
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

      // ⬇️ המשך התהליך הרגיל של ההעלאה לשרת
      const response1 = await axios.post("https://localhost:7136/api/files/upload", {
        fileName: selectedFile.name,
      })

      const { fileUrl, s3Url } = response1.data
      setFileUrl(fileUrl)
      sets3url(s3Url)

      await axios.put(fileUrl, selectedFile, {
        headers: {
          "Content-Type": selectedFile.type,
        },
      })

      // Complete the progress bar
      setUploadProgress(100)
      clearInterval(progressInterval)

      // Show completion animation
      setShowCompletionAnimation(true)
      setTimeout(() => {
        setShowCompletionAnimation(false)
        setIsReadyToSummarize(true)
      }, 1500)
    } catch (error) {
      console.error("❌ שגיאה:", error)
      setError("שגיאה בהעלאה או בקריאה, נסי שוב.")
      setUploadStatus("error")
      clearInterval(progressInterval)
    } finally {
      setUploading(false)
      setLoading(false)
    }
  }

  // פונקציה 2: טיפול בסיכום הקובץ בלבד
  const handleSummarize = async () => {
    if (!fileUrl) {
      alert("No file URL provided!")
      return
    }
    setLoading(true)
    setProcessingStep("summarize")

    try {
      const response = await axios.post("https://localhost:7136/api/files/summarize", {
        text: fileTextContent,
      })
      setSummary(response.data.summary)

      // Show success animation
      setCelebrationActive(true)
      setTimeout(() => {
        setCelebrationActive(false)
        setActiveStep(1)
      }, 2000)
    } catch (error) {
      console.error("שגיאה בשליחת הבקשה:", error)
      setError("אירעה שגיאה בשליחת הבקשה")
      setUploadStatus("error")
    } finally {
      setLoading(false)
    }
  }

  // Reset function
  const handleReset = () => {
    setFile(null)
    setUploadStatus("idle")
    setError(null)
    setUploadProgress(0)
    setIsReadyToSummarize(false)
    setActiveStep(0)
    setFileUrl(null)
    sets3url(null)
    setFileTextContent(null)
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
  // Add it right after the existing useEffect hooks
  useEffect(() => {
    // Set the worker source path for PDF.js
    if (!GlobalWorkerOptions.workerSrc) {
      GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${getDocument.version}/pdf.worker.js`
    }
  }, [])

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
      {menuOpen && <div className="sidebar-overlay" onClick={toggleMenu} />}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <button className="close-menu" onClick={toggleMenu} aria-label="סגור תפריט">
            <X size={24} />
          </button>
        </div>
        <div className="user-profile">
          <div className="avatar">
            <User size={24} />
          </div>
          <div className="user-info">
            <h3>שלום, משתמש</h3>
            <p>ברוך הבא למערכת</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <button onClick={() => console.log("פרופיל נלחץ")}>
                <User size={20} />
                <span>פרופיל שלי</span>
              </button>
            </li>
            <li>
              <button onClick={() => console.log("העלאת מסמך נלחץ")}>
                <FileUp size={20} />
                <span>העלאת מסמך</span>
              </button>
            </li>
            <li>
              <button onClick={() => console.log("הסיכומים שלי נלחץ")}>
                <FileText size={20} />
                <span>הסיכומים שלי</span>
              </button>
            </li>
            <li>
              <button onClick={() => console.log("הגדרות נלחצו")}>
                <Settings size={20} />
                <span>הגדרות</span>
              </button>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <p>© {new Date().getFullYear()} TalkToMe.AI</p>
        </div>
      </aside>

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
            <span>העלאת מסמך לסיכום</span>
          </h1>
          <div className="header-right-group">
            <button className="add-meeting-button">
              <div className="btn-content">
                <Sparkles size={18} className="btn-icon" />
                <span className="button-text">סיכום חדש</span>
              </div>
            </button>
            <div className="logo" style={{ cursor: "pointer" }}>
              <span className="logo-text">
                TalkToMe.<span className="logo-highlight">AI</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* אנימציות */}
      {showUploadAnimation && <div className="upload-animation-container"></div>}
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
        <div className={`content-container ${isTransitioning ? "transitioning" : ""}`}>
          {activeStep === 0 ? (
            <div className="upload-section">
              <div className="upload-container">
                {loading ? (
                  <div className="processing-overlay">
                    <div className="processing-content">
                      <div className="processing-spinner">
                        {processingStep === "upload" ? (
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
                      <h3 className="processing-title">{processingStep === "upload" ? "מעלה מסמך" : "מייצר סיכום"}</h3>
                      <p className="processing-description">
                        {processingStep === "upload"
                          ? `מעבד את הקובץ שלך... ${uploadProgress}%`
                          : "ה-AI שלנו מנתח את המסמך שלך..."}
                      </p>
                      <div className="processing-progress">
                        <div
                          className="progress-bar"
                          style={{
                            width: processingStep === "upload" ? `${uploadProgress}%` : "90%",
                          }}
                        >
                          <div className="progress-glow"></div>
                        </div>
                      </div>

                      {showCompletionAnimation && (
                        <div className="completion-animation">
                          <div className="success-checkmark">
                            <div className="check-icon">
                              <span className="icon-line line-tip"></span>
                              <span className="icon-line line-long"></span>
                            </div>
                          </div>
                          <div className="completion-text">העיבוד הושלם בהצלחה!</div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`upload-card ${dragging ? "dragging" : ""} ${uploadStatus !== "idle" ? "has-file" : ""} ${dragFileValid === true ? "valid-file" : ""} ${dragFileValid === false ? "invalid-file" : ""} ${showDropSuccess ? "drop-success" : ""} ${showDropError ? "drop-error" : ""}`}
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
                        className={`drag-overlay ${dragFileValid === false ? "invalid" : ""} ${dragFileValid === true ? "valid" : ""}`}
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

                    {uploadStatus === "idle" ? (
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
                          {uploadStatus !== "uploading" && (
                            <button className="reset-button" onClick={handleReset} aria-label="הסר קובץ">
                              <X size={18} />
                            </button>
                          )}
                        </div>

                        {uploadStatus === "uploading" && (
                          <div className="upload-progress-container">
                            <div
                              className={`upload-progress-bar ${uploadStatus === "success" ? "success" : ""} ${uploadStatus === "error" ? "error" : ""}`}
                              style={{ width: `${uploadProgress}%` }}
                            >
                              <div className="progress-pulse"></div>
                            </div>
                          </div>
                        )}

                        <div className="upload-status">
                          {uploadStatus === "uploading" && <p>מעלה... {uploadProgress}%</p>}
                          {uploadStatus === "success" && !loading && (
                            <p className="success-message">
                              <Check size={16} /> הקובץ מוכן לעיבוד
                            </p>
                          )}
                          {uploadStatus === "error" && <p className="error-message">{error}</p>}
                        </div>

                        {/* שלב 1: כפתור העלאה */}
                        {uploadStatus === "success" && !isReadyToSummarize && !loading && (
                          <button className="process-button" onClick={() => file && handleFileUpload(file)}>
                            <span className="button-text">העלאת הקובץ</span>
                            <FileUp size={18} className="button-icon" />
                          </button>
                        )}

                        {/* שלב 2: כפתור סיכום (מופיע רק לאחר העלאה מוצלחת) */}
                        {isReadyToSummarize && !loading && (
                          <button className="process-button summarize-button" onClick={handleSummarize}>
                            <span className="button-text">יצירת סיכום</span>
                            <Sparkles size={18} className="button-icon" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="summary-section">
              {summary && (
                <>
                  <SummaryFile fileUrl={summary} />
                  <button className="new-document-button" onClick={handleReset}>
                    <span className="button-text">העלאת מסמך נוסף</span>
                    <FileUp size={18} className="button-icon" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} TalkToMe.Ai - מאת תהילה שינפלד • </p>
      </footer>
    </div>
  )
}

export default FileUploadButton
