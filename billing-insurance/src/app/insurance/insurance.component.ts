import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-insurance',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule, HttpClientModule],
  templateUrl: './insurance.component.html',
  styleUrl: './insurance.component.css'
})
export class InsuranceComponent implements OnInit {
  claims: any[] = [];

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadClaims();
  }

  // Load all insurance claims for admin
  loadClaims(): void {
    const isAdmin = 1;  // Admin flag
    this.patientService.getInsuranceClaims(0, isAdmin).subscribe((data: any[]) => {  // Passing '0' as userId for admin
      this.claims = data;
    });
  }

  // Update insurance claim status (approve or reject)
  updateClaimStatus(claimId: number, status: string): void {
    this.patientService.updateInsuranceClaim({ id: claimId, status }).subscribe(() => {
      this.loadClaims(); // Refresh the claims list
    });
  }
}
