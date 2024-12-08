import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
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


