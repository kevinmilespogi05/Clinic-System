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
    doc.text(`Invoice Number: ${invoice.invoice_id}`, 10, 20);
    doc.text(`Status: ${invoice.invoice_status}`, 10, 30);
    doc.text(`Description: ${invoice.description || 'N/A'}`, 10, 40);
    doc.text(`Created At: ${new Date(invoice.invoice_date).toLocaleString()}`, 10, 50);

    doc.text('User Details:', 10, 70);
    doc.text(`Name: ${invoice.user.first_name} ${invoice.user.last_name}`, 10, 80);
    doc.text(`Contact: ${invoice.user.contact_number}`, 10, 90);
    doc.text(`Billing Address: ${invoice.user.billing_address}, ${invoice.user.city}, ${invoice.user.province}`, 10, 100);

    doc.text('Appointment Details:', 10, 120);
    doc.text(`Date: ${invoice.appointment.date}`, 10, 130);
    doc.text(`Time: ${invoice.appointment.time}`, 10, 140);
    doc.text(`Service: ${invoice.appointment.service}`, 10, 150);
    doc.text(`Bill Amount: ${invoice.appointment.bill_amount}`, 10, 160);

    doc.text('Payment Details:', 10, 180);
    doc.text(`Amount: ${invoice.payment.amount}`, 10, 190);
    doc.text(`Method: ${invoice.payment.method}`, 10, 200);
    doc.text(`Status: ${invoice.payment.status}`, 10, 210);

    doc.text('Thank you for your payment!', 10, 230);

    // Save the PDF
    doc.save(`Invoice_${invoice.invoice_id}.pdf`);
  }

  previewInvoice(invoice: any): void {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Invoice Receipt', 10, 10);
    doc.text(`Invoice Number: ${invoice.invoice_id}`, 10, 20);
    doc.text(`Status: ${invoice.invoice_status}`, 10, 30);
    doc.text(`Description: ${invoice.description || 'N/A'}`, 10, 40);
    doc.text(`Created At: ${new Date(invoice.invoice_date).toLocaleString()}`, 10, 50);
  
    doc.text('User Details:', 10, 70);
    doc.text(`Name: ${invoice.user.first_name} ${invoice.user.last_name}`, 10, 80);
    doc.text(`Contact: ${invoice.user.contact_number}`, 10, 90);
    doc.text(`Billing Address: ${invoice.user.billing_address}, ${invoice.user.city}, ${invoice.user.province}`, 10, 100);
  
    doc.text('Appointment Details:', 10, 120);
    doc.text(`Date: ${invoice.appointment.date}`, 10, 130);
    doc.text(`Time: ${invoice.appointment.time}`, 10, 140);
    doc.text(`Service: ${invoice.appointment.service}`, 10, 150);
    doc.text(`Bill Amount: ${invoice.appointment.bill_amount}`, 10, 160);
  
    doc.text('Payment Details:', 10, 180);
    doc.text(`Amount: ${invoice.payment.amount}`, 10, 190);
    doc.text(`Method: ${invoice.payment.method}`, 10, 200);
    doc.text(`Status: ${invoice.payment.status}`, 10, 210);
  
    doc.text('Thank you for your payment!', 10, 230);
  
    // Create a blob URL and open it in a new tab for preview
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
  
}
