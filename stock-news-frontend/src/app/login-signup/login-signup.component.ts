import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css'],
})
export class LoginSignupComponent {
  isLoginMode = true;
  password: string = '';
  confirmPassword: string = '';

  constructor(private authService: AuthService) {}

  toggleMode(event: Event): void {
    event.preventDefault();
    this.isLoginMode = !this.isLoginMode;
  }

  login(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    // Implement login logic using AuthService
    // Example: this.authService.login(form.value.email, form.value.password);
  }

  signup(form: NgForm): void {
    if (form.invalid || form.value.password !== form.value.confirmPassword) {
      console.log(form.invalid)
      console.log(form.value.password)
      console.log(form.value.confirmPassword)
      console.log(form.value)
      console.log("invalid form")
      return; // Add error handling for unmatched passwords
    }

    const userData = {
      username: form.value.username,
      email: form.value.email,
      password: this.password,
    };

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
