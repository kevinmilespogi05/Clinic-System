import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';  // Import jsPDF library
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  patients: any[] = [];
  appointments: any[] = [];
  invoices: any[] = [];
  insuranceClaims: any[] = [];
  loading: boolean = false;
  

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    // Fetch data when the component is initialized
    this.fetchReportData();
  }

  fetchReportData(): void {
    this.loading = true;

    // Fetch all report data from the backend
    this.patientService.getUsers().subscribe(
      (data: any) => {
        this.patients = data.users;
      },
      (error) => {
        Swal.fire('Error', 'Failed to fetch patients data.', 'error');
      }
    );

    this.patientService.getAppointmentsReport().subscribe(
      (data: any) => {
        this.appointments = data.appointments;
      },
      (error) => {
        Swal.fire('Error', 'Failed to fetch appointments data.', 'error');
      }
    );

    this.patientService.getInvoicesReport().subscribe(
      (data: any) => {
        this.invoices = data.invoices;
      },
      (error) => {
        Swal.fire('Error', 'Failed to fetch invoices data.', 'error');
      }
    );

    this.patientService.getInsuranceClaimsReport().subscribe(
      (data: any) => {
        this.insuranceClaims = data.insuranceClaims;
      },
      (error) => {
        Swal.fire('Error', 'Failed to fetch insurance claims data.', 'error');
      }
    );

    // Disable the button while loading
    this.loading = false;
  }

  generateReport(): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let y = 20;
  
    const addHeader = () => {
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Clinic Patient Report', pageWidth / 2, 10, { align: 'center' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 15);
      doc.line(10, 18, pageWidth - 10, 18);
    };
  
    const addFooter = (pageNum: number) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Page ${pageNum}`, pageWidth - 20, pageHeight - 10);
    };
  
    const checkPageOverflow = (increment: number) => {
      if (y + increment > pageHeight - 20) {
        addFooter(pageNum++);
        doc.addPage();
        y = 20;
        addHeader();
      }
    };
  
    let pageNum = 1;
    addHeader();
  
    // Section: Patients
    checkPageOverflow(20);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Patients Information', 10, y);
    y += 10;
  
    // Table Header for Patients
    doc.setFillColor(0, 123, 255); // Blue Header
    doc.setTextColor(255, 255, 255); // White Text
    doc.rect(10, y - 5, pageWidth - 20, 8, 'F');
    doc.setFontSize(12);
    doc.text('Name', 12, y);
    doc.text('Username', 52, y);
    doc.text('Contact', 92, y);
    doc.text('DOB', 132, y);
    doc.text('Role', 172, y);
    y += 8;
  
    // Table Content for Patients with Highlighted Data
    this.patients.forEach((patient) => {
      checkPageOverflow(15);
  
      // Highlight the main data row
      doc.setFillColor(220, 230, 241); // Light Blue Background
      doc.rect(10, y - 5, pageWidth - 20, 8, 'F');
  
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0); // Black Text
      doc.text(`${patient.first_name || 'N/A'} ${patient.last_name || 'N/A'}`, 12, y);
      doc.text(`${patient.username || 'N/A'}`, 52, y);
      doc.text(`${patient.contact_number || 'N/A'}`, 92, y);
      doc.text(`${patient.date_of_birth || 'N/A'}`, 132, y);
      doc.text(`${patient.role || 'N/A'}`, 172, y);
      y += 8;
  
      // Additional user data (indented, no highlight)
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Cardholder: ${patient.card_first_name || 'N/A'} ${patient.card_last_name || 'N/A'}`, 15, y);
      y += 6;
  
      const wrappedAddress = doc.splitTextToSize(
        `Billing Address: ${patient.billing_address || 'N/A'}`,
        pageWidth - 25
      );
      doc.text(wrappedAddress, 15, y);
      y += wrappedAddress.length * 6;
  
      doc.text(`Card Number: ${patient.card_number || 'N/A'}`, 15, y);
      y += 6;
      doc.text(`Expiry Date: ${patient.card_expiry || 'N/A'}`, 15, y);
      y += 6;
      doc.text(`City: ${patient.city || 'N/A'}`, 15, y);
      y += 6;
      doc.text(`Province: ${patient.province || 'N/A'}`, 15, y);
      y += 6;
      doc.text(`Postal Code: ${patient.billing_postal_code || 'N/A'}`, 15, y);
      y += 6;
      doc.text(`Medical History: ${patient.medical_history || 'N/A'}`, 15, y);
      y += 10; // Extra spacing between entries
    });
  
    // Section: Appointments
    checkPageOverflow(20);
    doc.line(10, y, pageWidth - 10, y);
    y += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Appointments Information', 10, y);
    y += 10;
  
    // Table Header for Appointments (Highlighted)
    doc.setFillColor(0, 102, 204);
    doc.setTextColor(255, 255, 255);
    doc.rect(10, y - 5, pageWidth - 20, 10, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Patient', 12, y);
    doc.text('Date', 72, y);
    doc.text('Time', 122, y);
    doc.text('Status', 172, y);
    y += 10;
  
    // Reset text color for content
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
  
    // Table Content for Appointments
    this.appointments.forEach((appt) => {
      checkPageOverflow(10);
      doc.text(`${appt.first_name || 'N/A'} ${appt.last_name || 'N/A'}`, 12, y);
      doc.text(`${appt.date || 'N/A'}`, 72, y);
      doc.text(`${appt.time || 'N/A'}`, 122, y);
      doc.text(`${appt.status || 'N/A'}`, 172, y);
      y += 8;
    });

    // Section: Invoices
    checkPageOverflow(20);
    doc.line(10, y, pageWidth - 10, y);
    y += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Invoices Information', 10, y);
    y += 10;
  
    // Table Header for Invoices
    doc.setFillColor(0, 123, 255);
    doc.rect(10, y - 5, pageWidth - 20, 8, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice ID', 10, y);
    doc.text('User ID', 70, y);
    doc.text('Description', 120, y);
    doc.text('Amount', 170, y);
    y += 8;
  
    // Table Content for Invoices
    doc.setFont('helvetica', 'normal');
    this.invoices.forEach((invoice) => {
      checkPageOverflow(10);
      doc.text(`${invoice.id || 'N/A'}`, 10, y);
      doc.text(`${invoice.user_id || 'N/A'}`, 70, y);
      doc.text(`${invoice.description || 'N/A'}`, 120, y);
      doc.text(`${invoice.discounted_amount || 'N/A'}`, 170, y);
      y += 8;
    });

    // ==========================
  // 📄 Insurance Claims Section
  // ==========================
  checkPageOverflow(20);
  doc.line(10, y, pageWidth - 10, y);
  y += 10;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Insurance Claims', 10, y);
  y += 10;

  // Table Header for Insurance Claims
  doc.setFillColor(0, 153, 76); // Green Header
  doc.setTextColor(255, 255, 255); // White Text
  doc.rect(10, y - 5, pageWidth - 20, 8, 'F');
  doc.setFontSize(11);
  doc.text('Claim ID', 12, y);
  doc.text('User ID', 30, y);
  doc.text('Service', 50, y);
  doc.text('Status', 80, y);
  doc.text('Payment', 110, y);
  doc.text('Amount', 140, y);
  doc.text('Description', 170, y);
  y += 8;

  // Table Content for Insurance Claims
  doc.setTextColor(0, 0, 0); // Reset text color
  this.insuranceClaims.forEach((claim) => {
    checkPageOverflow(10);

    // Highlight the data row
    doc.setFillColor(220, 241, 220); // Light Green Background
    doc.rect(10, y - 5, pageWidth - 20, 8, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${claim.id || 'N/A'}`, 12, y);
    doc.text(`${claim.user_id || 'N/A'}`, 30, y);
    doc.text(`${claim.service || 'N/A'}`, 50, y);
    doc.text(`${claim.status || 'N/A'}`, 80, y);
    doc.text(`${claim.payment_status || 'N/A'}`, 110, y);
    doc.text(`${claim.discounted_amount || '0.00'}`, 140, y);

    // Wrap the description text
    const wrappedDescription = doc.splitTextToSize(`${claim.description || 'N/A'}`, 30);
    doc.text(wrappedDescription, 170, y);
    
    // Adjust row height based on description length
    y += (wrappedDescription.length * 6) > 8 ? (wrappedDescription.length * 6) : 8;
  });
  
    // Finalize the PDF
    addFooter(pageNum);
    const fileName = `Clinic_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
  
    // Notify the user
    Swal.fire('Report Generated', 'Your clinic report has been successfully generated!', 'success');
  }  
}  