import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../services/patient.service';
import { SafePipe } from '../safe.pipe';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
    const logo = 'path_to_logo.jpg';
    doc.addImage(logo, 'JPEG', 10, 10, 30, 30);
    doc.setFontSize(12);
    doc.text('Your Company Name', 50, 15);
    doc.text('Address: 123 Street, City, Country', 50, 20);
    doc.text('Phone: +123 456 789', 50, 25);
    doc.text('Email: contact@yourcompany.com', 50, 30);

    doc.setFontSize(16);
    doc.text('Invoice Receipt', 105, 40, { align: 'center' });
    doc.setFontSize(10);
    doc.setLineWidth(0.5);
    doc.line(10, 35, 200, 35);
    doc.text(`Invoice Number: ${invoice.invoice_id}`, 10, 45);
    doc.text(`Created At: ${new Date(invoice.invoice_date).toLocaleString()}`, 10, 50);

    doc.text('User Details:', 10, 60);
    doc.text(`Name: ${invoice.user.first_name} ${invoice.user.last_name}`, 10, 70);
    doc.text(`Contact: ${invoice.user.contact_number}`, 10, 80);
    doc.text(
      `Billing Address: ${invoice.user.billing_address}, ${invoice.user.city}, ${invoice.user.province}`,
      10,
      90
    );

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

    const paymentDetailsStartY = doc.lastAutoTable.finalY + 10;
    doc.text('Payment Details:', 10, paymentDetailsStartY);

    doc.autoTable({
      startY: paymentDetailsStartY + 5,
      head: [['Amount', 'Method', 'Payment Status']],
      body: [
        [
          `$${invoice.appointment.bill_amount}`,
          'Credit Card',
          'Paid',
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

    doc.text('Thank you for your payment!', 10, doc.lastAutoTable.finalY + 20);
    doc.line(10, doc.lastAutoTable.finalY + 25, 200, doc.lastAutoTable.finalY + 25);
    doc.save(`Invoice_${invoice.invoice_id}.pdf`);
  }

  previewInvoice(invoice: any): void {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'normal');
    
    doc.setFontSize(40); // Larger font size for "ClinicPoint"
    doc.text('ClinicPoint', 14, 20);
    
    doc.setFontSize(16);
    doc.text('Invoice Preview', 105, 40, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.line(10, 45, 200, 45);
    
    doc.setFontSize(10);
    doc.text(`Invoice Number: ${invoice.invoice_id}`, 10, 55);
    doc.text(`Created At: ${new Date(invoice.invoice_date).toLocaleString()}`, 10, 60);
    
    doc.text('User Details:', 10, 75);
    doc.text(`Name: ${invoice.user.first_name} ${invoice.user.last_name}`, 10, 85);
    doc.text(`Contact: ${invoice.user.contact_number}`, 10, 95);
    doc.text(
      `Billing Address: ${invoice.user.billing_address}, ${invoice.user.city}, ${invoice.user.province}`,
      10,
      105
    );
  
    doc.text('Appointment Details:', 10, 120);
    doc.autoTable({
      startY: 125,
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
  
    const paymentDetailsStartY = doc.lastAutoTable.finalY + 10;
    doc.text('Payment Details:', 10, paymentDetailsStartY);
  
    doc.autoTable({
      startY: paymentDetailsStartY + 5,
      head: [['Amount', 'Method', 'Payment Status']],
      body: [
        [
          `$${invoice.appointment.bill_amount}`,
          'Credit Card',
          'Paid',
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
  
    doc.setFontSize(10);
    doc.text('Thank you for your payment!', 10, doc.lastAutoTable.finalY + 20);
    
    doc.setLineWidth(0.5);
    doc.line(10, doc.lastAutoTable.finalY + 25, 200, doc.lastAutoTable.finalY + 25);
  
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
}  
