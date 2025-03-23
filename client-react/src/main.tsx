import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'; // ייבוא של RouterProvider
import Home from './components/Home.tsx';
import MainScreen from './components/MainScreen.tsx';

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
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* אין צורך ב-<BrowserRouter> כאן, הוא כבר בעץ הקומפוננטות ב-App */}
    <RouterProvider router={routes} /> {/* הוספת ה-RouterProvider עם הנתיבים */}
  </StrictMode>
);
