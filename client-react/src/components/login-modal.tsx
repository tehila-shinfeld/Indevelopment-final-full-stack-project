"use client"
import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import "../styleSheets/login-modal.css"
import { useUser } from "../context/UserContext"
interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (path: string) => void
}

export default function EnhancedLoginModal({ isOpen, onClose, onNavigate }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [isLoading, setIsLoading] = useState(false)
  const { setUser } = useUser();
  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  })

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    email: "",
    company: "",
    role: "",
  })

  // Error messages
  const [loginError, setLoginError] = useState("")
  const [registerError, setRegisterError] = useState("")

  // Handle login form changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
    setLoginError("")
  }

  // Handle register form changes
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterForm((prev) => ({ ...prev, [name]: value }))
    setRegisterError("")
  }

  // Handle social login
  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`)
    // In a real app, you would redirect to the OAuth provider
    showNotification(`מתחבר באמצעות ${provider}...`)
  }

  // Handle login submission
  const handleLogin = async () => {
    try {
      setIsLoading(true)
      setLoginError("")
      // Validate form
      if (!loginForm.username || !loginForm.password) {
        setLoginError("נא למלא את כל השדות")
        setIsLoading(false)
        return
      }
      const response = await axios.post(`https://localhost:7136/api/Auth/login`, {
        Username: loginForm.username,
        Password: loginForm.password,
      })
      const token = response.data.token;
      const userId = response.data.userId;
      const username = response.data.username;
      if (!token) {
        throw new Error("Token not received")
      }
      if (!userId || !username) {
        throw new Error("נתוני התחברות חסרים");
      }
      sessionStorage.setItem("token", token)
      const loggedInUser = {
        username: username,
        id: userId
      };
      setUser(loggedInUser);
      localStorage.setItem('userID', userId);
      console.log("User logged in:", loggedInUser);
      showNotification("התחברת בהצלחה! 🎉")
      // Close modal and navigate
      setTimeout(() => {
        onClose()
        if (sessionStorage.getItem("token")) {
          onNavigate("/myMeetings")
        }
      }, 1500)
    } catch (err) {
      console.error(err)
      setLoginError("שם משתמש או סיסמה שגויים")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle register submission
  const handleRegister = async () => {
    try {
      setIsLoading(true)
      setRegisterError("")
      // Validate form
      if (!registerForm.username || !registerForm.password || !registerForm.email) {
        setRegisterError("נא למלא את כל שדות החובה")
        setIsLoading(false)
        return
      }

      const response = await axios.post(`https://localhost:7136/api/Auth/register`, {
        Username: registerForm.username,
        PasswordHash: registerForm.password,
        Company: registerForm.company,
        Email: registerForm.email,
        Role: registerForm.role,
      })
      const userId = response.data.userId;
      const username = response.data.username;
      if (!userId || !username) {
        throw new Error("נתוני ההרשמה חסרים");
      }
      const loggedInUser = {
        username: username,
        id: userId
      };
      setUser(loggedInUser);
      localStorage.setItem('userID', userId);
      console.log("User registered:", loggedInUser);
      const token = response.data.token
      if (token) {
        sessionStorage.setItem("token", token)
      }

      // Success notification
      showNotification("נרשמת בהצלחה! 🎉")

      // Close modal and navigate
      setTimeout(() => {
        onClose()
        onNavigate("/myMeetings")
      }, 1500)
    } catch (err) {
      console.error(err)
      setRegisterError("אירעה שגיאה בתהליך ההרשמה")
    } finally {
      setIsLoading(false)
    }
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

  // Handle overlay click (close if clicking outside the modal)
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) 
    return null

  return (
    <div className="auth-modal-overlay" onClick={handleOverlayClick}>
      <motion.div
        className="auth-modal"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="auth-modal-header">
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

                {loginError && <div className="auth-error">{loginError}</div>}

                <div className="social-login-buttons">
                  <button className="social-login-button google-button" onClick={() => handleSocialLogin("Google")}>
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
                  <span>או</span>
                </div>

                <div className="scrollable-form-content">
                  <div className="form-group">
                    <label htmlFor="login-username">שם משתמש</label>
                    <input
                      id="login-username"
                      type="text"
                      name="username"
                      value={loginForm.username}
                      onChange={handleLoginChange}
                      onKeyDown={(e) => handleKeyDown(e, "login")}
                      placeholder="הזן שם משתמש"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="login-password">סיסמה</label>
                    <input
                      id="login-password"
                      type="password"
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      onKeyDown={(e) => handleKeyDown(e, "login")}
                      placeholder="הזן סיסמה"
                    />
                  </div>

                  <div className="form-options">
                    <div className="remember-me">
                      <input type="checkbox" id="remember" />
                      <label htmlFor="remember">זכור אותי</label>
                    </div>
                    <a href="#forgot-password" className="forgot-password">
                      שכחת סיסמה?
                    </a>
                  </div>
                </div>

                <button
                  className={`auth-submit-button ${isLoading ? "loading" : ""}`}
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? <div className="button-loader"></div> : "התחבר"}
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

                {registerError && <div className="auth-error">{registerError}</div>}

                <div className="social-login-buttons">
                  <button className="social-login-button google-button" onClick={() => handleSocialLogin("Google")}>
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
                  <span>או</span>
                </div>

                <div className="scrollable-form-content">
                  <div className="form-group">
                    <label htmlFor="register-username">שם משתמש *</label>
                    <input
                      id="register-username"
                      type="text"
                      name="username"
                      value={registerForm.username}
                      onChange={handleRegisterChange}
                      onKeyDown={(e) => handleKeyDown(e, "register")}
                      placeholder="הזן שם משתמש"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-password">סיסמה *</label>
                    <input
                      id="register-password"
                      type="password"
                      name="password"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      onKeyDown={(e) => handleKeyDown(e, "register")}
                      placeholder="הזן סיסמה"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-email">מייל *</label>
                    <input
                      id="register-email"
                      type="email"
                      name="email"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
                      onKeyDown={(e) => handleKeyDown(e, "register")}
                      placeholder="הזן כתובת מייל"
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

                <button
                  className={`auth-submit-button ${isLoading ? "loading" : ""}`}
                  onClick={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading ? <div className="button-loader"></div> : "הירשם"}
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
