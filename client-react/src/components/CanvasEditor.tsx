/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
// ...existing code...
import React, { useEffect, useRef, useState } from "react"
import * as fabric from "fabric"
// ...existing code...
import {
  PenTool,
  Eraser,
  Square,
  Circle,
  Type,
  ImageIcon,
  Trash2,
  Undo,
  Redo,
  Save,
  X,
  Minus,
  Plus,
  Palette,
} from "lucide-react"

interface CanvasEditorProps {
  onSave: (imageData: string) => void
  onCancel: () => void
  initialImage?: string | null
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ onSave, onCancel, initialImage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const [activeColor, setActiveColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(5)
  const [activeTool, setActiveTool] = useState<string>("pen")
  const [canvasHistory, setCanvasHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Save current canvas state to history
  const saveToHistory = () => {
    if (fabricCanvasRef.current) {
      const json = fabricCanvasRef.current.toJSON()
      const newHistory = canvasHistory.slice(0, historyIndex + 1)
      newHistory.push(JSON.stringify(json))
      setCanvasHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
  }

  // Initialize the canvas
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: true,
        width: canvasRef.current.parentElement?.clientWidth || 800,
        height: 400,
        backgroundColor: "#ffffff",
      })

      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = activeColor
        canvas.freeDrawingBrush.width = brushSize
      }

      fabricCanvasRef.current = canvas

      if (initialImage) {
        fabric.Image.fromURL(initialImage, (img) => {
          img.scaleToWidth(canvas.width!)
          img.scaleToHeight(canvas.height!)
          canvas.setBackgroundImage(img, canvas.requestRenderAll.bind(canvas))
        })
      }

      // Save initial state to history
      saveToHistory()

      // Set up event listeners
      canvas.on("object:added", saveToHistory)
      canvas.on("object:modified", saveToHistory)
      canvas.on("object:removed", saveToHistory)

      // Clean up on unmount
      return () => {
        canvas.off("object:added", saveToHistory)
        canvas.off("object:modified", saveToHistory)
        canvas.off("object:removed", saveToHistory)
        canvas.dispose()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update brush when color or size changes
  useEffect(() => {
    if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.color = activeColor
      fabricCanvasRef.current.freeDrawingBrush.width = brushSize
    }
  }, [activeColor, brushSize])

  // Undo action
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      loadFromHistory(newIndex)
    }
  }

  // Redo action
  const handleRedo = () => {
    if (historyIndex < canvasHistory.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      loadFromHistory(newIndex)
    }
  }

  // Load canvas state from history
  const loadFromHistory = (index: number) => {
    if (fabricCanvasRef.current && canvasHistory[index]) {
      fabricCanvasRef.current.loadFromJSON(JSON.parse(canvasHistory[index]), () => {
        fabricCanvasRef.current?.renderAll()
      })
    }
  }

  // Handle tool selection
  const handleToolSelect = (tool: string) => {
    setActiveTool(tool)
    const canvas = fabricCanvasRef.current

    if (!canvas) return

    switch (tool) {
      case "pen":
        canvas.isDrawingMode = true
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = activeColor
          canvas.freeDrawingBrush.width = brushSize
        }
        break
      case "eraser":
        canvas.isDrawingMode = true
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = "#ffffff"
          canvas.freeDrawingBrush.width = brushSize * 2
        }
        break
      case "square":
      case "circle":
      case "text":
        canvas.isDrawingMode = false
        break
      default:
        canvas.isDrawingMode = true
    }
  }

  // Handle mouse down for shape creation
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!fabricCanvasRef.current || fabricCanvasRef.current.isDrawingMode) return

    const canvas = fabricCanvasRef.current
    const pointer = canvas.getPointer(e.nativeEvent as MouseEvent)

    if (activeTool === "square") {
      const rect = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 100,
        height: 100,
        fill: "transparent",
        stroke: activeColor,
        strokeWidth: brushSize / 2,
      })
      canvas.add(rect)
      canvas.setActiveObject(rect)
      saveToHistory()
    } else if (activeTool === "circle") {
      const circle = new fabric.Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 50,
        fill: "transparent",
        stroke: activeColor,
        strokeWidth: brushSize / 2,
      })
      canvas.add(circle)
      canvas.setActiveObject(circle)
      saveToHistory()
    } else if (activeTool === "text") {
      const text = new fabric.IText("הקלד טקסט כאן", {
        left: pointer.x,
        top: pointer.y,
        fontFamily: "Arial",
        fill: activeColor,
        fontSize: brushSize * 3,
        // direction: "rtl", // not supported directly
        // textAlign: "right", // not supported directly
      })
      canvas.add(text)
      canvas.setActiveObject(text)
      text.enterEditing()
      saveToHistory()
    }
  }

  // Handle clear canvas
  const handleClear = () => {
    if (fabricCanvasRef.current) {
      if (window.confirm("האם אתה בטוח שברצונך לנקות את הקנבס?")) {
        fabricCanvasRef.current.clear()
        fabricCanvasRef.current.setBackgroundColor("#ffffff", () => {})
        fabricCanvasRef.current.renderAll()
        saveToHistory()
      }
    }
  }

  // Handle image upload
  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Process the selected image file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && fabricCanvasRef.current) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imgData = event.target?.result as string
        fabric.Image.fromURL(imgData, (img) => {
          const canvas = fabricCanvasRef.current!
          const canvasWidth = canvas.width!
          const canvasHeight = canvas.height!

          let scaleFactor = 1
          if (img.width! > canvasWidth || img.height! > canvasHeight) {
            const widthRatio = canvasWidth / img.width!
            const heightRatio = canvasHeight / img.height!
            scaleFactor = Math.min(widthRatio, heightRatio) * 0.8
          }

          img.scale(scaleFactor)
          img.set({
            left: canvasWidth / 2 - (img.width! * scaleFactor) / 2,
            top: canvasHeight / 2 - (img.height! * scaleFactor) / 2,
          })

          fabricCanvasRef.current!.add(img)
          saveToHistory()
        })
      }
      reader.readAsDataURL(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Handle save canvas
  const handleSave = () => {
    if (fabricCanvasRef.current) {
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: "png",
        quality: 1,
      })
      onSave(dataURL)
    }
  }

  return (
    <div className="canvas-editor">
      <div className="canvas-toolbar">
        <div className="toolbar-section">
          <button
            className={`toolbar-button ${activeTool === "pen" ? "active" : ""}`}
            onClick={() => handleToolSelect("pen")}
            title="עט"
          >
            <PenTool size={20} />
          </button>
          <button
            className={`toolbar-button ${activeTool === "eraser" ? "active" : ""}`}
            onClick={() => handleToolSelect("eraser")}
            title="מחק"
          >
            <Eraser size={20} />
          </button>
        </div>

        <div className="toolbar-section">
          <button
            className={`toolbar-button ${activeTool === "square" ? "active" : ""}`}
            onClick={() => handleToolSelect("square")}
            title="ריבוע"
          >
            <Square size={20} />
          </button>
          <button
            className={`toolbar-button ${activeTool === "circle" ? "active" : ""}`}
            onClick={() => handleToolSelect("circle")}
            title="עיגול"
          >
            <Circle size={20} />
          </button>
          <button
            className={`toolbar-button ${activeTool === "text" ? "active" : ""}`}
            onClick={() => handleToolSelect("text")}
            title="טקסט"
          >
            <Type size={20} />
          </button>
        </div>

        <div className="toolbar-section">
          <button className="toolbar-button" onClick={handleImageUpload} title="הוסף תמונה">
            <ImageIcon size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="toolbar-section">
          <button className="toolbar-button" onClick={handleUndo} disabled={historyIndex <= 0} title="בטל">
            <Undo size={20} />
          </button>
          <button
            className="toolbar-button"
            onClick={handleRedo}
            disabled={historyIndex >= canvasHistory.length - 1}
            title="בצע שוב"
          >
            <Redo size={20} />
          </button>
          <button className="toolbar-button" onClick={handleClear} title="נקה הכל">
            <Trash2 size={20} />
          </button>
        </div>

        <div className="toolbar-section">
          <div className="brush-size-control">
            <button
              className="toolbar-button size-button"
              onClick={() => setBrushSize(Math.max(1, brushSize - 1))}
              title="הקטן מברשת"
            >
              <Minus size={16} />
            </button>
            <span className="brush-size-value">{brushSize}</span>
            <button
              className="toolbar-button size-button"
              onClick={() => setBrushSize(Math.min(50, brushSize + 1))}
              title="הגדל מברשת"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="toolbar-section">
          <div className="color-picker-wrapper">
            <Palette size={20} className="color-picker-icon" />
            <input
              type="color"
              value={activeColor}
              onChange={(e) => setActiveColor(e.target.value)}
              className="color-picker"
              title="בחר צבע"
            />
          </div>
        </div>

        <div className="toolbar-section actions">
          <button className="toolbar-button save-button" onClick={handleSave} title="שמור">
            <Save size={20} />
            <span>שמור</span>
          </button>
          <button className="toolbar-button cancel-button" onClick={onCancel} title="בטל">
            <X size={20} />
            <span>בטל</span>
          </button>
        </div>
      </div>

      <div className="canvas-container" onMouseDown={handleCanvasMouseDown}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}

export default CanvasEditor