import { Component } from '@angular/core';

@Component({
  selector: 'app-login-signup',
  standalone: true,
  imports: [],
  templateUrl: './login-signup.component.html',
  styleUrl: './login-signup.component.css'
})
export class LoginSignupComponent {

}





// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AuthService } from '../services/auth.service'; // Assuming you have an AuthService

// @Component({
//   selector: 'app-login-signup',
//   templateUrl: './login-signup.component.html',
//   styleUrls: ['./login-signup.component.css']
// })
// export class LoginSignupComponent {
//   loginForm: FormGroup;
//   isLoading = false; // To handle loading state

//   constructor(private formBuilder: FormBuilder, private authService: AuthService) {
//     this.loginForm = this.formBuilder.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required]]
//     });
//   }

//   // Getter for easy access to form fields
//   get f() { return this.loginForm.controls; }

//   onSubmit() {
//     if (this.loginForm.invalid) {
//       return;
//     }

//     this.isLoading = true;
//     const loginData = {
//       email: this.f.email.value,
//       password: this.f.password.value
//     };

//     this.authService.login(loginData).subscribe(
//       data => {
//         console.log('Login successful', data);
//         this.isLoading = false;
//         // Navigate to dashboard or other actions
//       },
//       error => {
//         console.error('Login failed', error);
//         this.isLoading = false;
//         // Handle error
//       }
//     );
//   }
// }
