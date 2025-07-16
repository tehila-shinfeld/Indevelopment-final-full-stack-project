"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"
import { Save, X, Type, Palette, Eraser, Undo, Redo, Download, Bold, Mouse } from "lucide-react"
interface CanvasEditorProps {
  onSave: (editedText: string) => void
  onCancel: () => void
  initialText: string
}

interface TextSelection {
  start: number
  end: number
  text: string
}

interface TextFormat {
  bold: boolean
  fontSize: number
  color: string
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ onSave, onCancel, initialText }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState<"pen" | "eraser" | "text" | "select">("text")
  const [currentColor, setCurrentColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(3)
  const [editedText, setEditedText] = useState(initialText)
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })

  // Text formatting states
  const [fontSize, setFontSize] = useState(16)
  const [isBold, setIsBold] = useState(false)
  const [selectedText, setSelectedText] = useState<TextSelection | null>(null)
  const [textFormats, setTextFormats] = useState<Map<string, TextFormat>>(new Map())

  // Calculate responsive canvas size
  useEffect(() => {
    const updateCanvasSize = () => {
      const container = document.querySelector(".canvas-container")
      if (container) {
        const containerWidth = container.clientWidth - 40
        const containerHeight = Math.min(window.innerHeight * 0.7, 600)

        setCanvasSize({
          width: Math.min(containerWidth, 800),
          height: containerHeight,
        })
      }
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)
    return () => window.removeEventListener("resize", updateCanvasSize)
  }, [])

  // Initialize canvas with formatted text content
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = canvasSize.width
    canvas.height = canvasSize.height

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas with white background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw formatted text content
    if (initialText) {
      drawFormattedText(ctx, initialText)
    }

    // Save initial state to history
    saveToHistory()
  }, [canvasSize, initialText])

  const drawFormattedText = (ctx: CanvasRenderingContext2D, text: string) => {
    const lines = text.split("\n")
    const lineHeight = fontSize + 8
    const padding = 20
    let y = padding + fontSize

    lines.forEach((line) => {
      if (y < canvasSize.height - padding) {
        // Apply current formatting
        const fontWeight = isBold ? "bold" : "normal"
        ctx.font = `${fontWeight} ${fontSize}px Arial, sans-serif`
        ctx.fillStyle = currentColor
        ctx.textAlign = "right"
        ctx.direction = "rtl"

        // Handle long lines by wrapping
        const words = line.split(" ")
        let currentLine = ""

        words.forEach((word) => {
          const testLine = currentLine + word + " "
          const metrics = ctx.measureText(testLine)

          if (metrics.width > canvasSize.width - padding * 2 && currentLine !== "") {
            ctx.fillText(currentLine.trim(), canvasSize.width - padding, y)
            currentLine = word + " "
            y += lineHeight
          } else {
            currentLine = testLine
          }
        })

        if (currentLine.trim() !== "") {
          ctx.fillText(currentLine.trim(), canvasSize.width - padding, y)
          y += lineHeight
        }
      }
    })
  }

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(imageData)

    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  const undo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const newIndex = historyIndex - 1
      ctx.putImageData(history[newIndex], 0, 0)
      setHistoryIndex(newIndex)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const newIndex = historyIndex + 1
      ctx.putImageData(history[newIndex], 0, 0)
      setHistoryIndex(newIndex)
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === "text" || currentTool === "select") return

    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentTool === "text" || currentTool === "select") return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.lineWidth = brushSize
    ctx.lineCap = "round"

    if (currentTool === "pen") {
      ctx.globalCompositeOperation = "source-over"
      ctx.strokeStyle = currentColor
    } else if (currentTool === "eraser") {
      ctx.globalCompositeOperation = "destination-out"
    }

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      saveToHistory()
    }
  }

  // Handle text selection in textarea
  const handleTextSelection = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    if (start !== end) {
      const selectedTextContent = editedText.substring(start, end)
      setSelectedText({
        start,
        end,
        text: selectedTextContent,
      })
    } else {
      setSelectedText(null)
    }
  }

  // Apply formatting to selected text
  const applyFormatting = (format: Partial<TextFormat>) => {
    if (!selectedText || !textareaRef.current) return

    const textarea = textareaRef.current
    const { start, end } = selectedText

    // Create format key for this text selection
    const formatKey = `${start}-${end}`
    const currentFormat = textFormats.get(formatKey) || { bold: false, fontSize: 16, color: "#000000" }

    // Update format
    const newFormat = { ...currentFormat, ...format }
    setTextFormats((prev) => new Map(prev.set(formatKey, newFormat)))

    // Update canvas with new formatting
    redrawCanvas()

    // Keep selection
    setTimeout(() => {
      textarea.setSelectionRange(start, end)
      textarea.focus()
    }, 0)
  }

  const redrawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Redraw with formatting
    drawFormattedText(ctx, editedText)
    saveToHistory()
  }

  const toggleBold = () => {
    if (selectedText) {
      applyFormatting({ bold: !isBold })
    }
    setIsBold(!isBold)
  }

  const changeFontSize = (newSize: number) => {
    if (selectedText) {
      applyFormatting({ fontSize: newSize })
    }
    setFontSize(newSize)
  }

  const handleSave = () => {
    onSave(editedText)
  }

  const downloadCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "edited-summary.png"
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="canvas-editor-container">
      {/* Enhanced Toolbar */}
      <div className="canvas-toolbar">
        <div className="toolbar-section">
          <button
            className={`tool-button ${currentTool === "select" ? "active" : ""}`}
            onClick={() => setCurrentTool("select")}
            title="בחירת טקסט"
          >
            <Mouse size={18} />
          </button>
          <button
            className={`tool-button ${currentTool === "text" ? "active" : ""}`}
            onClick={() => setCurrentTool("text")}
            title="עריכת טקסט"
          >
            <Type size={18} />
          </button>
          <button
            className={`tool-button ${currentTool === "pen" ? "active" : ""}`}
            onClick={() => setCurrentTool("pen")}
            title="עט"
          >
            <Palette size={18} />
          </button>
          <button
            className={`tool-button ${currentTool === "eraser" ? "active" : ""}`}
            onClick={() => setCurrentTool("eraser")}
            title="מחק"
          >
            <Eraser size={18} />
          </button>
        </div>

        {/* Text Formatting Section */}
        <div className="toolbar-section text-formatting">
          <button
            className={`format-button ${isBold ? "active" : ""}`}
            onClick={toggleBold}
            disabled={!selectedText}
            title="הדגשה"
          >
            <Bold size={18} />
          </button>

          <select
            value={fontSize}
            onChange={(e) => changeFontSize(Number(e.target.value))}
            className="font-size-selector"
            disabled={!selectedText && currentTool !== "text"}
            title="גודל גופן"
          >
            <option value={12}>12</option>
            <option value={14}>14</option>
            <option value={16}>16</option>
            <option value={18}>18</option>
            <option value={20}>20</option>
            <option value={24}>24</option>
            <option value={28}>28</option>
            <option value={32}>32</option>
          </select>
        </div>

        <div className="toolbar-section">
          <input
            type="color"
            value={currentColor}
            onChange={(e) => {
              setCurrentColor(e.target.value)
              if (selectedText) {
                applyFormatting({ color: e.target.value })
              }
            }}
            className="color-picker"
            title="בחר צבע"
          />
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="brush-size"
            title="גודל מברשת"
          />
        </div>

        <div className="toolbar-section">
          <button onClick={undo} disabled={historyIndex <= 0} className="tool-button" title="בטל">
            <Undo size={18} />
          </button>
          <button onClick={redo} disabled={historyIndex >= history.length - 1} className="tool-button" title="חזור">
            <Redo size={18} />
          </button>
        </div>

        <div className="toolbar-section">
          <button onClick={downloadCanvas} className="tool-button" title="הורד">
            <Download size={18} />
          </button>
        </div>

        <div className="toolbar-actions">
          <button onClick={onCancel} className="cancel-button">
            <X size={18} />
            <span>ביטול</span>
          </button>
          <button onClick={handleSave} className="save-button">
            <Save size={18} />
            <span>שמור</span>
          </button>
        </div>
      </div>

      {/* Selection Info */}
      {selectedText && (
        <div className="selection-info">
          <span>
            נבחר: "{selectedText.text.substring(0, 30)}
            {selectedText.text.length > 30 ? "..." : ""}"
          </span>
        </div>
      )}

      {/* Canvas Container */}
      <div className="canvas-container">
        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className={`edit-canvas ${currentTool === "text" ? "text-mode" : ""}`}
          />

          {currentTool === "text" && (
            <div className="text-editor-overlay">
              <textarea
                ref={textareaRef}
                value={editedText}
                onChange={(e) => {
                  setEditedText(e.target.value)
                  redrawCanvas()
                }}
                onSelect={handleTextSelection}
                onMouseUp={handleTextSelection}
                onKeyUp={handleTextSelection}
                className="text-editor"
                placeholder="ערוך את הטקסט כאן..."
                dir="rtl"
                style={{
                  fontSize: `${fontSize}px`,
                  fontWeight: isBold ? "bold" : "normal",
                  color: currentColor,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CanvasEditor