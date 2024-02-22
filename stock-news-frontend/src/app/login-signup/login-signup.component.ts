import { Component } from '@angular/core';
import { AuthService } from '../auth.service';  
import { FormsModule, NgForm } from '@angular/forms';

// import { NgFor, NgIf } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';



@Component({
  standalone: false,
  // imports: [FormsModule, NgFor, NgIf, HttpClientModule],
  // providers: [],
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css'],
})
export class LoginSignupComponent {
  isLoginMode = true;

  // Inject AuthService here
  constructor(private authService: AuthService) {}

  toggleMode(event: Event) {
    event.preventDefault();  // Prevent default anchor behavior
    this.isLoginMode = !this.isLoginMode;
  }

  login() {
    // Implement login logic here
  }

  signup(form: NgForm) {

    // Basic validation check
    if (form.invalid) {
      return; 
    }

    // USER DATA
    const userData = {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      confirmPassword: form.value.confirmPassword
    };

    // CALL SIGNUP API CALL FUNCTION 
    this.authService.signup(userData).subscribe({
      next: (response) => {
        console.log('Signup successful', response);
        // Handle successful signup, e.g., redirecting the user
      },
      error: (error) => {
        console.error('Signup failed', error);
        // Handle signup error, e.g., displaying an error message
      }
    });
  }
}
