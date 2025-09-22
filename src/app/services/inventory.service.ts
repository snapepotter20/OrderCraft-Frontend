// inventory.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Model interface for inventory transaction
export interface InventoryTransaction {
  transactionId?: number;
  userId: number | any; // pass logged-in userId or full object
  product: any; // pass productId or product object
  transactionDate?: string;
  transactionType: string;
  quantity: number;
  reference: string;
}


@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private baseUrl = 'http://localhost:8094/api/orders/inventory';
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // /**
  //  * ✅ Deliver an order and log transaction
  //  * @param orderId
  //  * @param user logged-in user object
  //  */
  deliverOrder(orderId: number, user: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.baseUrl}/deliver/${orderId}`, user, {
      headers,
    });
  }

  getTransactions(filters?: any): Observable<InventoryTransaction[]> {
    const headers = this.getAuthHeaders();
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<InventoryTransaction[]>(
      `${this.baseUrl}/getalltransactions`,
      { headers, params }
    );
  }

  // ✅ Export PDF
  exportPdf(filters?: any): Observable<Blob> {
    const headers = this.getAuthHeaders().set('Accept', 'application/pdf');
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get(`${this.baseUrl}/export/pdf`, {
      headers,
      params,
      responseType: 'blob', // important for file
    });
  }

  // ✅ Export Excel
  exportExcel(filters?: any): Observable<Blob> {
    const headers = this.getAuthHeaders().set(
      'Accept',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get(`${this.baseUrl}/export/excel`, {
      headers,
      params,
      responseType: 'blob', // important for file
    });
  }

  getAllReturnOrders() {
    return this.http.get(`${this.baseUrl}/getallreturnedorders`);
  }

  approveReturnOrder(returnOrderId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(
      `${this.baseUrl}/approveReturnOrder/${returnOrderId}`,
      {},
      { headers }
    );
  }

  getFilteredReturnOrders(filters?: any): Observable<any> {
    const headers = this.getAuthHeaders();
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get(
      `${this.baseUrl.replace('/inventory', '')}/returnorder/filter`,
      {
        headers,
        params,
      }
    );
  }
}
