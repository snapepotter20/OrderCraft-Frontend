// inventory.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  // ✅ Deliver an order and log transaction
  deliverOrder(orderId: number, user: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/deliver/${orderId}`, user);
  }

  getTransactions(filters?: any): Observable<InventoryTransaction[]> {
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
      { params }
    );
  }

  // ✅ Export PDF
  exportPdf(filters?: any): Observable<Blob> {
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get(`${this.baseUrl}/export/pdf`, {
      params,
      responseType: 'blob', // important for file
      headers: { Accept: 'application/pdf' },
    });
  }

  // ✅ Export Excel
  exportExcel(filters?: any): Observable<Blob> {
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get(`${this.baseUrl}/export/excel`, {
      params,
      responseType: 'blob', // important for file
      headers: {
        Accept:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  }

  getAllReturnOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getallreturnedorders`);
  }

  approveReturnOrder(returnOrderId: number): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/approveReturnOrder/${returnOrderId}`,
      {}
    );
  }

  getFilteredReturnOrders(filters?: any): Observable<any> {
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
      { params }
    );
  }
}
