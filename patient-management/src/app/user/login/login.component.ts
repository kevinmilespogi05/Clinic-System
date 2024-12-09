import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';

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
        alert('Login successful!');
        localStorage.setItem('userId', response.user.id); // Save user ID in localStorage
        this.router.navigate(['user/dashboard']);
      },
      (error: any) => {
        alert('Login failed! Please check your credentials.');
      }
    );
  }

  // Method to navigate to the Register component
  navigateToRegister() {
    this.router.navigate(['/register']); // Navigate to the register page
  }
}
