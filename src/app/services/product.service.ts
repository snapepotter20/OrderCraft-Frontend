// product.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DemandedProduct {
  productId: number;
  productName: string;
  productUnitPrice: number;
  demandedQuantity: number;
  scheduleStatus?: 'NONE' | 'SCHEDULED' | 'READY' | 'IN_PROGRESS' | 'DISPATCHED';
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:8094/api/orders';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // GET all products
  getAllProducts(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/getallproducts`, { headers });
  }

  // CREATE product
  createProduct(product: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.baseUrl}/addproduct`, product, {
      headers,
    });
  }

  // UPDATE product
  updateProduct(productId: number, product: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(
      `${this.baseUrl}/updateproduct/${productId}`,
      product,
      { headers }
    );
  }

  // DELETE product
  deleteProduct(productId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.baseUrl}/deleteproduct/${productId}`, {
      headers,
    });
  }

  getAllProductsFiltered(name?: string, categoryId?: string) {
    let params: any = {};
    if (name) params.productName = name;
    if (categoryId) params.categoryId = categoryId;

    return this.http.get<any[]>(`${this.baseUrl}/getallproducts`, { params });
  }

  getCategories() {
    return this.http.get<any[]>(
      'http://localhost:8094/api/product/getcategories'
    );
  }

    addCategory(category: { categoryName: string }): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`http://localhost:8094/api/product/addcategory`, category);
  }

  // product.service.ts
  // updateDemandedQuantity(productId: number, demandedQuantity: number , user:any) {
  //   // const headers = this.getAuthHeaders();
  //   return this.http.patch<any>(
  //     `${this.baseUrl}/updateDemand/${productId}?demandedQuantity=${demandedQuantity}`,user,
  //     {}
  //   );
  // }

  updateDemandedQuantity(productId: number, demandedQuantity: number, user: any) {
  const headers = this.getAuthHeaders();
  return this.http.patch<any>(
    `${this.baseUrl}/updateDemand/${productId}?demandedQuantity=${demandedQuantity}&userId=${user.user_id}`,
    {}, // no request body needed
    { headers }
  );
}


  getDemandedProductsCount() {
    return this.http.get<number>(`${this.baseUrl}/demanded/count`);
  }

   getDemandedProducts(): Observable<DemandedProduct[]> {
    return this.http.get<DemandedProduct[]>(`${this.baseUrl}/demanded`);
  }

  scheduleProduction(productId: number, data: any) {
  return this.http.post(`${this.baseUrl}/schedule-production/${productId}`, data);
}

deliverProduct(productId: number) {
  return this.http.post(`${this.baseUrl}/deliver-product/${productId}`, {});
}

}
