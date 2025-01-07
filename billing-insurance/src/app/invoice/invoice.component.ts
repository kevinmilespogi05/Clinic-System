import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PatientService } from '../services/patient.service';
import Swal from 'sweetalert2';
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
    this.patientService.getInvoices().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.invoices = data;
        } else {
          this.invoices = [];
          console.error('Unexpected response format:', data);
        }
      },
      error: (err) => {
        console.error('Error loading invoices:', err);
        this.invoices = []; // Set to an empty array on error
      },
    });
  }
  
  

  createInvoice(): void {
    if (this.invoiceForm.valid) {
      const username = this.invoiceForm.value.patient_name;
      const serviceType = this.invoiceForm.value.service_type;
      const claimDescription = this.invoiceForm.value.claim_description;
  
      // Show a confirmation alert before proceeding
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to create this invoice?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, create it!',
        cancelButtonText: 'No, cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceed with creating the invoice
          this.patientService.getUserByUsername(username).subscribe((userData: any) => {
            if (userData && userData.id) {
              const invoiceData = {
                user_id: userData.id,
                description: `${serviceType}: ${claimDescription}`,
                status: 'unpaid',
              };
  
              this.patientService.createInvoice(invoiceData).subscribe(() => {
                this.loadInvoices(); // Refresh the invoices list
                this.invoiceForm.reset(); // Reset the form
  
                Swal.fire('Created!', 'The invoice has been created.', 'success');
              });
            } else {
              Swal.fire('Error', 'User not found!', 'error');
            }
          });
        }
      });
    } else {
      // Show a validation error alert
      Swal.fire({
        title: 'Invalid Input',
        text: 'Please fill out all required fields correctly.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }
  
  

  updateInvoiceStatus(invoiceId: number, status: string): void {
    this.patientService.updateInvoiceStatus(invoiceId, status).subscribe(() => {
      this.loadInvoices(); // Refresh the invoices list
    });
  }
}
