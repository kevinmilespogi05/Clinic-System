import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../services/patient.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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

  // Handle the form submission to book an appointment
  bookAppointment(): void {
    const userId = localStorage.getItem('userId');
    if (userId && this.newAppointment.date && this.newAppointment.time) {
      const dateTime = `${this.newAppointment.date} ${this.newAppointment.time}`;
      const appointmentData = {
        user_id: Number(userId),
        date: this.newAppointment.date,
        time: this.newAppointment.time,
        description: this.newAppointment.description
      };
  
      console.log('Booking Appointment with data:', appointmentData); // Add logging to check form data
  
      // Call the service to book the appointment
      this.patientService.bookAppointment(appointmentData).subscribe(
        (response) => {
          console.log('Appointment booked successfully:', response);
          // Refresh the appointments list
          this.fetchAppointments();
          // Clear the form after successful booking
          this.newAppointment = {};
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
