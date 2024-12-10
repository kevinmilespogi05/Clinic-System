import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class BillingComponent implements OnInit {
  patients: any[] = []; // List of patients
  appointments: any[] = []; // List of patient appointments
  newInvoice = { patientId: '', appointmentId: '', amount: 0 };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPatients();
    this.loadAppointments();
  }

  // Load patients data from the API
  loadPatients() {
    this.http
      .get('http://localhost/clinicapi/patients.php')
      .subscribe((data: any) => {
        this.patients = data;
      });
  }

  // Load appointments data from the API
  loadAppointments() {
    this.http
      .get('http://localhost/clinicapi/appointments.php')
      .subscribe((data: any) => {
        this.appointments = data;
      });
  }

  // Create a new invoice
  createInvoice() {
    this.http
      .post('http://localhost/clinicapi/invoice.php', this.newInvoice)
      .subscribe(() => {
        alert('Invoice created successfully');
      });
  }
}
