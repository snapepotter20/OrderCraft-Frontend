import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8090';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      authorization: 'Basic ' + btoa(username + ':' + password)
    });

    return this.http.get(`${this.baseUrl}/welcome`, {
      headers,
      responseType: 'text'
    });
  }

  resetPassword(username: string, newPassword: string): Observable<any> {
    const body = { username, newPassword };
    return this.http.post(`${this.baseUrl}/reset-password`, body);
  }
}
