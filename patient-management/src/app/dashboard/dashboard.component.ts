import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  appointments: any[] = [];  // Assuming this is already defined in your class
  selectedDate: Date;
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  
  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

    if (userId && role) {
      this.selectedDate = new Date(this.currentYear, this.currentMonth, 1);

      this.patientService.getAppointments(Number(userId), role).subscribe(
        (response) => {
          if (response.appointments) {
            this.appointments = response.appointments.map((appointment: any) => {
              // Combine date and time directly
              const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);

              if (isNaN(appointmentDateTime.getTime())) {
                console.error('Invalid date/time:', appointment.date, appointment.time);
              }

              // No timezone adjustment
              const formattedDate = appointmentDateTime.toLocaleDateString('en-US');
              const dayOfWeek = appointmentDateTime.toLocaleDateString('en-US', { weekday: 'long' });
              const formattedTime = appointmentDateTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });

              return {
                ...appointment,
                date: formattedDate,
                day: dayOfWeek,
                time: formattedTime,
              };
            });
          }
        },
        (error) => console.error('Error fetching appointments:', error)
      );
    }
  }

  // Define goToAppointmentDetails method
  goToAppointmentDetails(appointmentId: number): void {
    // Navigate to the appointment details page using router
    this.router.navigate(['/appointment-details', appointmentId]);
  }
}