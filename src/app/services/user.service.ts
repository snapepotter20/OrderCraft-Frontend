// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Role {
  role_id: number;
}

interface AddressPayload {
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressPostalCode: string;
  addressCountry: string;
}

interface UserPayload {
  username: string;
  password: string;
  email: string;
  role: Role;
  address: AddressPayload;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8094/ordercraft/adduser'; // Adjust endpoint accordingly

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  createUser(user: UserPayload): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(this.apiUrl, user, { headers });
  }

  // user.service.ts
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8094/ordercraft/roles');
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8094/ordercraft/getallusers');
  }

  deleteUser(id: any): Observable<any[]> {
    return this.http.delete<any[]>(
      `http://localhost:8094/ordercraft/deleteuser/${id}`
    );
  }

  updateUser(id: number, user: any) {
    return this.http.put(
      `http://localhost:8094/ordercraft/updateuser/${id}`,
      user,
      { responseType: 'text' }
    );
  }

  unlockUser(id: number) {
    const headers = this.getAuthHeaders();
    return this.http.put(`http://localhost:8094/ordercraft/unlockuser/${id}`, {
      headers,
    });
  }

  lockUser(id: number) {
    const headers = this.getAuthHeaders();
    return this.http.put(`http://localhost:8094/ordercraft/lockuser/${id}`, {
      headers,
    });
  }
}
