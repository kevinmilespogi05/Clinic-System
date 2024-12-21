import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from '../services/patient.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private patientService: PatientService, private router: Router) {}

  login() {
    this.patientService.login(this.username, this.password).subscribe(
      (response: any) => {
        if (response.message === 'Login successful.') {
          localStorage.setItem('userId', response.user_id);
          localStorage.setItem('role', response.role);

          if (response.role === 'admin') {
            Swal.fire({
              title: 'Admin Login Successful!',
              text: 'Welcome back, Admin!',
              icon: 'success',
              confirmButtonText: 'Proceed'
            }).then(() => {
              this.router.navigate(['admin/appointments']);
            });
          } else {
            Swal.fire({
              title: 'User Login Successful!',
              text: `Welcome, ${response.first_name}!`,  // Personalized welcome message
              icon: 'success',
              confirmButtonText: 'Proceed'
            }).then(() => {
              this.router.navigate(['appointments']);
            });
          }
          
        } else {
          Swal.fire({
            title: 'Login Failed',
            text: response.message,
            icon: 'error',
            confirmButtonText: 'Retry'
          });
        }
      },
      (error: any) => {
        Swal.fire({
          title: 'Error',
          text: 'Something went wrong. Please try again later.',
          icon: 'error',
          confirmButtonText: 'Retry'
        });
      }
    );
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
