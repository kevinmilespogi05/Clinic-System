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
  claims: any[] = [];  // Declare the claims property
  
  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAppointments();
    this.loadClaims();  // Now load the claims when the component initializes
  }

  // Helper function to convert 12-hour time format to 24-hour format
  convertTo24HourTime(time: string): string {
    const [hour, minuteAndPeriod] = time.split(':');
    const [minute, period] = minuteAndPeriod.split(' ');

    let hour24 = parseInt(hour, 10);
    if (period === 'PM' && hour24 !== 12) hour24 += 12;
    if (period === 'AM' && hour24 === 12) hour24 = 0;

    return `${hour24.toString().padStart(2, '0')}:${minute}`;
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
              // Combine date and time using the correct ISO format
              const appointmentDateTime = new Date(`${appointment.date}T${this.convertTo24HourTime(appointment.time)}`);

              if (isNaN(appointmentDateTime.getTime())) {
                console.error('Invalid date/time:', appointment.date, appointment.time);
              }

              // Format the date and time
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
    loadClaims(): void {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    const isAdmin = localStorage.getItem('role') === 'admin' ? 1 : 0;

    this.patientService.getInsuranceClaims(userId, isAdmin).subscribe((response: { success: boolean, claims: any[] }) => {
      if (response.success) {
        this.claims = response.claims;  // Assign the claims array from the response
      } else {
        console.error('Error fetching claims:', response);
      }
    });
  }
}
