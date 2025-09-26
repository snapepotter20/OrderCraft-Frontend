// token.service.ts
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;
    return jwtDecode(token);
  }

  getAuthorities(): string[] {
    const decoded = this.getDecodedToken();
    return decoded?.authorities || [];
  }

  getUserId(): number | null {
    const decoded = this.getDecodedToken();
    return decoded?.userId || null;
  }

  getUsername(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.sub || null;
  }
}
