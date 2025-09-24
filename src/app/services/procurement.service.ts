import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProcurementService {
  private BASE_URL = 'http://localhost:8094/api/orders';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  createOrder(orderData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.BASE_URL}/createorder`, orderData, {
      headers,
    });
  }

  getAllOrders(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.BASE_URL}/history`, { headers });
  }

  getFilteredOrders(status: string, date: string | null): Observable<any[]> {
    const headers = this.getAuthHeaders();
    let params = new HttpParams();

    if (status) params = params.set('status', status);
    if (date) params = params.set('date', date);

    return this.http.get<any[]>(`${this.BASE_URL}/getallorders`, {
      headers,
      params,
    });
  }

  downloadInvoice(orderId: number): Observable<Blob> {
    const headers = this.getAuthHeaders();
    return this.http.get(
      `${this.BASE_URL}/invoice/${orderId}`,
      { headers, responseType: 'blob' } // important for file downloads
    );
  }

  getOrderById(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.BASE_URL}/getorder/${id}`, { headers });
  }
  // Delete order
  deleteOrder(orderId: number) {
    return this.http.delete(`${this.BASE_URL}/delete/${orderId}`);
  }

  // Update order
  updateOrder(orderId: number, orderData: any) {
    return this.http.put(`${this.BASE_URL}/edit/${orderId}`, orderData);
  }

  downloadAllOrdersPdf(): Observable<Blob> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.BASE_URL}/pdf-report`, {
      headers,
      responseType: 'blob',
    });
  }

  // ✅ GET all products
  getAllProducts(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/getallproducts`, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ GET all raw materials
  getAllRawMaterials(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/getallrawmaterials`, {
      headers: this.getAuthHeaders(),
    });
  }

  getDeliveryTrackingByOrderId(orderId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.BASE_URL}/delivery-tracking/${orderId}`, {
      headers,
    });
  }

  cancelOrder(orderId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.BASE_URL}/cancel/${orderId}`, null, {
      headers,
    });
  }

  createPaymentSession(paymentData: any): Observable<any> {
    return this.http.post(
      'http://localhost:8094/api/payment/create-session',
      paymentData
    );
  }

  verifyPaymentStatus(orderId: string): Observable<any> {
    return this.http.get(`https://sandbox.cashfree.com/pg/orders/${orderId}`, {
      headers: {
        'x-api-version': '2022-09-01',
        'x-client-id': 'YOUR_TEST_CLIENT_ID',
        'x-client-secret': 'YOUR_TEST_CLIENT_SECRET',
      },
    });
  }

  createReturnOrder(payload: any) {
    return this.http.post(`${this.BASE_URL}/returnorder`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // procurement.service.ts
  getAllSuppliers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/suppliers/getallsuppliers`, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/getallcustomers`, {
      headers: this.getAuthHeaders(),
    });
  }

  createSupplier(supplier: any): Observable<any> {
    return this.http.post(
      `${this.BASE_URL}/suppliers/createsupplier`,
      supplier,
      { headers: this.getAuthHeaders() }
    );
  }

  updateSupplier(id: number, supplier: any) {
    return this.http.put<any>(`${this.BASE_URL}/suppliers/${id}`, supplier);
  }

  deleteSupplier(id: number) {
    return this.http.delete(`${this.BASE_URL}/suppliers/${id}`);
  }

  uploadContract(supplierId: number, formData: FormData): Observable<any> {
    return this.http.post(
      `${this.BASE_URL}/suppliers/${supplierId}/uploadContract`,
      formData,
      { responseType: 'text' }
    );
  }

  downloadContract(supplierId: number): Observable<Blob> {
    return this.http.get(
      `${this.BASE_URL}/suppliers/${supplierId}/downloadContract`,
      {
        responseType: 'blob',
      }
    );
  }

  // Generate contract API call
  generateContract(supplierId: number): Observable<Blob> {
    const headers = this.getAuthHeaders();
    const url = `${this.BASE_URL}/suppliers/generateContract/${supplierId}`;

    return this.http.get(url, {
      headers,
      responseType: 'blob', // important for file downloads
    });
  }
}
