import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [DatePipe], // Provide DatePipe here
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  appointments: any[] = [];

  constructor(private patientService: PatientService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.patientService.getAppointments(Number(userId)).subscribe(
        (data) => {
          this.appointments = data.appointments || [];
          // Format the date and time after fetching appointments
          this.appointments.forEach(appointment => {
            // Format the appointment_date as a short date
            appointment.appointment_date = this.datePipe.transform(appointment.appointment_date, 'shortDate');
            
            // Format the appointment_time as a valid time string
            if (appointment.appointment_time) {
              const timeParts = appointment.appointment_time.split(':');
              appointment.appointment_time = `${timeParts[0]}:${timeParts[1]}`;
            }
          });
        },
        (error) => {
          console.error('Error fetching appointments:', error);
        }
      );
    }
  }
}
