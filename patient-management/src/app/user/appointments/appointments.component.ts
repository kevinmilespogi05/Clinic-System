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
  newAppointment: any = { date: '', time: '' };

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.patientService.getAppointments(Number(userId)).subscribe(
        (data) => {
          this.appointments = data || [];
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
      const appointmentData = {
        userId: Number(userId),
        date: this.newAppointment.date,
        time: this.newAppointment.time
      };

      this.patientService.bookAppointment(appointmentData).subscribe(
        (response) => {
          console.log('Appointment booked successfully:', response);
          this.fetchAppointments(); // Refresh the appointments list
          this.newAppointment = { date: '', time: '' }; // Reset the form
        },
        (error) => {
          console.error('Error booking appointment:', error);
        }
      );
    } else {
      console.error('Please fill in all required fields.');
    }
  }

  cancelAppointment(appointmentId: number): void {
    this.patientService.cancelAppointment(appointmentId).subscribe(
      (response) => {
        console.log('Appointment canceled successfully:', response);
        this.fetchAppointments(); // Refresh the appointments list
      },
      (error) => {
        console.error('Error canceling appointment:', error);
      }
    );
  }
}
