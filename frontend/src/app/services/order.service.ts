import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/orders';
  private token = 'TOKEN-FIXO-NO-CODIGO'; // Token fixo

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  }

  getOrders(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  createOrder(order: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(this.apiUrl, order, { headers });
  }

  updateOrderStatus(id: string, status: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch<any>(`${this.apiUrl}/${id}`, { status }, { headers });
  }
}
