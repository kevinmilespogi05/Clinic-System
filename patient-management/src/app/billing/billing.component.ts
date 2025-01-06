import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../services/patient.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css'],
})
export class BillingComponent implements OnInit {
  invoices: any[] = []; // Initialize invoices array
  userId: number = 0; // User ID

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    // Retrieve logged-in user's ID from local storage or a user service
    this.userId = this.getLoggedInUserId();
    this.fetchInvoices();
  }

  getLoggedInUserId(): number {
    // Retrieve the user ID from localStorage (or replace with your user service)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || 0; // Return user ID or 0 if not found
  }

  fetchInvoices(): void {
    if (this.userId) {
      // Fetch invoices using PatientService
      this.patientService.getInvoicesByUserId(this.userId).subscribe(
        (data) => {
          this.invoices = data;
          console.log('Fetched invoices:', this.invoices);
        },
        (error) => {
          console.error('Error fetching invoices:', error);
        }
      );
    } else {
      console.error('No user ID found');
    }
  }

  generateInvoice(invoice: any): void {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Invoice Receipt', 10, 10);
    doc.text(`Invoice Number: ${invoice.id}`, 10, 20);
    doc.text(`Status: ${invoice.status}`, 10, 30);
    doc.text(`Description: ${invoice.description || 'N/A'}`, 10, 40);
    doc.text(`Created At: ${new Date(invoice.created_at).toLocaleString()}`, 10, 50);
    doc.text('Thank you for your payment!', 10, 70);

    // Save the PDF
    doc.save(`Invoice_${invoice.id}.pdf`);
  }
}
