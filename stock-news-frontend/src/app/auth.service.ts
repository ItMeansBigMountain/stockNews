import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:8000'; // Change this to your API's URL

  // USER SIGNUP AND LOGIN
  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/signup/`, userData);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/token/`, { username: username, password: password });
  }

  // Fetch user data using JWT
  getUserData(): Observable<any> {
    // Retrieve token from session storage
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    // Prepare HTTP headers with authorization token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Send the request with headers
    return this.http.get(`${this.apiUrl}/api/user/`, { headers });
  }

  // SAVING AUTH TOKEN USING SESSION STORAGE
  saveToken(token: string): void {
    sessionStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  removeToken(): void {
    sessionStorage.removeItem('authToken');
  }

  // Uncomment below if you want to switch back to using localStorage
  /*
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  removeToken(): void {
    localStorage.removeItem('authToken');
  }
  */
}
