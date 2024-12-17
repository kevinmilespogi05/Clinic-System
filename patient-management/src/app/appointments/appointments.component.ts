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
    { day: 'Monday', time: '10:00 AM - 11:00 AM', date: '2024-12-18' },
    { day: 'Tuesday', time: '10:00 AM - 11:00 AM', date: '2024-12-19' },
    { day: 'Wednesday', time: '10:00 AM - 11:00 AM', date: '2024-12-20' },
    { day: 'Thursday', time: '10:00 AM - 11:00 AM', date: '2024-12-21' },
    { day: 'Friday', time: '10:00 AM - 11:00 AM', date: '2024-12-22' },
    { day: 'Monday', time: '11:00 AM - 12:00 PM', date: '2024-12-18' },
    { day: 'Tuesday', time: '11:00 AM - 12:00 PM', date: '2024-12-19' },
    { day: 'Wednesday', time: '11:00 AM - 12:00 PM', date: '2024-12-20' },
    { day: 'Thursday', time: '11:00 AM - 12:00 PM', date: '2024-12-21' },
    { day: 'Friday', time: '11:00 AM - 12:00 PM', date: '2024-12-22' }
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
      const newAppointment = {
        id: Date.now(), // Temporary ID
        day: slot.day,
        time: slot.time,
        date: slot.date,
        status: 'pending', // Set initial status to pending
      };

      // Add to local list for immediate UI feedback
      this.appointments.push(newAppointment);

      this.patientService
        .bookAppointment({
          userId: Number(userId),
          day: slot.day,
          time: slot.time,
          date: slot.date,
          status: 'pending', // Ensure status is sent to the backend
        })
        .subscribe(
          () => Swal.fire('Success', 'Appointment is pending approval', 'success'),
          () => Swal.fire('Error', 'Failed to book', 'error')
        );
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

            Swal.fire('Cancelled', 'Your appointment has been cancelled.', 'success');
          },
          (error) => {
            console.error('Error canceling appointment:', error);
            Swal.fire('Error!', 'Failed to cancel appointment. Please try again later.', 'error');
          }
        );
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }
}
