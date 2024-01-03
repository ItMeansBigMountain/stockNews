import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})


export class SettingsComponent {
  // Add properties to bind to your form elements if needed

  constructor(private router: Router) {}

  saveSettings() {
    // Implement saving logic here
    // Update the backend with the selected news sources
  }

  goBackToDashboard() {
    this.router.navigate(['/dashboard']); 
  }
}
