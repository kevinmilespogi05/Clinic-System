import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
<<<<<<< Updated upstream
  styleUrls: ['./login.component.css']
=======
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
>>>>>>> Stashed changes
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
<<<<<<< Updated upstream
  passwordVisible: boolean = false; // Track password visibility
=======
  name: string = ''; // Add this line
  contact_number: string = ''; // Add this line
  date_of_birth: string = ''; // Add this line
  errorMessage: string = '';
  showRegister: boolean = false;
>>>>>>> Stashed changes

  constructor(private userService: PatientService) {}

  ngOnInit(): void {}

  register(username: string, password: string, name: string, contact_number: string, date_of_birth: string): void {
    this.userService.register(username, password, name, contact_number, date_of_birth).subscribe(
      (response) => {
        // handle successful registration
        console.log('Registration successful', response);
      },
      (error) => {
        // handle error
        this.errorMessage = 'Registration failed: ' + error.message;
      }
    );
  }

  login(username: string, password: string): void {
    this.userService.login(username, password).subscribe(
      (response) => {
        // handle successful login
        console.log('Login successful', response);
      },
      (error) => {
        // handle error
        this.errorMessage = 'Login failed: ' + error.message;
      }
    );
  }

  toggleRegister(): void {
    this.showRegister = !this.showRegister;
  }
<<<<<<< Updated upstream

  // Toggle the visibility of the password
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  // Redirect to the register page when "Sign Up" is clicked
  goToRegister(event: Event) {
    event.preventDefault(); // Prevent the form's default behavior
    this.router.navigate(['/register']); // Navigate to the register page
  }  
  
=======
>>>>>>> Stashed changes
}
