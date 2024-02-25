import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:8000/api/stocks/'; // Adjust as necessary

  constructor(private http: HttpClient, private authService: AuthService) { }

  addStock(stockData: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, stockData, { headers: headers });
  }

  getAllStocks(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiUrl, { headers: headers });
  }

  updateStock(stockId: number, stockData: any) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}${stockId}/`, stockData, { headers: headers });
  }

  deleteStock(stockId: number) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}${stockId}/`, { headers: headers });
  }

  analyzeStocks(stocks: any[]): Observable<any> {
    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.post(`${this.apiUrl}analyze-stocks/`, { stocks }, { headers });
  }

}
