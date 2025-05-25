"use client"

import "../styleSheets/canva-editor.css"
import CanvasEditor from "./CanvasEditor"

export default function Page() {
  const handleSave = (editedText: string) => {
    console.log("Saved text:", editedText)
    alert("Saved!")
  }

  const handleCancel = () => {
    console.log("Cancelled")
    alert("Cancelled!")
  }

  return (
    <div>
      <CanvasEditor onSave={handleSave} onCancel={handleCancel} initialText="Hello, world!" />
    </div>
  )
}
