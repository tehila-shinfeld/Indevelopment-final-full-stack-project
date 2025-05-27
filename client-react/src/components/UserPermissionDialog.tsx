"use client"

import type React from "react"

import { useEffect, useState } from "react"
import axios from "axios"
import "../styleSheets/UserPermissionDialog.css"

export interface User {
  id: number
  name: string
}

interface UserPermissionDialogProps {
  open: boolean
  onClose: () => void
  onSave: (selectedUsers: User[]) => void
}

const UserPermissionDialog: React.FC<UserPermissionDialogProps> = ({ open, onClose, onSave }) => {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  // Dropdown is always open, so no need for isDropdownOpen state
  const [isDarkMode, setIsDarkMode] = useState(false)

  const stringToColor = (string: string) => {
    let hash = 0
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }
    let color = "#"
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      color += ("00" + value.toString(16)).substr(-2)
    }
    return color
  }

  const decodeJwt = (token: string) => {
    if (!token) return null

    const parts = token.split(".")
    if (parts.length !== 3) {
      console.error("Invalid JWT token")
      return null
    }

    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )

    return JSON.parse(jsonPayload)
  }

  const getUserCompany = () => {
    const token = sessionStorage.getItem("token")
    if (!token) {
      console.log("No token found in session storage")
      return null
    }

    const decodedToken = decodeJwt(token)

    if (decodedToken) {
      return decodedToken.company
    } else {
      console.log("Failed to decode token")
      return null
    }
  }

  const company = getUserCompany()

  useEffect(() => {
    if (company) {
      console.log("User's company is:", company)
    }

    axios
      .get(`https://${import.meta.env.VITE_API_BASE_URL}/api/User/ByComp`, {
        params: { company: company },
      })
      .then((response) => {
        const userList = Array.isArray(response.data)
          ? response.data.map((user: { username: string; id: number }) => ({
              id: user.id,
              name: user.username,
            }))
          : []
        setUsers(userList)
        setLoading(false)
      })
      .catch((error) => {
        console.error("❌ שגיאה בטעינת המשתמשים:", error)
        setError("שגיאה בטעינת המשתמשים")
        setLoading(false)
      })
  }, [company])

  const handleSave = () => {
    onSave(selectedUsers)
    console.log(selectedUsers)
    onClose()
  }

  const toggleUserSelection = (user: User) => {
    if (selectedUsers.some((selectedUser) => selectedUser.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser.id !== user.id))
    } else {
      setSelectedUsers([...selectedUsers, user])
    }
  }

  const selectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      // אם כל המשתמשים כבר נבחרו, נבטל את הבחירה
      setSelectedUsers([])
    } else {
      // אחרת נבחר את כל המשתמשים המסוננים
      setSelectedUsers(filteredUsers)
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark-mode", !isDarkMode)
  }

  useEffect(() => {
    // Check for user preference on component mount
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDarkMode(prefersDark)
    document.documentElement.classList.toggle("dark-mode", prefersDark)
  }, [])

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  const areAllSelected = filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length

  if (!open) return null

  return (
    <div className="dialog-overlay">
      <div className="dialog-container">
        <div className="dialog-header">
          <h2 className="dialog-title">בחר משתמשים עם גישה לקובץ</h2>
          <div className="header-actions">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={isDarkMode ? "עבור למצב בהיר" : "עבור למצב כהה"}
            >
              {isDarkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4"></circle>
                  <path d="M12 2v2"></path>
                  <path d="M12 20v2"></path>
                  <path d="m4.93 4.93 1.41 1.41"></path>
                  <path d="m17.66 17.66 1.41 1.41"></path>
                  <path d="M2 12h2"></path>
                  <path d="M20 12h2"></path>
                  <path d="m6.34 17.66-1.41 1.41"></path>
                  <path d="m19.07 4.93-1.41 1.41"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                </svg>
              )}
            </button>
            <button className="dialog-close-button" onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="dialog-content">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>טוען משתמשים...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="error-icon"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>{error}</p>
            </div>
          ) : (
            <div className="user-selection-container">
              <div className="search-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="חפש משתמשים..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {selectedUsers.length > 0 && <div className="selected-count">{selectedUsers.length}</div>}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="search-icon"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </div>

              <div className="selected-users-container">
                {selectedUsers.map((user) => (
                  <div key={user.id} className="selected-user-chip">
                    <div className="user-avatar" style={{ backgroundColor: stringToColor(user.name) }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="user-name">{user.name}</span>
                    <button
                      className="remove-user-button"
                      onClick={() => toggleUserSelection(user)}
                      aria-label={`הסר את ${user.name}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Dropdown is always open */}
                <div className="users-list">
                  <div className="select-all-option" onClick={selectAllUsers}>
                    <div className={`select-all-checkbox ${areAllSelected ? "selected" : ""}`}>
                      {areAllSelected && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                    <span className="select-all-text">{areAllSelected ? "בטל בחירת הכל" : "בחר הכל"}</span>
                  </div>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => {
                      const isSelected = selectedUsers.some((selectedUser) => selectedUser.id === user.id)
                      const isLast = index === filteredUsers.length - 1
                      return (
                        <div
                          key={user.id}
                          className={`user-option ${isSelected ? "selected" : ""} ${isLast ? "last-item" : ""}`}
                          onClick={() => toggleUserSelection(user)}
                        >
                          <div className="user-avatar" style={{ backgroundColor: stringToColor(user.name) }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="user-name">{user.name}</span>
                          <div className={`user-checkbox ${isSelected ? "selected" : ""}`}>
                            {isSelected && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="no-results">לא נמצאו משתמשים</div>
                  )}
                </div>
              
            </div>
          )}
        </div>

        <div className="dialog-actions">
          <button className="cancel-button" onClick={onClose}>
            ביטול
          </button>
          <button className="save-button" onClick={handleSave} disabled={selectedUsers.length === 0}>
            שמור
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserPermissionDialog
