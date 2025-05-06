"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { useSummary } from "../context/SummaryContext"
import * as mammoth from "mammoth"
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist"
import workerSrc from "pdfjs-dist/build/pdf.worker.min?url"
import { FileText, Upload, FileUp, X, Check, FileType, Loader, ChevronRight, FileSymlink, Sparkles } from "lucide-react"
import "../styleSheets/FileUploadButton.css"
import SummaryFile from "./SummarizeFile"

// Set PDF.js worker
GlobalWorkerOptions.workerSrc = workerSrc

const FileUploadButton: React.FC<{ onFileUpload: (url: string) => void }> = ({ onFileUpload }) => {
  // File upload states
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const { summary, setSummary } = useSummary()
  const [fileTextContent, setFileTextContent] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")

  // View transition states
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [processingStep, setProcessingStep] = useState<"upload" | "summarize" | "complete">("upload")
  const [showParticles, setShowParticles] = useState(false)

  // Handle file selection button click
  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  // Handle file selection from input
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0]
      setFile(selectedFile)
      setUploadStatus("success") // Set status to success immediately to show file info
    }
  }

  // Handle drag and drop events
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => {
    setDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    if (event.dataTransfer.files.length > 0) {
      const selectedFile = event.dataTransfer.files[0]
      setFile(selectedFile)
      setUploadStatus("success") // Set status to success immediately to show file info
    }
  }

  // Combined function to handle both upload and summary generation
  const handleUploadAndSummarize = async () => {
    if (!file) {
      setError("Please select a file first")
      return
    }

    setProcessingStep("upload")
    setLoading(true)
    setUploading(true)
    setUploadStatus("uploading")
    setError(null)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 300)

    try {
      // Step 1: Process file content
      let textContent = ""

      if (file.type === "text/plain") {
        // TXT
        const reader = new FileReader()
        textContent = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsText(file)
        })
      } else if (file.type === "application/pdf") {
        // PDF
        const pdfData = await file.arrayBuffer()
        const pdf = await getDocument({ data: pdfData }).promise
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          const strings = content.items.map((item: any) => item.str)
          textContent += strings.join(" ") + "\n"
        }
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // DOCX
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        textContent = result.value
      } else {
        throw new Error("Unsupported file type")
      }

      setFileTextContent(textContent)

      // Step 2: Upload file to server
      const uploadResponse = await axios.post("https://localhost:7136/api/files/upload", {
        fileName: file.name,
      })

      const { fileId, fileUrl, s3Url } = uploadResponse.data
      setFileUrl(fileUrl)
      setUploadedFileUrl(s3Url)

      await axios.put(fileUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      })

      setUploadProgress(100)
      setUploadStatus("success")
      setMessage(`File uploaded successfully!`)

      // Step 3: Generate summary
      setProcessingStep("summarize")

      const summaryResponse = await axios.post("https://localhost:7136/api/files/summarize", {
        text: textContent,
      })

      setSummary(summaryResponse.data.summary)

      // Step 4: Transition to summary view
      setProcessingStep("complete")

      // Start the transition sequence
      triggerTransitionAnimation()
    } catch (error) {
      console.error("Error:", error)
      setUploadStatus("error")
      setError("Error processing file. Please try again.")
    } finally {
      clearInterval(progressInterval)
      setUploading(false)
      setLoading(false)
    }
  }

  // Add this new function to handle the transition animation sequence
  const triggerTransitionAnimation = () => {
    // First, add the exit animation class
    setIsTransitioning(true)

    // After exit animation completes, change the view
    setTimeout(() => {
      setActiveStep(1)

      // Then start the entrance animation
      setTimeout(() => {
        setIsTransitioning(false)
        setShowParticles(true)
        setTimeout(() => setShowParticles(false), 5000)
      }, 100)
    }, 600)
  }

  const handleReset = () => {
    // Start exit animation
    setIsTransitioning(true)

    // After exit animation completes, reset state
    setTimeout(() => {
      setFile(null)
      setUploadedFileUrl(null)
      setFileTextContent(null)
      setUploadStatus("idle")
      setUploadProgress(0)
      setMessage("")
      setError(null)
      setActiveStep(0)
      setProcessingStep("upload")

      // Start entrance animation after state change
      setTimeout(() => {
        setIsTransitioning(false)
      }, 100)
    }, 600)
  }

  // Get appropriate icon for file type
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

    return <FileType className="file-icon" />
  }

  return (
    <div className="main-container">
      {/* Background elements */}
      <div className="background-elements">
        <div className="bg-gradient"></div>
        <div className="bg-pattern"></div>
        <div className="floating-shape shape1"></div>
        <div className="floating-shape shape2"></div>
        <div className="floating-shape shape3"></div>
        <div className="floating-shape shape4"></div>
        <div className="floating-shape shape5"></div>
        <div className="floating-shape shape6"></div>
      </div>

      {/* Particles effect for summary completion */}
      {showParticles && <div className="particles-container"></div>}

      <header className="app-header">
        <div className="logo-container">
          <div className="logo-icon">
            <Sparkles size={24} />
          </div>
          <h1 className="logo-text">Document Summarizer</h1>
        </div>

        <div className="progress-steps">
          <div className={`step ${activeStep >= 0 ? "active" : ""}`}>
            <div className="step-icon">
              <FileUp size={18} />
            </div>
            <span className="step-text">Upload</span>
          </div>
          <div className={`step-connector ${activeStep >= 1 ? "active" : ""}`}>
            <ChevronRight size={16} />
          </div>
          <div className={`step ${activeStep >= 1 ? "active" : ""}`}>
            <div className="step-icon">
              <FileSymlink size={18} />
            </div>
            <span className="step-text">Summary</span>
          </div>
        </div>
      </header>

      <main className="app-content">
        <div className={`content-container ${isTransitioning ? "transitioning" : ""}`}>
          {activeStep === 0 ? (
            <div className="upload-section">
              <div className="upload-container">
                {loading ? (
                  <div className="processing-overlay">
                    <div className="processing-content">
                      <div className="processing-spinner">
                        <Loader size={40} />
                        <svg className="spinner-track" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" />
                        </svg>
                      </div>
                      <h3 className="processing-title">
                        {processingStep === "upload" ? "Uploading Document" : "Generating Summary"}
                      </h3>
                      <p className="processing-description">
                        {processingStep === "upload"
                          ? `Processing your file... ${uploadProgress}%`
                          : "Our AI is analyzing your document..."}
                      </p>
                      <div className="processing-progress">
                        <div
                          className="progress-bar"
                          style={{
                            width: processingStep === "upload" ? `${uploadProgress}%` : "90%",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`upload-card ${dragging ? "dragging" : ""} ${uploadStatus !== "idle" ? "has-file" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {uploadStatus === "idle" ? (
                      <>
                        <div className="upload-illustration">
                          <div className="upload-icon-wrapper">
                            <FileUp className="upload-icon" />
                          </div>
                          <div className="upload-decoration">
                            <div className="decoration-dot dot1"></div>
                            <div className="decoration-dot dot2"></div>
                            <div className="decoration-dot dot3"></div>
                            <div className="decoration-line line1"></div>
                            <div className="decoration-line line2"></div>
                          </div>
                        </div>
                        <h2 className="upload-heading">Upload Your Document</h2>
                        <div className="upload-instructions">
                          <p>Select a PDF, TXT, or DOCX file to generate a summary</p>
                          <p>Drag and drop here or use the button below</p>
                        </div>
                        <button className="upload-button" onClick={handleButtonClick}>
                          <FileUp size={18} />
                          <span>Choose File</span>
                        </button>
                        <div className="upload-info">
                          <span className="info-badge">Max 5MB</span>
                          <span className="info-badge">Secure Upload</span>
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
                          {getFileIcon()}
                          <div className="file-info">
                            <p className="file-name">{file?.name}</p>
                            <p className="file-size">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ""}</p>
                          </div>
                          {uploadStatus !== "uploading" && (
                            <button className="reset-button" onClick={handleReset}>
                              <X size={18} />
                            </button>
                          )}
                        </div>

                        {uploadStatus === "uploading" && (
                          <div className="upload-progress-container">
                            <div
                              className={`upload-progress-bar ${uploadStatus === "success" ? "success" : ""} ${uploadStatus === "error" ? "error" : ""}`}
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        )}

                        <div className="upload-status">
                          {uploadStatus === "uploading" && <p>Uploading... {uploadProgress}%</p>}
                          {uploadStatus === "success" && !loading && (
                            <p className="success-message">
                              <Check size={16} /> File ready for processing
                            </p>
                          )}
                          {uploadStatus === "error" && <p className="error-message">{error}</p>}
                        </div>

                        {uploadStatus === "success" && !loading && (
                          <button className="process-button" onClick={handleUploadAndSummarize}>
                            <Sparkles size={18} />
                            <span>Generate Summary</span>
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
              {uploadedFileUrl && (
                <>
                  <SummaryFile fileUrl={uploadedFileUrl} />
                  <button className="new-document-button" onClick={handleReset}>
                    <FileUp size={18} />
                    <span>Upload Another Document</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()}  TalkToMe.Ai -  By Tehila Shinfeld • </p>
      </footer>
    </div>
  )
}
export default FileUploadButton
