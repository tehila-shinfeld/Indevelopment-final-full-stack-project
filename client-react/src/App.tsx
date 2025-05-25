"use client"
import HomePage from "./components/home-page"
import "./styleSheets/App.css"
import { GoogleOAuthProvider } from "@react-oauth/google"
const App = () => {

  // אחרי הטעינה - הצג את עמוד הבית
  return (
    <GoogleOAuthProvider clientId="656531420385-nnep8t03os9k5pm2ccq6nncftv0subva.apps.googleusercontent.com">
      <>
        <HomePage />
      </>
    </GoogleOAuthProvider>
  )
}

export default App
