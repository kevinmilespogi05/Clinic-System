import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BillingService } from '../../services/billing.service';

@Component({
  selector: 'app-admin-insurance',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-insurance.component.html',
  styleUrls: ['./admin-insurance.component.css'],
  providers: [BillingService],
})
export class AdminInsuranceComponent implements OnInit {
  claims: any[] = [];

  constructor(private billingService: BillingService) {}

  ngOnInit(): void {
    this.loadClaims();
  }

 // admin-insurance.component.ts (admin)
loadClaims(): void {
  const isAdmin = 1;  // Admin flag
  this.billingService.getInsuranceClaims(0, isAdmin).subscribe((data: any[]) => {  // Passing '0' as userId for admin
    this.claims = data;
  });
}


  updateClaimStatus(claimId: number, status: string): void {
    this.billingService
      .updateInsuranceClaim({ id: claimId, status })
      .subscribe(() => {
        this.loadClaims(); // Refresh the claims list
      });
  }
}
