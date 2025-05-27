"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import "../styleSheets/login-modal.css"
import { useUser } from "../context/UserContext"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (path: string) => void
  isDarkMode?: boolean
}

// Password strength types
type PasswordStrength = "empty" | "weak" | "medium" | "strong" | "very-strong"

export default function EnhancedLoginModal({ isOpen, onClose, onNavigate, isDarkMode = false }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [rememberMe, setRememberMe] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>("empty")
  const { setUser } = useUser()

  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  })

  // Login form errors
  const [loginErrors, setLoginErrors] = useState({
    username: "",
    password: "",
    general: "",
  })

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    email: "",
    company: "",
    role: "",
  })

  // Register form errors
  const [registerErrors, setRegisterErrors] = useState({
    username: "",
    password: "",
    email: "",
    general: "",
  })

  // Load saved credentials on component mount
  useEffect(() => {
    if (isOpen) {
      loadSavedCredentials()
    }
  }, [isOpen])

  // Update password strength when password changes
  useEffect(() => {
    if (activeTab === "register") {
      const strength = calculatePasswordStrength(registerForm.password)
      setPasswordStrength(strength)
    }
  }, [registerForm.password, activeTab])

  // Add this useEffect after the existing useEffects, around line 60
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open")
      // Prevent scrolling on the background
      document.body.style.overflow = "hidden"
    } else {
      document.body.classList.remove("modal-open")
      document.body.style.overflow = ""
    }

    // Cleanup function
    return () => {
      document.body.classList.remove("modal-open")
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Calculate password strength
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) return "empty"

    let score = 0

    // Length check
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1

    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1 // Has uppercase
    if (/[a-z]/.test(password)) score += 1 // Has lowercase
    if (/[0-9]/.test(password)) score += 1 // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1 // Has special char

    // Variety check
    const uniqueChars = new Set(password).size
    if (uniqueChars > 5) score += 1
    if (uniqueChars > 10) score += 1

    // Determine strength based on score
    if (score <= 2) return "weak"
    if (score <= 5) return "medium"
    if (score <= 7) return "strong"
    return "very-strong"
  }

  // Get password strength text
  const getPasswordStrengthText = (): string => {
    switch (passwordStrength) {
      case "empty":
        return "הזן סיסמה"
      case "weak":
        return "חלשה"
      case "medium":
        return "בינונית"
      case "strong":
        return "חזקה"
      case "very-strong":
        return "חזקה מאוד"
      default:
        return ""
    }
  }

  // Get password strength color
  const getPasswordStrengthColor = (): string => {
    switch (passwordStrength) {
      case "empty":
        return "#e2e8f0" // gray
      case "weak":
        return "#f56565" // red
      case "medium":
        return "#ed8936" // orange
      case "strong":
        return "#48bb78" // green
      case "very-strong":
        return "#2b6cb0" // blue
      default:
        return "#e2e8f0"
    }
  }

  // Get password strength percentage for progress bar
  const getPasswordStrengthPercentage = (): number => {
    switch (passwordStrength) {
      case "empty":
        return 0
      case "weak":
        return 25
      case "medium":
        return 50
      case "strong":
        return 75
      case "very-strong":
        return 100
      default:
        return 0
    }
  }

  // Get password strength tips
  const getPasswordStrengthTips = (): string => {
    if (passwordStrength === "empty") return ""
    if (passwordStrength === "weak") {
      return "נסה להוסיף אותיות גדולות, מספרים ותווים מיוחדים"
    }
    if (passwordStrength === "medium") {
      return "נסה להוסיף תווים מיוחדים ולהאריך את הסיסמה"
    }
    return ""
  }

  // Load saved credentials from localStorage
  const loadSavedCredentials = () => {
    try {
      const savedCredentials = localStorage.getItem("rememberedCredentials")

      if (savedCredentials) {
        const { username, rememberEnabled } = JSON.parse(savedCredentials)

        if (rememberEnabled) {
          setLoginForm((prev) => ({ ...prev, username }))
          setRememberMe(true)

          // Focus on password field if username is already filled
          setTimeout(() => {
            const passwordInput = document.getElementById("login-password")
            if (passwordInput) {
              passwordInput.focus()
            }
          }, 100)
        }
      }
    } catch (error) {
      console.error("Error loading saved credentials:", error)
      // Clear potentially corrupted data
      localStorage.removeItem("rememberedCredentials")
    }
  }

  // Save credentials to localStorage
  const saveCredentials = (username: string) => {
    try {
      if (rememberMe) {
        localStorage.setItem(
          "rememberedCredentials",
          JSON.stringify({
            username,
            rememberEnabled: true,
            // We don't store the password for security reasons
          }),
        )
      } else {
        // If remember me is unchecked, clear any saved credentials
        localStorage.removeItem("rememberedCredentials")
      }
    } catch (error) {
      console.error("Error saving credentials:", error)
    }
  }

  // Handle remember me checkbox change
  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked)
  }

  // Simulate loading progress
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined

    if (isLoading) {
      setLoadingProgress(0)
      interval = setInterval(() => {
        setLoadingProgress((prev) => {
          // Slow down progress as it approaches 90%
          const increment = prev < 50 ? 15 : prev < 80 ? 5 : 1
          const newProgress = Math.min(prev + increment, 90)
          return newProgress
        })
      }, 200)
    } else if (loadingProgress > 0) {
      // When loading completes, quickly fill to 100%
      setLoadingProgress(100)
      setTimeout(() => {
        setLoadingProgress(0)
      }, 500)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isLoading, loadingProgress])

  // Handle login form changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))

    // Clear specific field error when typing
    setLoginErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }))
  }

  // Handle register form changes
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterForm((prev) => ({ ...prev, [name]: value }))

    // Clear specific field error when typing
    setRegisterErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }))
  }

  const handleGoogleLogin = () => {
    const clientId = "הקליינט איידי שלך"
    const redirectUri = "http://localhost:5116/api/Auth/google-login-callback"
    const scope = "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
    const responseType = "code"
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`
  }

  // Handle social login (for Google button)
  const handleSocialLogin = (provider: string) => {
    if (provider === "Google") {
      handleGoogleLogin()
    }
  }

  // Validate login form
  const validateLoginForm = () => {
    const errors = {
      username: "",
      password: "",
      general: "",
    }
    let isValid = true

    if (!loginForm.username.trim()) {
      errors.username = "שם משתמש הוא שדה חובה"
      isValid = false
    }

    if (!loginForm.password) {
      errors.password = "סיסמה היא שדה חובה"
      isValid = false
    } else if (loginForm.password.length < 6) {
      errors.password = "סיסמה חייבת להכיל לפחות 6 תווים"
      isValid = false
    }

    setLoginErrors(errors)
    return isValid
  }

  // Validate register form
  const validateRegisterForm = () => {
    const errors = {
      username: "",
      password: "",
      email: "",
      general: "",
    }
    let isValid = true

    if (!registerForm.username.trim()) {
      errors.username = "שם משתמש הוא שדה חובה"
      isValid = false
    } else if (registerForm.username.length < 3) {
      errors.username = "שם משתמש חייב להכיל לפחות 3 תווים"
      isValid = false
    }

    if (!registerForm.password) {
      errors.password = "סיסמה היא שדה חובה"
      isValid = false
    } else if (registerForm.password.length < 6) {
      errors.password = "סיסמה חייבת להכיל לפחות 6 תווים"
      isValid = false
    } else if (passwordStrength === "weak") {
      errors.password = "הסיסמה חלשה מדי, נסה להשתמש בסיסמה חזקה יותר"
      isValid = false
    }

    if (!registerForm.email.trim()) {
      errors.email = "כתובת אימייל היא שדה חובה"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
      errors.email = "כתובת אימייל אינה תקינה"
      isValid = false
    }

    setRegisterErrors(errors)
    return isValid
  }

  // Handle login submission
  const handleLogin = async () => {
    try {
      // Validate form first
      if (!validateLoginForm()) {
        return
      }

      setIsLoading(true)

      const response = await axios.post(`https://${import.meta.env.VITE_API_BASE_URL}/api/Auth/login`, {
        Username: loginForm.username,
        Password: loginForm.password,
      })
console.log("Login response:", response.data);

      const token = response.data.token
      const userId = response.data.userId
      const username = response.data.username

      if (!token) {
        throw new Error("Token not received")
      }

      if (!userId || !username) {
        throw new Error("נתוני התחברות חסרים")
      }

      // Save credentials if remember me is checked
      saveCredentials(loginForm.username)

      sessionStorage.setItem("token", token)
      const loggedInUser = {
        username: username,
        id: userId,
      }

      setUser(loggedInUser)
      localStorage.setItem("userID", userId)
      console.log("User logged in:", loggedInUser)
      showNotification("התחברת בהצלחה! 🎉")

      // Close modal and navigate
      setTimeout(() => {
        onClose()
        if (sessionStorage.getItem("token")) {
          onNavigate("/myMeetings")
        }
      }, 1500)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err)

      // Handle specific error responses
      if (err.response) {
        if (err.response.status === 401) {
          setLoginErrors((prev) => ({ ...prev, general: "שם משתמש או סיסמה שגויים" }))
        } else if (err.response.status === 404) {
          setLoginErrors((prev) => ({ ...prev, general: "משתמש לא נמצא" }))
        } else {
          setLoginErrors((prev) => ({ ...prev, general: "אירעה שגיאה בהתחברות, נסה שוב מאוחר יותר" }))
        }
      } else {
        setLoginErrors((prev) => ({ ...prev, general: "אירעה שגיאה בהתחברות, בדוק את החיבור לאינטרנט" }))
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle register submission
  const handleRegister = async () => {
    try {
      // Validate form first
      if (!validateRegisterForm()) {
        return
      }

      setIsLoading(true)

      // Make sure we're sending the data in the format the API expects
      const response = await axios.post(`https://${import.meta.env.VITE_API_BASE_URL}/api/Auth/register`, {
        Username: registerForm.username,
        PasswordHash: registerForm.password,
        Company: registerForm.company || "",
        Email: registerForm.email,
        Role: registerForm.role || "",
      })

      // Process the response
      const userId = response.data.userId
      const username = response.data.username
      const token = response.data.token

      if (!userId || !username) {
        throw new Error("נתוני ההרשמה חסרים")
      }

      const loggedInUser = {
        username: username,
        id: userId,
      }

      setUser(loggedInUser)
      localStorage.setItem("userID", userId)

      if (token) {
        sessionStorage.setItem("token", token)
      }

      console.log("User registered:", loggedInUser)
      showNotification("נרשמת בהצלחה! 🎉")

      // Close modal and navigate
      setTimeout(() => {
        onClose()
        onNavigate("/myMeetings")
      }, 1500)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Registration error:", err)

      // Handle specific error responses with more detailed feedback
      if (err.response) {
        const status = err.response.status
        const responseData = err.response.data

        if (status === 400) {
          // Try to extract specific validation errors from the response
          if (typeof responseData === "string") {
            if (responseData.includes("username") || responseData.toLowerCase().includes("שם משתמש")) {
              setRegisterErrors((prev) => ({ ...prev, username: "שם משתמש כבר קיים במערכת" }))
            } else if (responseData.includes("email") || responseData.toLowerCase().includes("אימייל")) {
              setRegisterErrors((prev) => ({ ...prev, email: "כתובת אימייל כבר קיימת במערכת" }))
            } else if (responseData.includes("password") || responseData.toLowerCase().includes("סיסמה")) {
              setRegisterErrors((prev) => ({ ...prev, password: "הסיסמה אינה עומדת בדרישות" }))
            } else {
              setRegisterErrors((prev) => ({ ...prev, general: responseData || "אירעה שגיאה בתהליך ההרשמה" }))
            }
          } else if (responseData && typeof responseData === "object") {
            // Handle structured error response
            if (responseData.errors) {
              const errors = responseData.errors
              if (errors.Username) {
                setRegisterErrors((prev) => ({ ...prev, username: errors.Username[0] }))
              }
              if (errors.PasswordHash) {
                setRegisterErrors((prev) => ({ ...prev, password: errors.PasswordHash[0] }))
              }
              if (errors.Email) {
                setRegisterErrors((prev) => ({ ...prev, email: errors.Email[0] }))
              }
            } else {
              setRegisterErrors((prev) => ({ ...prev, general: "אירעה שגיאה בתהליך ההרשמה" }))
            }
          } else {
            setRegisterErrors((prev) => ({ ...prev, general: "אירעה שגיאה בתהליך ההרשמה" }))
          }
        } else if (status === 409) {
          setRegisterErrors((prev) => ({ ...prev, username: "שם משתמש כבר קיים במערכת" }))
        } else {
          setRegisterErrors((prev) => ({ ...prev, general: "אירעה שגיאה בתהליך ההרשמה" }))
        }
      } else {
        setRegisterErrors((prev) => ({ ...prev, general: "אירעה שגיאה בתהליך ההרשמה, בדוק את החיבור לאינטרנט" }))
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Get all active error messages for login form
  const getLoginErrorMessages = () => {
    const messages = []
    if (loginErrors.username) messages.push(`שם משתמש: ${loginErrors.username}`)
    if (loginErrors.password) messages.push(`סיסמה: ${loginErrors.password}`)
    if (loginErrors.general) messages.push(loginErrors.general)
    return messages
  }

  // Get all active error messages for register form
  const getRegisterErrorMessages = () => {
    const messages = []
    if (registerErrors.username) messages.push(`שם משתמש: ${registerErrors.username}`)
    if (registerErrors.password) messages.push(`סיסמה: ${registerErrors.password}`)
    if (registerErrors.email) messages.push(`אימייל: ${registerErrors.email}`)
    if (registerErrors.general) messages.push(registerErrors.general)
    return messages
  }

  // Handle form submission with Enter key
  const handleKeyDown = (e: React.KeyboardEvent, formType: "login" | "register") => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (formType === "login") {
        handleLogin()
      } else {
        handleRegister()
      }
    }
  }

  // Show notification
  const [notification, setNotification] = useState({ show: false, message: "" })

  const showNotification = (message: string) => {
    setNotification({ show: true, message })
    setTimeout(() => {
      setNotification({ show: false, message: "" })
    }, 3000)
  }

  // Update the handleOverlayClick function around line 580
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking directly on the overlay, not on the modal content
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  // Update the return statement at the end of the component
  return (
    <div
      className={`auth-modal-overlay ${isDarkMode ? "dark-mode" : ""}`}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        className={`auth-modal ${isDarkMode ? "dark-mode" : ""}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`auth-modal-header ${isDarkMode ? "dark-mode" : ""}`}>
          <div className="auth-modal-tabs">
            <button
              className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              התחברות
            </button>
            <button
              className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
              onClick={() => setActiveTab("register")}
            >
              הרשמה
            </button>
          </div>
          <button className="auth-close-button" onClick={onClose} aria-label="סגור">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {loadingProgress > 0 && (
          <div className="auth-progress-bar-container">
            <div className="auth-progress-bar" style={{ width: `${loadingProgress}%` }}></div>
          </div>
        )}

        <div className="auth-modal-content">
          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="auth-form"
              >
                <h2 className="auth-form-title">התחברות ל-TalkToMe.AI</h2>

                <div className="social-login-buttons">
                  <button
                    className={`social-login-button google-button ${isDarkMode ? "dark-mode" : ""}`}
                    onClick={() => handleSocialLogin("Google")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                    </svg>
                    <span>התחברות עם Google</span>
                  </button>
                </div>

                <div className="auth-divider">
                  <span className={isDarkMode ? "dark-mode" : ""}>או</span>
                </div>

                <div className="scrollable-form-content">
                  <div className={`form-group ${loginErrors.username ? "has-error" : ""}`}>
                    <label htmlFor="login-username">שם משתמש</label>
                    <input
                      id="login-username"
                      type="text"
                      name="username"
                      value={loginForm.username}
                      onChange={handleLoginChange}
                      onKeyDown={(e) => handleKeyDown(e, "login")}
                      placeholder="הזן שם משתמש"
                      className={loginErrors.username ? "input-error" : ""}
                    />
                  </div>

                  <div className={`form-group ${loginErrors.password ? "has-error" : ""}`}>
                    <label htmlFor="login-password">סיסמה</label>
                    <input
                      id="login-password"
                      type="password"
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      onKeyDown={(e) => handleKeyDown(e, "login")}
                      placeholder="הזן סיסמה"
                      className={loginErrors.password ? "input-error" : ""}
                    />
                  </div>

                  <div className="form-options">
                    <div className="remember-me">
                      <input type="checkbox" id="remember" checked={rememberMe} onChange={handleRememberMeChange} />
                      <label htmlFor="remember">זכור אותי</label>
                    </div>
                    <a href="#forgot-password" className="forgot-password">
                      שכחת סיסמה?
                    </a>
                  </div>
                </div>

                {/* Error messages section at the bottom of the form */}
                <AnimatePresence>
                  {getLoginErrorMessages().length > 0 && (
                    <motion.div
                      className="auth-errors-container"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {getLoginErrorMessages().map((message, index) => (
                        <div key={index} className="auth-error-message">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                          </svg>
                          <span>{message}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  className={`auth-submit-button ${isLoading ? "loading" : ""}`}
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="button-loader-container">
                      <div className="button-loader"></div>
                      <span>מתחבר...</span>
                    </div>
                  ) : (
                    "התחבר"
                  )}
                </button>

                <div className="auth-switch">
                  אין לך חשבון עדיין?{" "}
                  <button className="auth-switch-button" onClick={() => setActiveTab("register")}>
                    הירשם עכשיו
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="auth-form"
              >
                <h2 className="auth-form-title">הרשמה ל-TalkToMe.AI</h2>

                <div className="social-login-buttons">
                  <button
                    className={`social-login-button google-button ${isDarkMode ? "dark-mode" : ""}`}
                    onClick={() => handleSocialLogin("Google")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                    </svg>
                    <span>הרשמה עם Google</span>
                  </button>
                </div>

                <div className="auth-divider">
                  <span className={isDarkMode ? "dark-mode" : ""}>או</span>
                </div>

                <div className="scrollable-form-content">
                  <div className={`form-group ${registerErrors.username ? "has-error" : ""}`}>
                    <label htmlFor="register-username">שם משתמש *</label>
                    <input
                      id="register-username"
                      type="text"
                      name="username"
                      value={registerForm.username}
                      onChange={handleRegisterChange}
                      onKeyDown={(e) => handleKeyDown(e, "register")}
                      placeholder="הזן שם משתמש"
                      className={registerErrors.username ? "input-error" : ""}
                    />
                  </div>

                  <div className={`form-group ${registerErrors.password ? "has-error" : ""}`}>
                    <label htmlFor="register-password">סיסמה *</label>
                    <input
                      id="register-password"
                      type="password"
                      name="password"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      onKeyDown={(e) => handleKeyDown(e, "register")}
                      placeholder="הזן סיסמה"
                      className={registerErrors.password ? "input-error" : ""}
                    />

                    {/* Password strength meter */}
                    {registerForm.password && (
                      <div className="password-strength-container">
                        <div className="password-strength-meter">
                          <div
                            className="password-strength-progress"
                            style={{
                              width: `${getPasswordStrengthPercentage()}%`,
                              backgroundColor: getPasswordStrengthColor(),
                            }}
                          ></div>
                        </div>
                        <div className="password-strength-text">
                          <span>חוזק הסיסמה: </span>
                          <span style={{ color: getPasswordStrengthColor() }}>{getPasswordStrengthText()}</span>
                        </div>
                        {getPasswordStrengthTips() && (
                          <div className="password-strength-tips">{getPasswordStrengthTips()}</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className={`form-group ${registerErrors.email ? "has-error" : ""}`}>
                    <label htmlFor="register-email">מייל *</label>
                    <input
                      id="register-email"
                      type="email"
                      name="email"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
                      onKeyDown={(e) => handleKeyDown(e, "register")}
                      placeholder="הזן כתובת מייל"
                      className={registerErrors.email ? "input-error" : ""}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-company">חברה</label>
                    <input
                      id="register-company"
                      type="text"
                      name="company"
                      value={registerForm.company}
                      onChange={handleRegisterChange}
                      onKeyDown={(e) => handleKeyDown(e, "register")}
                      placeholder="הזן שם חברה"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-role">תפקיד</label>
                    <input
                      id="register-role"
                      type="text"
                      name="role"
                      value={registerForm.role}
                      onChange={handleRegisterChange}
                      onKeyDown={(e) => handleKeyDown(e, "register")}
                      placeholder="הזן תפקיד"
                    />
                  </div>
                </div>

                {/* Error messages section at the bottom of the form */}
                <AnimatePresence>
                  {getRegisterErrorMessages().length > 0 && (
                    <motion.div
                      className="auth-errors-container"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {getRegisterErrorMessages().map((message, index) => (
                        <div key={index} className="auth-error-message">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                          </svg>
                          <span>{message}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  className={`auth-submit-button ${isLoading ? "loading" : ""}`}
                  onClick={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="button-loader-container">
                      <div className="button-loader"></div>
                      <span>נרשם...</span>
                    </div>
                  ) : (
                    "הירשם"
                  )}
                </button>

                <div className="auth-switch">
                  כבר יש לך חשבון?{" "}
                  <button className="auth-switch-button" onClick={() => setActiveTab("login")}>
                    התחבר עכשיו
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {notification.show && (
            <motion.div
              className="auth-notification"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
