import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  passwordVisible: boolean = false; // To toggle password visibility

  constructor(private router: Router) {}

  onSubmit() {
    if (this.username === 'patient' && this.password === 'patient123') {
      // Simulate successful login
      this.router.navigate(['/user/dashboard']);
    } else if (this.username === 'admin' && this.password === 'admin123') {
      // Simulate admin login
      this.router.navigate(['/admin/dashboard']);
    } else {
      alert('Invalid credentials');
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible; // Toggle the visibility state
  }
}
