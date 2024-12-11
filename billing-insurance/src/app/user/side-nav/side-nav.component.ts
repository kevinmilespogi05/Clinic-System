import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-side-nav',
  standalone: true, // Mark as standalone component
  imports: [RouterModule], // Import RouterModule here
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent {
  constructor(private router: Router) {}

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        this.router.navigate(['/login']);
      }
    });
  }
}
