import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Adjust path as needed

@Injectable({
  providedIn: 'root'
})
export class BrokerIntegrationService {

  private apiUrl = 'http://localhost:8000/api'; // Replace with your API endpoint

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Method to import stock data from Robinhood
  importFromRobinhood(userData: any): Observable<any> {
    const token = this.authService.getToken(); // Assumes you have a method to get the stored token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const data = {
      testing : "this"
    }
    console.log(userData.value);

    return this.http.post(`${this.apiUrl}/robinhood-import`, data, { headers: headers });
  }




  // You can add similar methods for other platforms like ETrade, Schwab, etc.
}
