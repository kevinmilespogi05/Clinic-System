import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: number | null = null; // Set this based on your authentication logic
  profileData: any = null;
  errorMessage: string | null = null;
  isEditing: boolean = false;
  updatedProfileData: any = {};

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
        if (response.success) {
          this.profileData = response.data; // Adjust according to API response structure
          this.updatedProfileData = { ...this.profileData }; // Initialize data for editing
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

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  updateProfile(): void {
    console.log('Updating profile with data:', this.updatedProfileData); // Debug line
    if (this.userId !== null) {
      this.patientService.updateProfile(this.userId, this.updatedProfileData).subscribe({
        next: (response) => {
          if (response.success) {
            this.profileData = { ...this.updatedProfileData };
            this.isEditing = false;
          } else {
            this.errorMessage = response.message || 'Failed to update profile.';
          }
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.errorMessage = 'Failed to update profile. Please try again later.';
        }
      });
    } else {
      this.errorMessage = 'User ID is invalid.';
    }
  }
  
}
