import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/orders';
  private loginUrl = 'http://localhost:5000/login';
  private token: string | null = null; // Variável para armazenar o token

  constructor(private http: HttpClient) {}

  // Método para fazer login e obter o token
  login(username: string, password: string): Observable<any> {
    const credentials = { username, password };
    return this.http.post<any>(this.loginUrl, credentials);
  }

  // Método para definir o token
  setToken(token: string): void {
    this.token = token;
  }

  // Método para obter os headers com o token
  private getHeaders(): HttpHeaders {
    if (!this.token) {
      throw new Error('Token não disponível. Faça login primeiro.');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  }

  getOrders(): Observable<any[]> {
    const headers = this.getHeaders(); // Obtém os headers com o token
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  createOrder(order: any): Observable<any> {
    const headers = this.getHeaders(); // Obtém os headers com o token
    return this.http.post<any>(this.apiUrl, order, { headers });
  }

  updateOrderStatus(id: string, status: string): Observable<any> {
    const headers = this.getHeaders(); // Obtém os headers com o token
    return this.http.patch<any>(`${this.apiUrl}/${id}`, { status }, { headers });
  }
}
