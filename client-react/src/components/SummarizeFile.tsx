"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { useSummary } from "../context/SummaryContext"
import UserPermissionDialog, { type User } from "./UserPermissionDialog"
import { Save, Edit, CopyIcon as ContentCopy, CheckCircle, Sparkles, Loader, AlertCircle, Download, Share2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import "../styleSheets/SummarizeFile.css"



const SummaryFile: React.FC<{ fileUrl: string }> = ({ fileUrl }) => {
    const { summary } = useSummary()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [openPermissionDialog, setOpenPermissionDialog] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [copied, setCopied] = useState(false)
    const [typedSummary, setTypedSummary] = useState("")
    const [isTyping, setIsTyping] = useState(true)
    const [saveSuccess, setSaveSuccess] = useState(false)
    const summaryRef = useRef<HTMLDivElement>(null)

    const handleOpenPermissionDialog = () => setOpenPermissionDialog(true)
    const handleClosePermissionDialog = () => setOpenPermissionDialog(false)

    // Typing effect for summary text
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

    useEffect(() => {
        console.log("📂 URL חדש התקבל:", fileUrl)
    }, [fileUrl])

    const handleSavePermissionsAndSummary = async (users: User[]) => {
        setLoading(true)
        setError(null)
        setSelectedUsers(users)
        console.log(users.map((user) => user.id))

        try {
            // Save permissions
           const res = await axios.post("https://localhost:7136/api/files/assign-file-to-customers", {
                FileUrl: fileUrl,
                UserserIds: users.map((user) => user.id),
            })

            console.log("הרשאות נשמרו בהצלחה!")
            await handleSaveSummary()
        } catch (err) {
            setError("Error saving permissions. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // Save summary to DB
    const handleSaveSummary = async () => {
        if (!summary) {
            setError("No summary to save")
            return
        }

        try {
            const summaryData = {
                FileUrl: fileUrl,
                summary: summary,
            }

            console.log("שולח נתונים:", summaryData)

            const response = await axios.post("https://localhost:7136/api/files/save-summary", summaryData, {
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (response.data.success) {
                console.log("הסיכום נשמר בהצלחה!")
                // Show success animation
                setSaveSuccess(true)
                triggerSuccessAnimation()
                setTimeout(() => {
                    setSaveSuccess(false)
                }, 3000)
            } else {
                console.error("שגיאה בשמירת הסיכום")
                setError("Error saving summary. Please try again.")
            }
        } catch (err) {
            setError("Unexpected error. Please try again.")
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

    const triggerSuccessAnimation = () => {
        // Create success particles container if it doesn't exist
        let particlesContainer = document.querySelector(".success-particles-container")

        if (!particlesContainer) {
            particlesContainer = document.createElement("div")
            particlesContainer.className = "success-particles-container"
            document.body.appendChild(particlesContainer)
        } else {
            // Clear existing particles
            particlesContainer.innerHTML = ""
        }

        // Create particles
        const colors = ["#10B981", "#5D3FD3", "#43B0F1", "#FFD166"]

        for (let i = 0; i < 60; i++) {
            const particle = document.createElement("div")
            particle.className = "success-particle"
            particle.style.setProperty("--particle-color", colors[Math.floor(Math.random() * colors.length)])
            particle.style.setProperty("--particle-left", Math.random() * 100 + "vw")
            particle.style.setProperty("--particle-delay", Math.random() * 1 + "s")
            particle.style.setProperty("--particle-duration", Math.random() * 2 + 1 + "s")
            particle.style.setProperty("--particle-size", Math.random() * 0.5 + 0.25 + "rem")
            particle.style.setProperty("--particle-rotation", Math.random() * 360 + "deg")

            particlesContainer.appendChild(particle)
        }

        // Remove particles after animation completes
        setTimeout(() => {
            if (particlesContainer) {
                particlesContainer.classList.add("fade-out")
                setTimeout(() => {
                    if (document.body.contains(particlesContainer)) {
                        document.body.removeChild(particlesContainer)
                    }
                }, 1000)
            }
        }, 3000)
    }

    const handleDownload = () => {
        const link = document.createElement("a")
        link.href = fileUrl
        link.download = "" // השם שיופיע למשתמש — אם ריק, הדפדפן ישתמש בשם המקורי מה-URL
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
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
                        <div className="summary-content" ref={summaryRef}>
                            <ReactMarkdown>{typedSummary}</ReactMarkdown>
                            {isTyping && <span className="typing-cursor">|</span>}
                        </div>
                        {typedSummary.length > 0 && !isTyping && (
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

                    <div className="card-actions">
                        <button
                            className={`action-button copy-button ${copied ? "copied" : ""}`}
                            onClick={handleCopyToClipboard}
                            title="Copy to clipboard"
                            disabled={loading}
                        >
                            {copied ? <CheckCircle size={18} /> : <ContentCopy size={18} />}
                            <span>{copied ? "Copied!" : "Copy"}</span>
                        </button>

                        <button className="action-button save-button" onClick={handleOpenPermissionDialog} disabled={loading}>
                            <Save size={18} />
                            <span>Save</span>
                        </button>

                        <button className="action-button download-button" disabled={loading} onClick={handleDownload}>
                            <Download size={18} />
                            <span>Download</span>
                        </button>

                        <button className="action-button edit-button" disabled={loading}>
                            <Edit size={18} />
                            <span>Edit</span>
                        </button>
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

