import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../services/patient.service';
import { Chart } from 'chart.js/auto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-analytics',
  standalone: true,
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
  imports: [CommonModule],
})
export class AnalyticsComponent implements OnInit {
  patients: any[] = [];
  combinedStats: any;
  transactions: any[] = [];
  appointments: any[] = [];
  pendingAppointments: any[] = [];
  invoices: any[] = [];

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.fetchCombinedStats();
    this.fetchPatients();
    this.fetchTransactions();
    this.loadAppointments();
    this.fetchInvoices();
  }

  fetchCombinedStats(): void {
    this.patientService.getCombinedStats().subscribe(
      (response: any) => {
        if (response) {
          this.combinedStats = response;
        } else {
          console.error('Failed to fetch stats:', response.message);
        }
      },
      (error: any) => {
        console.error('Error fetching stats:', error);
      }
    );
  }

  fetchPatients(): void {
    this.patientService.getPatients().subscribe(
      (response: any) => {
        if (response && response.success) {
          // Filter patients where role is 'users'
          this.patients = response.data.filter((patient: any) => patient.role === 'user');
        } else {
          console.error('Failed to fetch patients:', response.message);
        }
      },
      (error: any) => {
        console.error('Error fetching patients:', error);
      }
    );
  }

  fetchTransactions(): void {
    this.patientService.getTransactions().subscribe(
      (response: any) => {
        if (response) {
          this.transactions = response;
        } else {
          console.error('Failed to fetch transactions:', response.message);
        }
      },
      (error: any) => {
        console.error('Error fetching transactions:', error);
      }
    );
  }

  fetchInvoices(): void {
    this.patientService.getInvoices().subscribe(
      (response: any) => {
        if (response) {
          this.invoices = response;
        } else {
          console.error('Failed to fetch invoices:', response.message);
        }
      },
      (error: any) => {
        console.error('Error fetching invoices:', error);
      }
    );
  }

  loadAppointments(): void {
    this.patientService.getAppointments().subscribe(
      (data: any) => {
        if (data && data.appointments && Array.isArray(data.appointments)) {
          this.pendingAppointments = data.appointments
            .filter((appt: any) => appt.status === 'pending')
            .map((appointment: any) => ({
              ...appointment,
              patient_name: appointment.username || 'Unknown Patient',
            }));

          this.appointments = data.appointments
            .filter((appt: any) => appt.status !== 'pending')
            .map((appointment: any) => ({
              ...appointment,
              patient_name: appointment.username || 'Unknown Patient',
            }));
        } else {
          Swal.fire('Error', 'Invalid data format', 'error');
        }
      },
      (error) => {
        console.error('Error loading appointments:', error);
        Swal.fire('Error', 'Unable to load appointments.', 'error');
      }
    );
  }
}
