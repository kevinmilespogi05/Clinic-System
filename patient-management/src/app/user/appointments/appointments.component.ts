import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../services/patient.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';  // <-- Add FormsModule here

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],  // <-- Include FormsModule in imports
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];
  newAppointment: any = {};

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.patientService.getAppointments(Number(userId)).subscribe(
        (data) => {
          this.appointments = data.appointments || [];
        },
        (error) => {
          console.error('Error fetching appointments:', error);
        }
      );
    }
  }

  bookAppointment(): void {
    const userId = localStorage.getItem('userId');
    if (userId && this.newAppointment.date && this.newAppointment.time) {
      const dateTime = `${this.newAppointment.date} ${this.newAppointment.time}`;
      const appointmentData = {
        userId: Number(userId),
        date: this.newAppointment.date,
        time: this.newAppointment.time
      };

      this.patientService.bookAppointment(appointmentData).subscribe(
        (response) => {
          console.log('Appointment booked successfully:', response);
          this.fetchAppointments();
        },
        (error) => {
          console.error('Error booking appointment:', error);
        }
      );
    } else {
      console.error('Please fill in all fields.');
    }
  }
}
