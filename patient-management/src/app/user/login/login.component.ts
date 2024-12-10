import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private patientService: PatientService, private router: Router) {}

  login() {
    // Call the login method from the PatientService
    this.patientService.login(this.username, this.password).subscribe(
      (response: any) => {
        if (response.message === 'Login successful.') {
          // Store the user ID and role in localStorage
          localStorage.setItem('userId', response.user_id);
          localStorage.setItem('role', response.role);

          // Display success message
          Swal.fire({
            title: 'Login Successful!',
            text: 'Welcome back!',
            icon: 'success',
            confirmButtonText: 'Proceed'
          }).then(() => {
            // Redirect based on the user role
            if (response.role === 'admin') {
              this.router.navigate(['admin/appointments']); // Admin dashboard
            } else {
              this.router.navigate(['user/dashboard']); // User dashboard
            }
          });
        } else {
          // If login failed, show error message
          Swal.fire({
            title: 'Login Failed',
            text: response.message, // Display the message from the backend
            icon: 'error',
            confirmButtonText: 'Retry'
          });
        }
      },
      (error: any) => {
        // Handle errors (network issues, etc.)
        Swal.fire({
          title: 'Error',
          text: 'Something went wrong. Please try again later.',
          icon: 'error',
          confirmButtonText: 'Retry'
        });
      }
    );
  }

  // Method to navigate to the Register component
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
