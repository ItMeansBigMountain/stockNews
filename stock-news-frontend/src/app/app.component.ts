import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { StockService } from './stock.service';



@Component({
  selector: 'app-root',
  standalone: false,
  // imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  userData: any;
  fromDate!: string;
  toDate!: string;
  newInvestmentSymbol: string = '';
  newInvestmentAmount: number = 0;
  investments: any[] = [];
  isLoading: boolean = false;
  emotionChartData: any[] = []


  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService
  ) { }


  ngOnInit(): void {
    this.checkUserToken();
  }

  private checkUserToken(): void {
    const token = this.authService.getToken();
    if (token) {
      this.authService.getUserData().subscribe({
        next: (data) => {
          this.userData = data;
          this.cdr.detectChanges(); // Update view with user data
        },
        error: (error) => {
          this.authService.removeToken(); // Remove invalid token
          this.router.navigate(['/login']); // Redirect to login if token validation fails
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  title = 'stock-news-frontend';
}
