import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BrokerIntegrationService } from '../broker-integration.service';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-settings',
  standalone: false,
  // imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})


export class SettingsComponent {
  robinHoodLogin = false;

  constructor(
    private router: Router,
    private brokerService: BrokerIntegrationService
  ) { }

  saveSettings() {
    // Implement saving logic here
    // Update the backend with the selected news sources
  }

  goBackToDashboard() {
    this.router.navigate(['/dashboard']);
  }



  // BROKER INTEGRATION

  toggleMode(event: Event): void {
    event.preventDefault();
    this.robinHoodLogin = !this.robinHoodLogin;
  }


  updateInvestmentsFromRobinhood(userData: NgForm) {
    
    this.brokerService.importFromRobinhood(userData).subscribe({
      next: (response) => {
        console.log('Investments updated successfully', response);
        // You can add logic here to inform the user of a successful update or to update the UI accordingly
      },
      error: (error) => {
        console.error('Error updating investments', error);
        // Handle any errors here, such as displaying an error message to the user
      }
    });
  }
}