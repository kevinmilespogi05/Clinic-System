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
    this.patientService.login(this.username, this.password).subscribe(
      (response: any) => {
        Swal.fire({
          title: 'Login Successful!',
          text: 'Welcome back!',
          icon: 'success',
          confirmButtonText: 'Proceed'
        }).then(() => {
          localStorage.setItem('userId', response.user.id); // Save user ID in localStorage
          this.router.navigate(['user/dashboard']); // Redirect to dashboard
        });
      },
      (error: any) => {
        Swal.fire({
          title: 'Login Failed',
          text: 'Invalid username or password. Please try again.',
          icon: 'error',
          confirmButtonText: 'Retry'
        });
      }
    );
  }

  // Method to navigate to the Register component
  navigateToRegister() {
    this.router.navigate(['/register']); // Navigate to the register page
  }
}
