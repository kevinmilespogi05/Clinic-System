import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-insurance',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css'],
  providers: [PatientService],
})
export class InsuranceComponent implements OnInit {
  claims: any[] = [];
  claimForm: FormGroup;
  currentServiceType: string = '';
  discount: number = 0;

  constructor(private patientService: PatientService, private fb: FormBuilder) {
    this.claimForm = this.fb.group({
      patient_name: [''],
      service_type: [''],
      claim_description: [''],
      discount: [{ value: 0, disabled: true }],
    });
  }

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    const isAdmin = localStorage.getItem('role') === 'admin' ? 1 : 0;

    this.patientService.getInsuranceClaims(userId, isAdmin).subscribe((data: any[]) => {
      this.claims = data;
    });
  }

  // Handle the change in service type selection
  onServiceTypeChange(event: Event): void {
    const serviceType = (event.target as HTMLSelectElement).value;
    this.currentServiceType = serviceType;
    this.setDiscount(serviceType);
    this.initializeForm(serviceType);
  }

  // Set discount based on service type
  setDiscount(serviceType: string): void {
    switch (serviceType) {
      case 'consultation':
        this.discount = 10;
        break;
      case 'surgery':
        this.discount = 20;
        break;
      case 'therapy':
        this.discount = 15;
        break;
      default:
        this.discount = 0;
    }
  }

  // Initialize the form based on the selected service type
  initializeForm(serviceType: string): void {
    switch (serviceType) {
      case 'consultation':
        this.claimForm = this.fb.group({
          patient_name: [''],
          service_type: ['consultation'],
          doctor_name: [''],
          appointment_date: [''],
          reason_for_visit: [''],
          discount: [{ value: 10, disabled: true }],
        });
        break;
      case 'surgery':
        this.claimForm = this.fb.group({
          patient_name: [''],
          service_type: ['surgery'],
          surgery_type: [''],
          surgery_date: [''],
          anesthesia_required: [false],
          surgeon_name: [''],
          discount: [{ value: 20, disabled: true }],
        });
        break;
      case 'therapy':
        this.claimForm = this.fb.group({
          patient_name: [''],
          service_type: ['therapy'],
          therapy_type: [''],
          therapy_sessions: [''],
          therapist_name: [''],
          discount: [{ value: 15, disabled: true }],
        });
        break;
      default:
        this.claimForm.reset();
        break;
    }
  }

  // Create a new claim
  createClaim(): void {
    if (this.claimForm.valid) {
      const claimData = {
        user_id: parseInt(localStorage.getItem('userId') || '0', 10),
        description: `${this.claimForm.value.service_type}: ${this.claimForm.value.claim_description}`,
        discount: this.claimForm.value.discount,
      };
      this.patientService.createInsuranceClaim(claimData).subscribe((response: any) => {
        console.log('New Claim ID:', response.claim_id); // Log the new claim ID
        this.loadClaims(); // Refresh the claims list
        this.claimForm.reset(); // Reset the form
      });
    }
  }
}
