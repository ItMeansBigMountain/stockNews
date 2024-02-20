import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'   
})


export class AuthService {
  constructor(private http: HttpClient) {}
  
  private apiUrl = 'http://localhost:8000'; // Change this to your API's URL

  signup(userData: any) {
    return this.http.post(`${this.apiUrl}/signup/`, userData);
  }
}
