import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css'],
})
export class LoginSignupComponent {
  isLoginMode = true;
  password: string = '';
  confirmPassword: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  toggleMode(event: Event): void {
    event.preventDefault();
    this.isLoginMode = !this.isLoginMode;
  }

  login(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.authService.login(form.value.username, form.value.password).subscribe({
      next: (response) => {
        // RESPONSE SHOULD CONTAIN AUTH TOKEN
        console.log('Login successful', response);
        // Redirect to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }

  signup(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    const userData = {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
    };
    this.authService.signup(userData).subscribe({
      next: (signup_response) => {
        this.authService.login(userData.username, userData.password).subscribe({
          next: (login_response) => {
            // RESPONSE SHOULD CONTAIN AUTH TOKEN
            console.log('Login successful', login_response);
            // Redirect to dashboard
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Login failed', error);
          }
        });
      },
      error: (error) => {
        console.error('Signup failed', error);
      }
    });
  }
}