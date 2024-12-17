import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';
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
  userId: number | null = null;
  profileData: any = null;
  claims: any[] = []; // Holds insurance claims data
  errorMessage: string | null = null;
  isEditing: boolean = false;
  updatedProfileData: any = {}; // For holding data during editing

  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    if (this.userId) {
      this.fetchProfileData(this.userId);
      this.fetchInsuranceClaims(this.userId); // Fetch insurance claims
    } else {
      this.errorMessage = 'User not logged in';
      this.router.navigate(['/login']);
    }
  }

  fetchProfileData(userId: number): void {
    this.patientService.getProfile(userId).subscribe({
      next: (response) => {
        if (response.success) {
          this.profileData = response.data;
          console.log('Profile Data:', this.profileData); // Debugging
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

  fetchInsuranceClaims(userId: number): void {
    this.patientService.getInsuranceClaims(userId).subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.claims = response;
        } else {
          this.claims = [];
        }
      },
      error: (error) => {
        console.error('Error fetching insurance claims:', error);
        this.errorMessage = 'Failed to fetch insurance claims. Please try again later.';
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reset to the profileData when exiting edit mode
      this.updatedProfileData = { ...this.profileData };
    }
  }

  updateProfile(): void {
    console.log('Updating profile with data:', this.updatedProfileData);
    if (this.userId !== null) {
      this.patientService.updateProfile(this.userId, this.updatedProfileData).subscribe({
        next: (response) => {
          if (response.success) {
            this.profileData = { ...this.updatedProfileData }; // Update profileData after success
            this.isEditing = false; // Exit edit mode
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
