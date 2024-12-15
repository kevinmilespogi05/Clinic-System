import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PatientService } from '../services/patient.service';
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
          // Format the data after fetching appointments
          this.appointments.forEach(appointment => {
            appointment.date = this.datePipe.transform(appointment.date, 'shortDate');
            if (appointment.time) {
              const timeParts = appointment.time.split(':');
              appointment.time = `${timeParts[0]}:${timeParts[1]}`;
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

