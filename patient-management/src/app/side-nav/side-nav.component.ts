import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  username: string = ''; // Store username here

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.fetchUsername();
  }

  fetchUsername() {
    const userId = localStorage.getItem('userId');
  
    if (userId) {
      const apiUrl = `http://localhost/Clinic-System/clinicapi/api/users/get_profile.php?id=${userId}`;
      
      this.http.get<any>(apiUrl).subscribe({
        next: (response) => {
          console.log('API Response:', response);
          if (response.success && response.data.username) {
            this.username = response.data.username; // Use full_name here
          } else {
            console.error('Error fetching username:', response.message);
          }
        },
        error: (error) => {
          console.error('HTTP Error:', error);
        }
      });
    } else {
      console.warn('No user ID found in localStorage');
    }
  }
  
  

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('userId');
        this.router.navigate(['/login']);
      }
    });
  }
}
