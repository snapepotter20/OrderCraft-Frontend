import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Profile {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  profilePictureUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private baseUrl = 'http://localhost:8094/ordercraft/profile';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(this.baseUrl, {
      headers: this.getHeaders(),
    });
  }

  updateProfile(id: number, data: Partial<Profile>): Observable<Profile> {
    return this.http.put<Profile>(`${this.baseUrl}/${id}`, data, {
      headers: this.getHeaders(),
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // 🔐 JWT token should be stored after login
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
}
