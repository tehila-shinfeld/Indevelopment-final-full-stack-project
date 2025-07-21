import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import { log } from 'console';
interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
      console.log(`Attempting to log in with username: ${username} and password: ${password}`);
    return this.http.post<LoginResponse>('/Auth/login', {
      username, // אות קטנה!
      password  // אות קטנה!
    }).pipe(
      tap((res: LoginResponse) => {
        const decodedToken: any = jwtDecode(res.token);
        console.log("Decoded Token:", decodedToken);
        if (decodedToken.role === 'Admin') {
          localStorage.setItem('token', res.token);
        } else {
          console.log("vv")
          throw new Error('Unauthorized access');
        }
      })
    );
  }
  logout(): void { 
    localStorage.removeItem('token'); 
  }
}
