"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { jsPDF } from "jspdf"
import { useSummary } from "../context/SummaryContext"
import UserPermissionDialog, { type User } from "./UserPermissionDialog"
import { Save, Edit, CopyIcon as ContentCopy, CheckCircle, Sparkles, Loader, AlertCircle, Download } from "lucide-react"
import ReactMarkdown from "react-markdown"
import dynamic from "next/dynamic"
import "../styleSheets/SummarizeFile.css"
import "../styleSheets/canva-editor.css"
const CanvasEditor = dynamic(() => import("../components/canvasEditor"), { ssr: false })

const SummaryFile: React.FC<{ fileUrl: string }> = ({ fileUrl }) => {
  const { summary, setSummary } = useSummary()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openPermissionDialog, setOpenPermissionDialog] = useState(false)
  const [copied, setCopied] = useState(false)
  const [typedSummary, setTypedSummary] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [permissionsSaved, setPermissionsSaved] = useState(false)

  const handleClosePermissionDialog = () => setOpenPermissionDialog(false)

  useEffect(() => {
    if (!summary) return

    setTypedSummary("")
    setIsTyping(true)

    let currentIndex = 0
    const typingSpeed = 15 // milliseconds per character

    const typingInterval = setInterval(() => {
      if (currentIndex < summary.length) {
        setTypedSummary((prev) => prev + summary[currentIndex])
        currentIndex++

        // Auto-scroll to keep up with typing
        if (summaryRef.current) {
          summaryRef.current.scrollTop = summaryRef.current.scrollHeight
        }
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)
      }
    }, typingSpeed)

    return () => clearInterval(typingInterval)
  }, [summary])

  const handleSavePermissionsAndSummary = async (users: User[]) => {
    console.log(users.map((user) => user.id))
    try {
      await axios.post(`https://${import.meta.env.VITE_API_BASE_URL}/api/files/assign-file-to-customers`, {
        FileUrl: fileUrl,
        UserIds: users.map((user) => user.id),
      })

      // Show success notification
      setPermissionsSaved(true)
      setTimeout(() => setPermissionsSaved(false), 3000)

      handleSaveSummary()
    } catch {
      setError("שגיאה בשמירת ההרשאות")
      return
    }
  }

  const handleSaveSummary = async () => {
    if (!summary) {
      alert("error")
      return
    }
    try {
      console.log(fileUrl)
      const summaryy = {
        FileUrl: fileUrl,
        summary: summary,
      }
      console.log("שולח נתונים:", summaryy)
      const response = await axios.post(`https://${import.meta.env.VITE_API_BASE_URL}/api/files/save-summary`, summaryy, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (response.data.success) {
        console.log("הסיכום נשמר בהצלחה!")
      } else {
        console.error("שגיאה בשמירת הסיכום")
        setError("שגיאה בשמירת הסיכום")
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("שגיאה לא צפויה. אנא נסה שוב.")
    }
  }

  const handleCopyToClipboard = () => {
    if (!summary) return

    navigator.clipboard
      .writeText(summary)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {
        setError("Failed to copy to clipboard")
      })
  }

  const handleDownloadPDF = () => {
    try {
      setLoading(true)

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

      const formatDate = (content: string | null) => {
        if (!content) return new Date().toLocaleDateString("he-IL")
        const firstLine = content.split("\n")[0]
        return firstLine.includes("תאריך:")
          ? firstLine.split("תאריך:")[1].trim()
          : new Date().toLocaleDateString("he-IL")
      }

      const getFileName = () => {
        const urlParts = fileUrl.split("/")
        const fileName = urlParts[urlParts.length - 1].split(".")[0] || "summary"
        return fileName
      }

      container.innerHTML = `
          <div style="width: 170mm; direction: rtl; text-align: right; font-family: Arial, sans-serif;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <div style="text-align: left;">
                <div style="font-size: 12px; color: #6b7280;">תאריך: ${formatDate(summary)}</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 28px; font-weight: bold; color: #0078c8;">
                  <span style="color: #0078c8;">TalkToMe.AI</span>
                </div>
              </div>
            </div>
            
            <div style="border-bottom: 2px solid #0078c8; margin-bottom: 20px;"></div>
            
            <h1 style="color: #0078c8; padding-bottom: 10px; font-size: 24px;">${getFileName()}</h1>
            
            <div style="white-space: pre-wrap; line-height: 1.7; font-size: 14px;">${summary}</div>
            
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
            pdf.save(`${getFileName()}.pdf`)
            document.body.removeChild(container)
            setError(null)
            setLoading(false)
          })
        })
        .catch((error) => {
          console.error("Failed to load html2canvas:", error)
          document.body.removeChild(container)
          setLoading(false)
          setError("שגיאה בהורדת PDF. אנא נסה שוב.")
        })
    } catch (error) {
      console.error("Failed to download PDF:", error)
      setError("שגיאה בהורדת PDF. אנא נסה שוב.")
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSaveCanvas = (editedText: string) => {
    try {
      setLoading(true)

      // Update the summary text
      if (editedText) {
        setSummary(editedText)
        setTypedSummary(editedText)
      }

      setIsEditing(false)
      setLoading(false)

      // Show success notification
      setError(null)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    } catch (error) {
      console.error("Failed to save summary:", error)
      setError("שגיאה בשמירת הסיכום. אנא נסה שוב.")
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    if (confirm("האם אתה בטוח שברצונך לבטל את העריכה? כל השינויים שלך יאבדו.")) {
      setIsEditing(false)
    }
  }

  const handleSavePermissionDialog = () => {
    setOpenPermissionDialog(true)
  }

  return (
    <div className="summary-container">
      <div className={`summary-card ${loading ? "loading" : ""} ${saveSuccess ? "saved" : ""}`}>
        {loading && (
          <div className="summary-loading-overlay">
            <div className="loading-spinner-container">
              <Loader className="loading-spinner" />
              <p>Saving summary...</p>
            </div>
          </div>
        )}

        <div className="card-content">
          <div className="card-header">
            <div className="title-container">
              <h2 className="card-title">Document Summary</h2>
              <div className="card-badge">
                <Sparkles size={14} />
                <span>AI Generated</span>
              </div>
            </div>
            <div className="card-info">
              <div className="info-pill">
                <span className="info-label">Words</span>
                <span className="info-value">{typedSummary.split(/\s+/).filter(Boolean).length}</span>
              </div>
              <div className="info-pill">
                <span className="info-label">Created</span>
                <span className="info-value">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="summary-content-wrapper">
            {isEditing ? (
              <CanvasEditor onSave={handleSaveCanvas} onCancel={handleCancelEdit} initialText={summary || ""} />
            ) : (
              <>
                <div className="summary-content" ref={summaryRef}>
                  <ReactMarkdown>{typedSummary}</ReactMarkdown>
                  {isTyping && <span className="typing-cursor">|</span>}
                </div>
              </>
            )}

            {typedSummary.length > 0 && !isTyping && !isEditing && (
              <div className="scroll-indicator">
                <div className="scroll-dot"></div>
                <div className="scroll-dot"></div>
                <div className="scroll-dot"></div>
              </div>
            )}
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {permissionsSaved && (
            <div className="success-notification">
              <div className="success-content">
                <div className="success-icon">
                  <CheckCircle size={20} />
                </div>
                <div className="success-text">
                  <span className="success-title">הרשאות נשמרו בהצלחה!</span>
                  <span className="success-subtitle">המשתמשים יוכלו לגשת לקובץ</span>
                </div>
              </div>
              <div className="success-progress"></div>
            </div>
          )}

          <div className="action-toolbar">
            {isEditing ? (
              <div className="canvas-actions-info">
                <span>השתמש בכלים למעלה לעריכת הקנבס</span>
              </div>
            ) : (
              <>
                <button className="toolbar-button" onClick={handleSavePermissionDialog} disabled={loading}>
                  <Save size={18} />
                  <span>Save</span>
                </button>

                <button
                  className={`toolbar-button ${copied ? "active" : ""}`}
                  onClick={handleCopyToClipboard}
                  title="Copy to clipboard"
                  disabled={loading}
                >
                  {copied ? <CheckCircle size={18} /> : <ContentCopy size={18} />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>

                <button className="toolbar-button" disabled={loading || isTyping} onClick={handleEdit}>
                  <Edit size={18} />
                  <span>Edit</span>
                </button>

                <button className="toolbar-button" disabled={loading} onClick={handleDownloadPDF}>
                  <Download size={18} />
                  <span>Download</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="card-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
          <div className="decoration-line line-1"></div>
          <div className="decoration-line line-2"></div>
          <div className="decoration-dot dot-1"></div>
          <div className="decoration-dot dot-2"></div>
          <div className="decoration-dot dot-3"></div>
          <div className="decoration-dot dot-4"></div>
        </div>
      </div>

      <UserPermissionDialog
        open={openPermissionDialog}
        onClose={handleClosePermissionDialog}
        onSave={handleSavePermissionsAndSummary}
      />
    </div>
  )
}

export default SummaryFile


