import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule], // Include CommonModule and FormsModule in the imports
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  appointmentId: number | null = null;
  appointment: any = null; // Store appointment data
  totalAmount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService // Inject the service
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.appointmentId = +params['appointmentId'] || null;
      console.log('Appointment ID:', this.appointmentId); // Add this log
      if (this.appointmentId) {
        this.fetchAppointmentDetails();
      }
    });
  }
  

  fetchAppointmentDetails(): void {
    this.route.queryParams.subscribe((params) => {
      this.appointmentId = +params['appointmentId'] || null;
      const userId = 3; // You should replace this with the actual user ID, which could come from a service or auth system
      const role = 'user'; // Similarly, determine the role dynamically
  
      console.log('Appointment ID:', this.appointmentId); // Add this log
      if (this.appointmentId) {
        this.patientService.getAppointments(userId, role).subscribe(
          (response: any) => {
            console.log('API Response:', response); // Add this log
            if (response.appointments && response.appointments.length) {
              this.appointment = response.appointments.find(
                (appt: any) => appt.id === this.appointmentId
              );
              if (this.appointment) {
                this.totalAmount = this.appointment.bill_amount;
              }
            }
          },
          (error) => {
            console.error('Error fetching appointment details', error);
          }
        );
      }
    });
  }
  
}
