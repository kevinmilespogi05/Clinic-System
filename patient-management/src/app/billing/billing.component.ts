import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../services/patient.service';
import { SafePipe } from '../safe.pipe';
import jsPDF from 'jspdf';
import 'jspdf-autotable';  // Import the jsPDF-AutoTable plugin

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
        (data) => {
          console.log('Invoices fetched:', data);
          this.invoices = data;
        },
        (error) => console.error('Error fetching invoices:', error)
      );
    }
  }

  generateInvoice(invoice: any): void {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'normal');
    
    // Adding Company Logo and Contact Info
    const logo = 'path_to_logo.jpg'; // Replace with the actual path to the logo
    doc.addImage(logo, 'JPEG', 10, 10, 30, 30); // Adjust size and position
    doc.setFontSize(12);
    doc.text('Your Company Name', 50, 15);
    doc.text('Address: 123 Street, City, Country', 50, 20);
    doc.text('Phone: +123 456 789', 50, 25);
    doc.text('Email: contact@yourcompany.com', 50, 30);

    doc.setFontSize(16);
    doc.text('Invoice Receipt', 105, 40, { align: 'center' });
    doc.setFontSize(10);

    // Line separator after the header
    doc.setLineWidth(0.5);
    doc.line(10, 35, 200, 35);

    // Invoice Number and Date
    doc.text(`Invoice Number: ${invoice.invoice_id}`, 10, 45);
    doc.text(`Created At: ${new Date(invoice.invoice_date).toLocaleString()}`, 10, 50);

    // User Details
    doc.text('User Details:', 10, 60);
    doc.text(`Name: ${invoice.user.first_name} ${invoice.user.last_name}`, 10, 70);
    doc.text(`Contact: ${invoice.user.contact_number}`, 10, 80);
    doc.text(
      `Billing Address: ${invoice.user.billing_address}, ${invoice.user.city}, ${invoice.user.province}`,
      10,
      90
    );

    // Appointment Details - Table Style
    doc.text('Appointment Details:', 10, 110);
    doc.autoTable({
      startY: 115,
      head: [['Date', 'Time', 'Service', 'Bill Amount']],
      body: [
        [
          invoice.appointment.date,
          invoice.appointment.time,
          invoice.appointment.service,
          `$${invoice.appointment.bill_amount}`,
        ],
      ],
      theme: 'grid',
      margin: { top: 5 },
      styles: {
        cellPadding: 3,
        fontSize: 10,
        halign: 'center',
      },
    });

    // Payment Details - Table Style
  // Corrected Y-position for "Payment Details" text
const paymentDetailsStartY = doc.lastAutoTable.finalY + 10;

// Add "Payment Details" text BEFORE the table
doc.text('Payment Details:', 10, paymentDetailsStartY);

// Payment Details - Table Style
doc.autoTable({
  startY: paymentDetailsStartY + 5,  // Start table slightly below the text
  head: [['Amount', 'Method', 'Payment Status']],
  body: [
    [
      invoice.payment && invoice.payment.amount !== null ? `$${invoice.payment.amount}` : 'N/A',
      invoice.payment && invoice.payment.method ? invoice.payment.method : 'N/A',
      invoice.payment && invoice.payment.status ? invoice.payment.status : 'Pending',
    ],
  ],
  theme: 'grid',
  margin: { top: 5 },
  styles: {
    cellPadding: 3,
    fontSize: 10,
    halign: 'center',
  },
});

    // Footer message
    doc.text('Thank you for your payment!', 10, doc.lastAutoTable.finalY + 20);

    // Line separator before footer
    doc.line(10, doc.lastAutoTable.finalY + 25, 200, doc.lastAutoTable.finalY + 25);

    // Save the PDF
    doc.save(`Invoice_${invoice.invoice_id}.pdf`);
  }

  previewInvoice(invoice: any): void {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'normal');
    
    // Adding Company Logo and Contact Info
    const logo = 'path_to_logo.jpg'; // Replace with the actual path to the logo
    doc.addImage(logo, 'JPEG', 10, 10, 30, 30); // Adjust size and position
    doc.setFontSize(12);
    doc.text('Your Company Name', 50, 15);
    doc.text('Address: 123 Street, City, Country', 50, 20);
    doc.text('Phone: +123 456 789', 50, 25);
    doc.text('Email: contact@yourcompany.com', 50, 30);

    doc.setFontSize(16);
    doc.text('Invoice Preview', 105, 40, { align: 'center' });
    doc.setFontSize(10);

    // Line separator after the header
    doc.setLineWidth(0.5);
    doc.line(10, 35, 200, 35);

    // Invoice Number and Date
    doc.text(`Invoice Number: ${invoice.invoice_id}`, 10, 45);
    doc.text(`Created At: ${new Date(invoice.invoice_date).toLocaleString()}`, 10, 50);

    // User Details
    doc.text('User Details:', 10, 60);
    doc.text(`Name: ${invoice.user.first_name} ${invoice.user.last_name}`, 10, 70);
    doc.text(`Contact: ${invoice.user.contact_number}`, 10, 80);
    doc.text(
      `Billing Address: ${invoice.user.billing_address}, ${invoice.user.city}, ${invoice.user.province}`,
      10,
      90
    );

    // Appointment Details - Table Style
    doc.text('Appointment Details:', 10, 110);
    doc.autoTable({
      startY: 115,
      head: [['Date', 'Time', 'Service', 'Bill Amount']],
      body: [
        [
          invoice.appointment.date,
          invoice.appointment.time,
          invoice.appointment.service,
          `$${invoice.appointment.bill_amount}`,
        ],
      ],
      theme: 'grid',
      margin: { top: 5 },
      styles: {
        cellPadding: 3,
        fontSize: 10,
        halign: 'center',
      },
    });

    // Payment Details - Table Style
   // Corrected Y-position for "Payment Details" text
const paymentDetailsStartY = doc.lastAutoTable.finalY + 10;

// Add "Payment Details" text BEFORE the table
doc.text('Payment Details:', 10, paymentDetailsStartY);

// Payment Details - Table Style
doc.autoTable({
  startY: paymentDetailsStartY + 5,  // Start table slightly below the text
  head: [['Amount', 'Method', 'Payment Status']],
  body: [
    [
      invoice.payment && invoice.payment.amount !== null ? `$${invoice.payment.amount}` : 'N/A',
      invoice.payment && invoice.payment.method ? invoice.payment.method : 'N/A',
      invoice.payment && invoice.payment.status ? invoice.payment.status : 'Pending',
    ],
  ],
  theme: 'grid',
  margin: { top: 5 },
  styles: {
    cellPadding: 3,
    fontSize: 10,
    halign: 'center',
  },
});


    // Footer message
    doc.text('Thank you for your payment!', 10, doc.lastAutoTable.finalY + 20);

    // Create a blob URL and open it in a new tab for preview
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
}
