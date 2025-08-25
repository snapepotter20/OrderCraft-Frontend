import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductionSchedule {
  psId: number;
  psStartDate: string;
  psEndDate: string;
  psQuantity: number;
  psStatus: string;
  psProductId: {
    productId: number;
    productName: string;
    productUnitPrice: number;
  };
   completedQuantity?: number; 
}

export interface Category {
  categoryId: number;
  categoryName: string;
}

export interface Product {
  productId: number;
  productName: string;
  productDescription: string;
  threshold: number;
  demandedQuantity: number | null;
  category: Category;
  productUnitPrice: number;
  productQuantity: number;
}

export interface DeliveredProduct {
  psId: number;
  psStartDate: string;
  psEndDate: string;
  psQuantity: number;
  psStatus: string;
  completedQuantity: number;
  qcBufferHours: number;
  psProductId: Product;
}


@Injectable({
  providedIn: 'root'
})
export class ProductionService {
  private baseUrl = 'http://localhost:8094/api/orders';

    private getAuthHeaders(): HttpHeaders {
      const token = localStorage.getItem('token');
      return new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
    }

  constructor(private http: HttpClient) {}

  getScheduledProducts(): Observable<ProductionSchedule[]> {
     const headers = this.getAuthHeaders();
    return this.http.get<ProductionSchedule[]>(`${this.baseUrl}/scheduled-products`, { headers });
  }

    dispatchProduct(psId: number): Observable<ProductionSchedule> {
    return this.http.post<ProductionSchedule>(`${this.baseUrl}/dispatch/${psId}`, {});
  }

  
  getDeliveredProducts(): Observable<DeliveredProduct[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<DeliveredProduct[]>(`${this.baseUrl}/delivered-products`, { headers });
  }
}
