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
  invoices: any[] = []; // Holds invoice data
  errorMessage: string | null = null;
  isEditing: boolean = false;
  updatedProfileData: any = {}; // For holding data during editing

  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    if (this.userId) {
      this.fetchProfileData(this.userId);
      this.fetchInsuranceClaims(this.userId); // Fetch insurance claims
      this.fetchInvoices(this.userId); // Fetch invoices
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
    this.patientService.getInsuranceClaimsUser(userId).subscribe({
      next: (response) => {
        if (response.success) {
          this.claims = response.claims;
        } else {
          console.error('Failed to fetch insurance claims');
        }
      },
      error: (error) => {
        console.error('Error fetching insurance claims:', error);
      }
    });
  }

  fetchInvoices(userId: number): void {
    this.patientService.getInvoicesUser(userId).subscribe({
      next: (response) => {
        if (response) {
          this.invoices = response;
        } else {
          console.error('Failed to fetch invoices');
        }
      },
      error: (error) => {
        console.error('Error fetching invoices:', error);
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.updatedProfileData = { ...this.profileData };
    }
  }

  updateProfile(): void {
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
