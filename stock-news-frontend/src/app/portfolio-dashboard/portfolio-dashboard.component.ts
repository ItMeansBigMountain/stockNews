import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-portfolio-dashboard',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf], 
  templateUrl: './portfolio-dashboard.component.html',
  styleUrls: ['./portfolio-dashboard.component.css']
})




export class PortfolioDashboardComponent implements OnInit {
  // TIMEFRAME
  fromDate!: string;
  toDate!: string;

  // ADDING INVESTMENTS
  newInvestmentSymbol: string = '';
  newInvestmentAmount: number = 0;
  investments: any[] = []; 

  // EDITING INVESTMENTS
  // ...

  // __INIT__
  ngOnInit(): void {
    const currentDate = new Date();
    const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    this.toDate = currentDate.toISOString().split('T')[0];
    this.fromDate = oneWeekAgo.toISOString().split('T')[0];
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


  enableEditing(investment: any): void {
    investment.editing = true;
  }

  saveEditing(investment: any, index: number): void {
    investment.editing = false;
    this.investments[index] = {...investment};
    // Optionally, update the backend with the edited investment
  }

  deleteEditing(investment: any, index: number): void {
    investment.editing = false;
    let pos = this.investments.indexOf(index);
    let elementsToRemove = 1;
    this.investments = this.investments.splice(index, elementsToRemove);
    // Optionally, update the backend with the edited investment
  }

  cancelEditing(investment: any): void {
    investment.editing = false;
    // Reset the investment if necessary or reload from backend
  }


}