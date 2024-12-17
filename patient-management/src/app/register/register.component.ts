import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from '../services/patient.service';
import Swal from 'sweetalert2';
import { FormsModule, NgForm } from '@angular/forms'; // Import NgForm here
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class RegisterComponent {
  @ViewChild('form', { static: false }) form: NgForm | undefined; // Add this line to reference the form
  
  first_name: string = '';
  last_name: string = '';
  username: string = '';
  password: string = '';
  contact_number: string = '';
  date_of_birth: string = '';
  medical_history: string = '';

  // Billing Information
  card_first_name: string = '';
  card_last_name: string = '';
  card_number: string = '';
  card_expiry: string = '';
  card_security_code: string = '';
  billing_address: string = '';
  billing_city: string = '';
  billing_state: string = '';
  billing_postal_code: string = ''; // Add this property for postal code

  constructor(private patientService: PatientService, private router: Router) {}

  // Register method with SweetAlert confirmation
  register() {
    if (this.form?.valid) { // Check form validity here
      // Show SweetAlert confirmation
      Swal.fire({
        title: 'Are you sure?',
        text: 'Please confirm that all the information you entered is correct.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Register',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceed with registration if user confirms
          const userDetails = {
            first_name: this.first_name,
            last_name: this.last_name,
            username: this.username,
            password: this.password,
            contact_number: this.contact_number,
            date_of_birth: this.date_of_birth,
            medical_history: this.medical_history,
            card_first_name: this.card_first_name,
            card_last_name: this.card_last_name,
            card_number: this.card_number,
            card_expiry: this.card_expiry,
            card_security_code: this.card_security_code,
            billing_address: this.billing_address,
            billing_city: this.billing_city,
            billing_state: this.billing_state,
            billing_postal_code: this.billing_postal_code, // Include the billing postal code
          };

          this.patientService
            .register(userDetails)
            .subscribe(
              (response: any) => {
                Swal.fire({
                  title: 'Registration Successful!',
                  text: 'You can now log in with your credentials.',
                  icon: 'success',
                  confirmButtonText: 'Go to Login',
                }).then(() => {
                  this.router.navigate(['/login']);
                });
              },
              (error: any) => {
                Swal.fire({
                  title: 'Registration Failed',
                  text: 'Please check the information and try again.',
                  icon: 'error',
                  confirmButtonText: 'Retry',
                });
              }
            );
        }
      });
    } else {
      Swal.fire({
        title: 'Please fill out all required fields!',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
  }

  validateNumberInput(event: KeyboardEvent): void {
    const inputChar = event.key;
  
    // Allow only numbers (0-9) and control keys like Backspace
    if (!/^\d$/.test(inputChar) && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }
  
  goBack() {
    this.router.navigate(['/login']); // Navigate back to the login page
  }
}
