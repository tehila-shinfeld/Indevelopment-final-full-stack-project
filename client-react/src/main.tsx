import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'; // ייבוא של RouterProvider
import Home from './components/Home.tsx';
import MainScreen from './components/MainScreen.tsx';
import { SummaryProvider } from './components/context/SummaryContext.tsx';
import { UserProvider } from './components/context/UserContext.tsx';
import UserMeetings from './components/UserMeetings.tsx';

// הגדרת הנתיבים
const routes = createBrowserRouter([
  {
    path: '/', // דף הבית הראשי
    element: <Navigate to="/home" />, // הפניה אוטומטית ל-home
  },
  {
    path: '/home', // דף הבית
    element: <Home />, // קומפוננטת Home
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
      {/* שאר הקומפוננטות */}
      <>
        <StrictMode>
          {/* אין צורך ב-<BrowserRouter> כאן, הוא כבר בעץ הקומפוננטות ב-App */}
          <RouterProvider router={routes} /> {/* הוספת ה-RouterProvider עם הנתיבים */}
        </StrictMode>
      </>
    </UserProvider>

  </SummaryProvider>

);
