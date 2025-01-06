import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../services/patient.service';
import { SafePipe } from '../safe.pipe';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, SafePipe],
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css'],
})
export class BillingComponent implements OnInit {
  invoices: any[] = [];
  userId: number = 0;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.userId = this.getLoggedInUserId();
    if (this.userId) {
      this.fetchInvoices();
    }
  }

  getLoggedInUserId(): number {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || 0;
  }

  fetchInvoices(): void {
    if (this.userId) {
      this.patientService.getInvoicesByUserId(this.userId).subscribe(
        (data) => (this.invoices = data),
        (error) => console.error('Error fetching invoices:', error)
      );
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

  previewInvoice(invoice: any): void {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Invoice Receipt', 10, 10);
    doc.text(`Invoice Number: ${invoice.id}`, 10, 20);
    doc.text(`Status: ${invoice.status}`, 10, 30);
    doc.text(`Description: ${invoice.description || 'N/A'}`, 10, 40);
    doc.text(`Created At: ${new Date(invoice.created_at).toLocaleString()}`, 10, 50);
    doc.text('Thank you for your payment!', 10, 70);

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
}
