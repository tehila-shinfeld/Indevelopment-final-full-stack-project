// services/user-service.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('/user/all');
  }

  addUser(user: User): Observable<any> {
    return this.http.post('/User', user);
  }

  updateUser(user: User): Observable<any> {
    return this.http.put(`/User/update/${user.id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`/User/delete/${id}`);
  }
}
