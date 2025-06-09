"use client"

// גרסה פשוטה יותר - רק לינק
const SimpleEmailLink = () => {
  return (
    <a
      href="mailto:talktome.ai2025@gmail.com?subject=פנייה מהאתר&body=שלום,%0D%0A%0D%0Aאני מעוניין/ת לקבל מידע נוסף על השירות.%0D%0A%0D%0Aתודה!"
      className="email-link"
      aria-label="שלח מייל"
      title="שלח מייל ל-talktome.ai2025@gmail.com"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
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
      <span className="sr-only">שלח מייל</span>
    </a>
  )
}

export default SimpleEmailLink
