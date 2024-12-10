import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BillingService } from '../../services/billing.service';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css'],
  providers: [BillingService],
})
export class BillingComponent implements OnInit {
  invoices: any[] = [];

  constructor(private billingService: BillingService) {}

  ngOnInit(): void {
    this.billingService.getInvoices().subscribe((data) => {
      this.invoices = data;
    });
  }
}
