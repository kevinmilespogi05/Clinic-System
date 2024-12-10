import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../services/patient.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';  // Import SweetAlert2

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
      // Show confirmation before proceeding
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to book this appointment?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, book it!',
        cancelButtonText: 'No, cancel',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          const dateTime = `${this.newAppointment.date} ${this.newAppointment.time}`;
          const appointmentData = {
            id: Number(userId),
            date: this.newAppointment.date,
            time: this.newAppointment.time,
            description: this.newAppointment.description
          };

          console.log('Booking Appointment with data:', appointmentData); // Add logging to check form data

          // Call the service to book the appointment
          this.patientService.bookAppointment(appointmentData).subscribe(
            (response) => {
              console.log('Appointment booked successfully:', response);
              // Show success alert
              Swal.fire({
                title: 'Success!',
                text: 'Your appointment has been booked successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(() => {
                // Refresh the appointments list
                this.fetchAppointments();
                // Clear the form after successful booking
                this.newAppointment = {};
              });
            },
            (error) => {
              console.error('Error booking appointment:', error);
              // Show error alert
              Swal.fire({
                title: 'Error!',
                text: 'There was an error booking your appointment. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          );
        } else {
          // If canceled, show info alert
          Swal.fire({
            title: 'Canceled',
            text: 'Your appointment booking has been canceled.',
            icon: 'info',
            confirmButtonText: 'OK'
          });
        }
      });
    } else {
      // Show validation error alert
      Swal.fire({
        title: 'Validation Error!',
        text: 'Please fill in all required fields before submitting.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }
}
