import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BillingService } from '../../services/billing.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private billingService: BillingService, private router: Router) {}

  login() {
    // Call the login method from the BillingService
    this.billingService.login(this.username, this.password).subscribe(
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
            confirmButtonText: 'Proceed',
          }).then(() => {
            // Redirect to the billing page for users, or an admin page for admin roles
            if (response.role === 'admin') {
              this.router.navigate(['admin/invoice']); // Admin dashboard
            } else {
              this.router.navigate(['user/billing']); // Redirect to billing page for users
            }
          });
        } else {
          // If login failed, show error message
          Swal.fire({
            title: 'Login Failed',
            text: response.message, // Display the message from the backend
            icon: 'error',
            confirmButtonText: 'Retry',
          });
        }
      },
      (error: any) => {
        // Handle errors (network issues, etc.)
        Swal.fire({
          title: 'Error',
          text: 'Something went wrong. Please try again later.',
          icon: 'error',
          confirmButtonText: 'Retry',
        });
      }
    );
  }
}
