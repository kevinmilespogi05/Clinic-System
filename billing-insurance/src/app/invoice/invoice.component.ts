import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PatientService } from '../services/patient.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
  providers: [PatientService],
})
export class InvoiceComponent implements OnInit {
  invoices: any[] = [];
  invoiceForm: FormGroup;

  constructor(private patientService: PatientService, private fb: FormBuilder) {
    this.invoiceForm = this.fb.group({
      patient_name: [''],
      service_type: [''],
      claim_description: [''],
    });
  }

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.patientService.getInvoices().subscribe((data: any[]) => {
      this.invoices = data;
    });
  }

  createInvoice(): void {
    if (this.invoiceForm.valid) {
      const invoiceData = {
        user_id: 1, // Replace with actual user ID
        description: `${this.invoiceForm.value.service_type}: ${this.invoiceForm.value.claim_description}`,
        status: 'unpaid', // Set the default status, can be changed later
      };
      this.patientService.createInvoice(invoiceData).subscribe(() => {
        this.loadInvoices(); // Refresh the invoices list
        this.invoiceForm.reset(); // Reset the form
      });
    }
  }

  updateInvoiceStatus(invoiceId: number, status: string): void {
    this.patientService.updateInvoiceStatus(invoiceId, status).subscribe(() => {
      this.loadInvoices(); // Refresh the invoices list
    });
  }
}
