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
  invoices: any[] = []; // List of invoices

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.fetchInvoices();
  }

  fetchInvoices(): void {
    this.patientService.getInvoices().subscribe(
      (data) => {
        this.invoices = data;
        console.log('Fetched invoices:', this.invoices);  // Log the invoices to check the structure
      },
      (error) => {
        console.error('Error fetching invoices:', error);
      }
    );
  }

  generateInvoice(invoice: any): void {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Invoice Receipt', 10, 10);
    doc.text(`Invoice Number: ${invoice.id}`, 10, 20);  // Use 'id' instead of 'invoice_number'
    doc.text(`Status: ${invoice.status}`, 10, 30);
    doc.text('Thank you for your payment!', 10, 50);
  
    // Prepare the description
    const description = "Invoice Generated"; // Example description
  
    // Log the data being sent to the server
    console.log('Sending data to update invoice description:', {
      invoice_id: invoice.id,  // Use 'id' here
      description: description
    });
  
    // Call service to update the invoice description
    if (invoice.id) {  // Check if 'id' exists
      this.patientService.updateInvoiceDescription(invoice.id, description).subscribe(
        (response) => {
          console.log('Invoice description updated', response);
        },
        (error) => {
          console.error('Error updating description:', error);
        }
      );
    } else {
      console.error('Invoice ID is missing!');
    }
  
    // Save the PDF
    doc.save(`Invoice_${invoice.id}.pdf`);  // Use 'id' here
  }  
}
