import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrlLogin = 'http://localhost:5000/login';
  private apiUrl = 'http://localhost:5000/orders';
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  // Método para fazer login e armazenar o token
  login(): Observable<any> {
    return this.http
      .post<{ token: string }>(this.apiUrlLogin, {
        username: 'Matheus Santos',
        password: 'Mq2109',
      })
      .pipe(
        tap((response) => {
          if (response && response.token) {
            this.token = response.token;

          }
        }),
        catchError((error) => this.handleError(error))
      );
  }

  // Método para obter os cabeçalhos com o token
  private getHeaders(): HttpHeaders {
    if (!this.token) {
      throw new Error('Token não disponível. Faça login primeiro.');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  }

  // Método para garantir que o login seja feito antes de qualquer requisição
  private ensureAuthenticated(): Observable<void> {
    if (this.token) {
      return of(undefined); // Se já houver um token, retorna um Observable vazio
    } else {
      return this.login().pipe(
        switchMap(() => of(undefined)) // Faz o login e retorna um Observable vazio
      );
    }
  }

  // Método para buscar pedidos
  getOrders(): Observable<any[]> {
    return this.ensureAuthenticated().pipe(
      switchMap(() => {
        const headers = this.getHeaders();
        return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
          catchError((error) => this.handleError(error)) // Trata erros
        );
      })
    );
  }

  // Método para criar um pedido
  createOrder(order: any): Observable<any> {
    return this.ensureAuthenticated().pipe(
      switchMap(() => {
        const headers = this.getHeaders();
        return this.http.post<any>(this.apiUrl, order, { headers }).pipe(
          catchError((error) => this.handleError(error)) // Trata erros
        );
      })
    );
  }

  // Método para atualizar o status de um pedido
  updateOrderStatus(id: string, status: string): Observable<any> {
    return this.ensureAuthenticated().pipe(
      switchMap(() => {
        const headers = this.getHeaders();
        return this.http
          .patch<any>(`${this.apiUrl}/${id}`, { status }, { headers })
          .pipe(
            catchError((error) => this.handleError(error)) // Trata erros
          );
      })
    );
  }

  // Método para tratar erros
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 403) {
      console.error('Token inválido ou expirado. Faça login novamente.');
      // Aqui você pode redirecionar o usuário para a tela de login
    } else {
      console.error('Erro na requisição:', error.message);
    }
    return throwError(() => error);
  }
}
