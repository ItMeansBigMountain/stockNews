import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-portfolio-dashboard',
  templateUrl: './portfolio-dashboard.component.html',
  styleUrls: ['./portfolio-dashboard.component.css']
})
export class PortfolioDashboardComponent implements OnInit {

  userData: any;
  fromDate!: string;
  toDate!: string;
  newInvestmentSymbol: string = '';
  newInvestmentAmount: number = 0;
  investments: any[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.checkUserToken();
    this.initializeDateRange();
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
          console.error('Error fetching user data:', error);
          this.authService.removeToken(); // Remove invalid token
          this.router.navigate(['/login']); // Redirect to login if token validation fails
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  private initializeDateRange(): void {
    const currentDate = new Date();
    const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    this.toDate = currentDate.toISOString().split('T')[0];
    this.fromDate = oneWeekAgo.toISOString().split('T')[0];
  }


  logout(): void {
    this.authService.removeToken(); // Remove the token from storage
    this.router.navigate(['/login']); // Navigate back to the login page
  }


  addInvestment(): void {
    const newInvestment = {
      symbol: this.newInvestmentSymbol.toUpperCase(),
      amount: this.newInvestmentAmount,
      // Add other necessary investment details
    };

    this.investments.push(newInvestment);

    // Reset input fields
    this.newInvestmentSymbol = '';
    this.newInvestmentAmount = 0;

    // UPDATE BACKEND WITH UPDATED INVESTMENT LIST

  }






  // EDITING
  enableEditing(investment: any): void {
    investment.editing = true;
  }

  deleteEditing(index: number): void {
    this.investments.splice(index, 1);
    this.cdr.detectChanges(); // Trigger change detection
    // Optionally, update the backend
  }

  saveEditing(investment: any, index: number): void {
    investment.editing = false;
    this.investments[index] = { ...investment };
    // Optionally, update the backend with the edited investment
  }

  cancelEditing(investment: any): void {
    investment.editing = false;
    // Reset the investment if necessary or reload from backend
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }

}