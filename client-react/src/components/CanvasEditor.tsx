"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"
import { Save, X, Bold, Italic, Underline, List, ListOrdered, Undo, Redo } from "lucide-react"

interface CanvasEditorProps {
  onSave: (editedText: string) => void
  onCancel: () => void
  initialText: string
}

// Basic Markdown to HTML conversion for contentEditable
const markdownToHtml = (markdown: string): string => {
  let html = markdown
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // **bold**
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // *italic*
    .replace(/__(.*?)__/g, "<u>$1</u>") // __underline__

  // Simple list handling: convert markdown lists to HTML lists
  // This is a very basic approach and might not handle complex nested lists or paragraphs within list items
  const lines = html.split("\n")
  let inUl = false
  let inOl = false
  const processedLines: string[] = []

  lines.forEach((line) => {
    const trimmedLine = line.trim()
    if (trimmedLine.startsWith("- ")) {
      if (!inUl) {
        if (inOl) {
          processedLines.push("</ol>")
          inOl = false
        }
        processedLines.push("<ul>")
        inUl = true
      }
      processedLines.push(`<li>${trimmedLine.substring(2)}</li>`)
    } else if (trimmedLine.match(/^\d+\. /)) {
      if (!inOl) {
        if (inUl) {
          processedLines.push("</ul>")
          inUl = false
        }
        processedLines.push("<ol>")
        inOl = true
      }
      processedLines.push(`<li>${trimmedLine.substring(trimmedLine.indexOf(".") + 1).trim()}</li>`)
    } else {
      if (inUl) {
        processedLines.push("</ul>")
        inUl = false
      }
      if (inOl) {
        processedLines.push("</ol>")
        inOl = false
      }
      processedLines.push(line) // Keep original line for non-list content
    }
  })

  if (inUl) {
    processedLines.push("</ul>")
  }
  if (inOl) {
    processedLines.push("</ol>")
  }

  html = processedLines.join("\n")
  // Replace remaining newlines with <br> for simple paragraph breaks outside lists
  html = html.replace(/\n(?!<ul|<ol|<\/ul|<\/ol>)/g, "<br/>")

  return html
}

// Basic HTML to Markdown conversion for saving
const htmlToMarkdown = (html: string): string => {
  let markdown = html
    .replace(/<br\s*\/?>/gi, "\n") // Convert <br> to newlines
    .replace(/<strong>(.*?)<\/strong>/gi, "**$1**") // <strong>bold</strong> to **bold**
    .replace(/<em>(.*?)<\/em>/gi, "*$1*") // <em>italic</em> to *italic*
    .replace(/<u>(.*?)<\/u>/gi, "__$1__") // <u>underline</u> to __underline__

  // Basic list handling: convert HTML lists to markdown lists
  markdown = markdown.replace(/<\/li>\s*<li>/gi, "\n- ") // Between list items
  markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1") // Convert individual <li> to markdown list item
  markdown = markdown.replace(/<\/?ul[^>]*>/gi, "\n") // Remove <ul> tags, replace with newline
  markdown = markdown.replace(/<\/?ol[^>]*>/gi, "\n") // Remove <ol> tags, replace with newline

  // Clean up extra newlines or spaces that might result from conversion
  markdown = markdown.replace(/\n{3,}/g, "\n\n") // Max two newlines
  markdown = markdown.trim()

  return markdown
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ onSave, onCancel, initialText }) => {
  const editorRef = useRef<HTMLDivElement>(null)
  // Use state to hold the HTML content that goes into contentEditable
  const [editorHtml, setEditorHtml] = useState<string>(() => markdownToHtml(initialText))
  const [currentFontSize, setCurrentFontSize] = useState(16) // Initial font size

  useEffect(() => {
    // Only update if initialText actually changed and is different from current HTML content
    const htmlFromInitialText = markdownToHtml(initialText)
    if (editorRef.current && editorRef.current.innerHTML !== htmlFromInitialText) {
      editorRef.current.innerHTML = htmlFromInitialText
      setEditorHtml(htmlFromInitialText) // Keep editorHtml state in sync
    }
  }, [initialText])

  // Handle input event from contentEditable div
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      setEditorHtml(editorRef.current.innerHTML) // Update state with current HTML
    }
  }, [])

  // Function to execute a document command
  const executeCommand = useCallback((command: string, value?: string | number) => {
    document.execCommand(command, false, value !== undefined ? String(value) : undefined)
    // After executing command, ensure the content state is updated
    if (editorRef.current) {
      setEditorHtml(editorRef.current.innerHTML)
    }
    editorRef.current?.focus() // Keep focus on editor
  }, [])

  const toggleBold = useCallback(() => executeCommand("bold"), [executeCommand])
  const toggleItalic = useCallback(() => executeCommand("italic"), [executeCommand])
  const toggleUnderline = useCallback(() => executeCommand("underline"), [executeCommand])
  const toggleUnorderedList = useCallback(() => executeCommand("insertUnorderedList"), [executeCommand])
  const toggleOrderedList = useCallback(() => executeCommand("insertOrderedList"), [executeCommand])

  const changeFontSize = useCallback(
    (newSize: number) => {
      // For contentEditable, 'fontSize' command uses size 1-7
      // To use pixel values, one common workaround is to remove existing font size,
      // then apply a specific style. Or, simpler: rely on CSS for base size
      // and let execCommand handle relative sizing if needed.
      // Given the select input, we'll map pixel size to execCommand's 1-7 range approximately
      // Or, more reliably: apply a span with style.
      // For this basic editor, let's keep it simple: apply to the entire editor's base font-size
      // and rely on execCommand for bold/italic/underline only.
      // If the user selects text, execCommand('fontSize', false, size_enum) will apply to selection.
      // Need to convert pixel size to a 1-7 range for execCommand.
      let sizeEnum: number
      if (newSize <= 12) sizeEnum = 1
      else if (newSize <= 14) sizeEnum = 2
      else if (newSize <= 16) sizeEnum = 3
      else if (newSize <= 18) sizeEnum = 4
      else if (newSize <= 20) sizeEnum = 5
      else if (newSize <= 24) sizeEnum = 6
      else sizeEnum = 7 // For 28, 32+

      executeCommand("fontSize", sizeEnum)
      setCurrentFontSize(newSize) // Update local state for the select dropdown
    },
    [executeCommand],
  )

  const undo = useCallback(() => executeCommand("undo"), [executeCommand])
  const redo = useCallback(() => executeCommand("redo"), [executeCommand])

  const handleSave = () => {
    // Convert current HTML content back to Markdown before saving
    const markdownContent = htmlToMarkdown(editorHtml)
    onSave(markdownContent)
  }

  // Removed unused downloadContent function to resolve the error.

  return (
    <div className="canvas-editor-container">
      {/* Enhanced Toolbar */}
      <div className="canvas-toolbar">
        <div className="toolbar-section text-formatting">
          <button className="format-button" onClick={toggleBold} title="הדגשה (Bold)">
            <Bold size={18} />
          </button>
          <button className="format-button" onClick={toggleItalic} title="הטיה (Italic)">
            <Italic size={18} />
          </button>
          <button className="format-button" onClick={toggleUnderline} title="קו תחתון (Underline)">
            <Underline size={18} />
          </button>
          <select
            value={currentFontSize}
            onChange={(e) => changeFontSize(Number(e.target.value))}
            className="font-size-selector"
            title="גודל גופן"
          >
            <option value={12}>12px</option>
            <option value={14}>14px</option>
            <option value={16}>16px</option>
            <option value={18}>18px</option>
            <option value={20}>20px</option>
            <option value={24}>24px</option>
            <option value={28}>28px</option>
            <option value={32}>32px</option>
          </select>
        </div>
        <div className="toolbar-section">
          <button className="format-button" onClick={toggleUnorderedList} title="רשימה לא ממוינת">
            <List size={18} />
          </button>
          <button className="format-button" onClick={toggleOrderedList} title="רשימה ממוינת">
            <ListOrdered size={18} />
          </button>
        </div>
        <div className="toolbar-section">
          <button onClick={undo} className="tool-button" title="בטל (Undo)">
            <Undo size={18} />
          </button>
          <button onClick={redo} className="tool-button" title="חזור (Redo)">
            <Redo size={18} />
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

      {/* Text Editor Area */}
      <div className="canvas-container">
        <div className="canvas-wrapper">
          <div
            ref={editorRef}
            contentEditable="true"
            dangerouslySetInnerHTML={{ __html: editorHtml }}
            onInput={handleInput}
            className="text-editor"
            dir="rtl" // Ensure RTL direction
            style={{ fontSize: `${currentFontSize}px` }} // Apply base font size
          />
        </div>
      </div>
    </div>
  )
}

export default CanvasEditor
