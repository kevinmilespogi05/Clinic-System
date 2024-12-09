import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'] // Corrected 'styleUrl' to 'styleUrls'
})
export class ProfileComponent implements OnInit {
  userId: number | null = null; // Set this based on your authentication logic
  profileData: any = null;
  errorMessage: string | null = null;

  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit(): void {
    // Replace this with actual user authentication logic
    this.userId = Number(localStorage.getItem('userId')); // Get userId from localStorage or session
    if (this.userId) {
      this.fetchProfileData(this.userId);
    } else {
      this.errorMessage = 'User not logged in';
      this.router.navigate(['/login']);
    }
  }

  fetchProfileData(userId: number): void {
    this.patientService.getProfile(userId).subscribe({
      next: (response) => {
        // Handle the profile data successfully fetched
        if (response.success) {
          this.profileData = response.data; // Adjust according to API response structure
        } else {
          this.errorMessage = response.message || 'Profile data not found.';
        }
      },
      error: (error) => {
        console.error('Error fetching profile data:', error);
        this.errorMessage = 'Failed to fetch profile data. Please try again later.';
      }
    });
  }
}
