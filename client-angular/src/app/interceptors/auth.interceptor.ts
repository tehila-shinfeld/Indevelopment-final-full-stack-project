import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment.prod';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // אם ה-URL לא מלא (כלומר לא מתחיל ב-http), נוסיף את baseUrl מהסביבה
  const apiUrl = req.url.startsWith('http') ? req.url : `${environment.apiUrl}${req.url}`;
  const clonedReq = req.clone({
    url: apiUrl,
    setHeaders: token ? {
      Authorization: `Bearer ${token}`
    } : {}
  });
  return next(clonedReq);
}



