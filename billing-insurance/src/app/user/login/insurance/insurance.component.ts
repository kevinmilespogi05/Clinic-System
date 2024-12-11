import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BillingService } from '../../../services/billing.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-insurance',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css'],
  providers: [BillingService],
})
export class InsuranceComponent implements OnInit {
  claims: any[] = [];
  claimForm: FormGroup;

  constructor(private billingService: BillingService, private fb: FormBuilder) {
    this.claimForm = this.fb.group({
      patient_name: [''],
      service_type: [''],
      claim_description: [''],
    });
  }

  ngOnInit(): void {
    this.loadClaims();
  }

 // insurance.component.ts (user)
loadClaims(): void {
  const userId = parseInt(localStorage.getItem('userId') || '0', 10);
  const isAdmin = localStorage.getItem('role') === 'admin' ? 1 : 0;  // Assuming 'role' is stored as 'admin' or 'user'
  
  this.billingService.getInsuranceClaims(userId, isAdmin).subscribe((data: any[]) => {
    this.claims = data;
  });
}


  createClaim(): void {
    if (this.claimForm.valid) {
      const claimData = {
        user_id: parseInt(localStorage.getItem('userId') || '0', 10),
        description: `${this.claimForm.value.service_type}: ${this.claimForm.value.claim_description}`,
      };
      this.billingService.createInsuranceClaim(claimData).subscribe(() => {
        this.loadClaims(); // Refresh the claims list
        this.claimForm.reset(); // Reset the form
      });
    }
  }
}
