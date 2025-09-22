// product.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProductDemand {
  demandId: number;
  product: {
    productId: number;
    productName: string;
    productUnitPrice: number;
  };
  user: {
    userId: number;
    username: string;
  };
  demandQuantity: number;
  demandDate: string; // ISO date string from backend
  demandStatus: 'NONE' | 'PENDING' | 'SCHEDULED' | 'FULFILLED' | 'DISPATCHED';
  schedule?: {
    psId: number;
    psStatus: string;
  } | null;
}

export interface RawMaterial {
  raw_material_id: number;
  material_name: string;
  description: string;
  unit_of_measure: string;
  price: number;
  supplier?: {
    supplier_id: number;
    supplier_name: string;
  };
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
    return this.http.post<any>(
      `http://localhost:8094/api/product/addcategory`,
      category
    );
  }

  // product.service.ts
  // updateDemandedQuantity(productId: number, demandedQuantity: number , user:any) {
  //   // const headers = this.getAuthHeaders();
  //   return this.http.patch<any>(
  //     `${this.baseUrl}/updateDemand/${productId}?demandedQuantity=${demandedQuantity}`,user,
  //     {}
  //   );
  // }

  updateDemandedQuantity(
    productId: number,
    demandedQuantity: number,
    user: any
  ) {
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

  getDemandedProducts(): Observable<ProductDemand[]> {
    return this.http.get<ProductDemand[]>(
      `${this.baseUrl}/getalldemandedproducts`
    );
  }

  scheduleProduction(productId: number, data: any) {
    return this.http.post(
      `${this.baseUrl}/schedule-production/${productId}`,
      data
    );
  }

  deliverProduct(demandId: number) {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.baseUrl}/deliverDemand/${demandId}`, {
      headers,
    });
  }

  addRawMaterial(rawMaterial: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/addrawmaterial`, rawMaterial);
  }

  getAllRawMaterials(): Observable<RawMaterial[]> {
    return this.http.get<RawMaterial[]>(`${this.baseUrl}/getallrawmaterials`);
  }

  getSuppliers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/suppliers/getallsuppliers`);
  }
}
