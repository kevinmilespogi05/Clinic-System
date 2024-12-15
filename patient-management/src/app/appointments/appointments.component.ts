import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../services/patient.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];
  appointmentSlots = [
    { day: 'Monday', time: '10:00 AM - 11:00 AM' },
    { day: 'Tuesday', time: '10:00 AM - 11:00 AM' },
    { day: 'Wednesday', time: '10:00 AM - 11:00 AM' },
    { day: 'Thursday', time: '10:00 AM - 11:00 AM' },
    { day: 'Friday', time: '10:00 AM - 11:00 AM' },
    { day: 'Monday', time: '11:00 AM - 12:00 PM' },
    { day: 'Tuesday', time: '11:00 AM - 12:00 PM' },
    { day: 'Wednesday', time: '11:00 AM - 12:00 PM' },
    { day: 'Thursday', time: '11:00 AM - 12:00 PM' },
    { day: 'Friday', time: '11:00 AM - 12:00 PM' }
  ];

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

  bookAppointment(slot: any): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to book this appointment on ${slot.day} at ${slot.time}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, book it!',
        cancelButtonText: 'No, cancel',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          const newAppointment = {
            id: Date.now(), // Temporary unique ID for local UI update
            day: slot.day,
            time: slot.time
          };

          // Directly add the appointment to the UI
          this.appointments.push(newAppointment);

          const appointmentData = {
            id: Number(userId),
            day: slot.day,
            time: slot.time
          };

          this.patientService.bookAppointment(appointmentData).subscribe(
            (response) => {
              console.log('Appointment booked successfully:', response);
              Swal.fire({
                title: 'Success!',
                text: 'Your appointment has been booked successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
              });
            },
            (error) => {
              console.error('Error booking appointment:', error);

              Swal.fire({
                title: 'Error!',
                text: 'There was an error booking your appointment. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK'
              });

              // Rollback: Remove the appointment if backend call fails
              this.appointments = this.appointments.filter(
                (appt) => appt.id !== newAppointment.id
              );
            }
          );
        }
      });
    }
  }

  cancelAppointment(appointmentId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to cancel this appointment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.patientService.cancelAppointment(appointmentId).subscribe(
          (response) => {
            console.log('Appointment canceled:', response);

            // Remove appointment from the local list
            this.appointments = this.appointments.filter(
              (appt) => appt.id !== appointmentId
            );

            Swal.fire({
              title: 'Cancelled',
              text: 'Your appointment has been cancelled.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          },
          (error) => {
            console.error('Error canceling appointment:', error);

            Swal.fire({
              title: 'Error!',
              text: 'There was an error canceling your appointment. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      }
    });
  }
}
