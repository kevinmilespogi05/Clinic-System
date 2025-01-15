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
    let y = 20; // Starting Y position for content
  
    // Helper function to add a page header
    const addHeader = () => {
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Clinic Patient Report', pageWidth / 2, 10, { align: 'center' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 15);
      doc.line(10, 18, pageWidth - 10, 18); // Horizontal line
    };
  
    // Helper function to add a page footer
    const addFooter = (pageNum: number) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Page ${pageNum}`, pageWidth - 20, pageHeight - 10);
    };
  
    // Helper function to check for page overflow
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
    doc.setFillColor(0, 123, 255); // Clinic-themed color (blue)
    doc.rect(10, y - 5, pageWidth - 20, 8, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Name', 10, y);
    doc.text('Username', 50, y);
    doc.text('Contact', 90, y);
    doc.text('DOB', 130, y);
    doc.text('Role', 170, y);
    y += 8;
  
    // Table Content for Patients
    doc.setFont('helvetica', 'normal');
    this.patients.forEach((patient) => {
      checkPageOverflow(10);
      doc.text(`${patient.first_name || 'N/A'} ${patient.last_name || 'N/A'}`, 10, y);
      doc.text(`${patient.username || 'N/A'}`, 50, y);
      doc.text(`${patient.contact_number || 'N/A'}`, 90, y);
      doc.text(`${patient.date_of_birth || 'N/A'}`, 130, y);
      doc.text(`${patient.role || 'N/A'}`, 170, y);
      y += 8;
  
      // Additional user data from the 'users' table
      doc.setFontSize(10);
      doc.text(`Cardholder: ${patient.card_first_name} ${patient.card_last_name}`, 10, y);
      y += 8;
      doc.text(`Card Number: ${patient.card_number}`, 10, y);
      y += 8;
      doc.text(`Expiry Date: ${patient.card_expiry}`, 10, y);
      y += 8;
      doc.text(`Billing Address: ${patient.billing_address}`, 10, y);
      y += 8;
      doc.text(`City: ${patient.city}`, 10, y);
      y += 8;
      doc.text(`Province: ${patient.province}`, 10, y);
      y += 8;
      doc.text(`Postal Code: ${patient.billing_postal_code}`, 10, y);
      y += 8;
      doc.text(`Medical History: ${patient.medical_history || 'N/A'}`, 10, y);
      y += 8;
    });
  
    // Section: Appointments
    checkPageOverflow(20);
    doc.line(10, y, pageWidth - 10, y);
    y += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Appointments Information', 10, y);
    y += 10;
  
    // Table Header for Appointments
    doc.setFillColor(0, 123, 255);
    doc.rect(10, y - 5, pageWidth - 20, 8, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Patient', 10, y);
    doc.text('Date', 70, y);
    doc.text('Time', 120, y);
    doc.text('Status', 170, y);
    y += 8;
  
    // Table Content for Appointments
    doc.setFont('helvetica', 'normal');
    this.appointments.forEach((appt) => {
      checkPageOverflow(10);
      doc.text(`${appt.first_name || 'N/A'} ${appt.last_name || 'N/A'}`, 10, y);
      doc.text(`${appt.date || 'N/A'}`, 70, y);
      doc.text(`${appt.time || 'N/A'}`, 120, y);
      doc.text(`${appt.status || 'N/A'}`, 170, y);
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
  
    // Finalize the PDF
    addFooter(pageNum);
    const fileName = `Clinic_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
  
    // Notify the user
    Swal.fire('Report Generated', 'Your clinic report has been successfully generated!', 'success');
  }  
}  