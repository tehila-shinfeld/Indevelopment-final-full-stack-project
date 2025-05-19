import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'; // ייבוא של RouterProvider
import MainScreen from './components/MainScreen.tsx';
import { SummaryProvider } from './context/SummaryContext.tsx';
import { UserProvider } from './context/UserContext.tsx';
import UserMeetings from './components/UserMeetings.tsx';
import HomePage from './components/home-page.tsx';

// הגדרת הנתיבים
const routes = createBrowserRouter([
  {
    path: '/', // דף הבית הראשי
    element: <Navigate to="/home" />, // הפניה אוטומטית ל-home
  },
  {
    path: '/home', // דף הבית
    element: <HomePage />, // קומפוננטת Home
  },
  {
    path: '/summary-up!', // דף הבית
    element: <MainScreen />, // קומפוננטת Dashboard
  },
  {
    path: '/myMeetings', // דף הבית
    element: <UserMeetings />, // קומפוננטת Dashboard
  },
  // UserMeetings
]);

createRoot(document.getElementById('root')!).render(
  <SummaryProvider>
    <UserProvider>
      <>
        <StrictMode>
          <RouterProvider router={routes} /> 
        </StrictMode>
      </>
    </UserProvider>

  </SummaryProvider>

);
