import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewauthService {

   private baseUrl = 'http://localhost:8094/ordercraft';

  constructor(private http: HttpClient) {}

  login(data: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
  }
    resetPassword(username: string, newPassword: string): Observable<any> {
    const body = { username, newPassword };
    return this.http.post(`${this.baseUrl}/reset-password`, body);
  }

    getUserRoleFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("payload?.authorities",payload?.authorities);
      return payload?.authorities?.[0] || null;
    } catch (err) {
      console.error('Invalid token:', err);
      return null;
    }
  }

  sendOtp(username: string) {
  return this.http.post(`${this.baseUrl}/send-otp`, { username });
}

verifyOtpAndResetPassword(username: string, otp: string, newPassword: string) {
  return this.http.post(`${this.baseUrl}/verify-otp-reset`, {
    username,
    otp,
    newPassword,
  });
}


}
