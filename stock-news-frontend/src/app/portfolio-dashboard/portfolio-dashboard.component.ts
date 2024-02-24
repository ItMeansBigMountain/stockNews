import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { StockService } from '../stock.service';


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
    private stockService: StockService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.checkUserToken();
    this.initializeDateRange();
    this.fetchUserInvestments();
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

  private initializeDateRange(): void {
    const currentDate = new Date();
    const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    this.toDate = currentDate.toISOString().split('T')[0];
    this.fromDate = oneWeekAgo.toISOString().split('T')[0];
  }

  private fetchUserInvestments(): void {
    this.stockService.getAllStocks().subscribe({
      next: (stocks) => {
        this.investments = stocks;
        this.cdr.detectChanges(); // Update view with fetched stocks
      },
      error: (error) => {
      }
    });
  }

  logout(): void {
    this.authService.removeToken(); // Remove the token from storage
    this.router.navigate(['/login']); // Navigate back to the login page
  }

  addInvestment(): void {
    const newInvestment = {
      ticker_name: this.newInvestmentSymbol.toUpperCase(),
      amount_invested: this.newInvestmentAmount
      // Add other necessary investment details
    };

    this.stockService.addStock(newInvestment).subscribe({
      next: (response: any) => {
        location.reload()
        this.cdr.detectChanges(); // Refresh the list
      },
      error: (error: any) => {
      }
    });

    // Reset input fields
    this.newInvestmentSymbol = '';
    this.newInvestmentAmount = 0;
  }

  // EDITING
  enableEditing(investment: any): void {
    investment.editing = true;
  }

  deleteEditing(index: number): void {
    const stockId = this.investments[index].id; // Ensure your investments array objects have an 'id' field
    if (stockId) {
      this.stockService.deleteStock(stockId).subscribe({
        next: () => {
          this.investments.splice(index, 1); // Remove the item from the array on successful deletion
          this.cdr.detectChanges(); // Update the view to reflect the changes
        },
        error: (error) => {
          // Handle error, maybe show an error message to the user
        }
      });
    } else {
      // Handle case where stock ID is missing
    }
  }


  saveEditing(investment: any, index: number): void {
    investment.editing = false;

    this.stockService.updateStock(investment.id, { ticker_name: investment.ticker_name, amount_invested: investment.amount_invested })
      .subscribe({
        next: (response) => {
          // Handle successful update
          this.investments[index] = { ...response };
          this.cdr.detectChanges(); // Refresh the list to display updated stock
        },
        error: (error) => {
          // Handle update error
          // Optionally, revert the changes in the UI or show an error message
          investment.editing = true; // Allow the user to try editing again
        }
      });
    // No need to reload the page; Angular should update the view automatically
    // location.reload()
  }


  cancelEditing(investment: any): void {
    investment.editing = false;
    location.reload()
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }

}