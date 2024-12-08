import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class RegisterComponent {
  name: string = '';
  username: string = '';
  password: string = '';
  medicalHistory: string = '';
  contact_number: string = '';
  date_of_birth: string = '';

  constructor(private patientService: PatientService, private router: Router) {}

  register() {
    this.patientService.register(
      this.username, 
      this.password, 
      this.name, 
      this.contact_number, 
      this.date_of_birth,
    ).subscribe(
      () => {
        alert('Registration successful!');
        this.router.navigate(['/login']);
      },
      (error: any) => {
        alert('Registration failed! Please try again.');
      }
    );
  }

  // Navigate back to the login page
  goBack() {
    this.router.navigate(['/login']);
  }
}
