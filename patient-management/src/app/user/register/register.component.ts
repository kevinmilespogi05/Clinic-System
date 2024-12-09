import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  contact_number: string = '';
  date_of_birth: string = '';
  medicalHistory: string = '';

  constructor(private patientService: PatientService, private router: Router) {}

  // Register method with SweetAlert confirmation
  register() {
    // Show SweetAlert confirmation
    Swal.fire({
      title: 'Are you sure?',
      text: 'Please confirm that all the information you entered is correct.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Register',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with registration if user confirms
        const userDetails = {
          username: this.username,
          password: this.password,
          name: this.name,
          contact_number: this.contact_number,
          date_of_birth: this.date_of_birth,
          medicalHistory: this.medicalHistory
        };

        this.patientService.register(
          this.username,
          this.password,
          this.name,
          this.contact_number,
          this.date_of_birth
        ).subscribe(
          (response: any) => {
            Swal.fire({
              title: 'Registration Successful!',
              text: 'You can now log in with your credentials.',
              icon: 'success',
              confirmButtonText: 'Go to Login'
            }).then(() => {
              this.router.navigate(['/login']);
            });
          },
          (error: any) => {
            Swal.fire({
              title: 'Registration Failed',
              text: 'Please check the information and try again.',
              icon: 'error',
              confirmButtonText: 'Retry'
            });
          }
        );
      }
    });
  }    

  goBack() {
    this.router.navigate(['/login']); // Navigate back to the login page
  }
}
