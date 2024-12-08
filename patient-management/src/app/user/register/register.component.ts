<<<<<<< Updated upstream
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
=======
// register.component.ts
import { Component } from '@angular/core';
import { PatientService } from '../../services/patient.service'; // Adjust the path as needed

@Component({
  selector: 'app-register',
>>>>>>> Stashed changes
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
<<<<<<< Updated upstream
  firstName: string = '';
  lastName: string = '';
  dob: string = '';
  contactNo: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    // Simulate a successful registration (you can add logic to save data here)
    if (this.firstName && this.lastName && this.dob && this.contactNo) {
      alert('Registration Successful');
      // Redirect to the login page after registration
      this.router.navigate(['/login']);
    } else {
      alert('Please fill out all fields');
    }
  }

  // Redirect to the login page when "Login" button is clicked
  goToLogin() {
    this.router.navigate(['/login']); // Adjust this path based on your routing setup
  }
}


=======
  username: string = '';
  password: string = '';
  name: string = '';
  contact_number: string = '';
  date_of_birth: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private patientService: PatientService) {}

  register(): void {
    this.patientService.register(this.username, this.password, this.name, this.contact_number, this.date_of_birth)
      .subscribe(
        (response) => {
          console.log(response);
          if (response.success) {
            this.successMessage = 'Registration successful!';
          } else {
            this.errorMessage = 'Registration failed: ' + response.message;
          }
        },
        (error) => {
          console.error(error);
          this.errorMessage = 'An error occurred during registration.';
        }
      );
  }
}
>>>>>>> Stashed changes
