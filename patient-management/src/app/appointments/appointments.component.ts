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
  styleUrls: ['./appointments.component.css'],
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];
  appointmentSlots = [
    { day: 'Monday', time: '10:00 AM - 11:00 AM', date: '2024-12-16' },
    { day: 'Tuesday', time: '10:00 AM - 11:00 AM', date: '2024-12-17' },
    { day: 'Wednesday', time: '10:00 AM - 11:00 AM', date: '2024-12-18' },
    { day: 'Thursday', time: '10:00 AM - 11:00 AM', date: '2024-12-19' },
    { day: 'Friday', time: '10:00 AM - 11:00 AM', date: '2024-12-20' },
    { day: 'Monday', time: '11:00 AM - 12:00 PM', date: '2024-12-23' },
    { day: 'Tuesday', time: '11:00 AM - 12:00 PM', date: '2024-12-24' },
    { day: 'Wednesday', time: '11:00 AM - 12:00 PM', date: '2024-12-25' },
    { day: 'Thursday', time: '11:00 AM - 12:00 PM', date: '2024-12-26' },
    { day: 'Friday', time: '11:00 AM - 12:00 PM', date: '2024-12-27' },
  ];

  showModal: boolean = false; // Flag to show/hide the cancellation modal
  showBookingModal: boolean = false; // Flag to show/hide the booking modal
  cancellationReason: string = ''; // Stores the cancellation reason
  appointmentDescription: string = ''; // Stores the appointment description
  appointmentToCancel: number | null = null; // The appointment ID to be cancelled
  selectedSlot: any = null; // The slot being booked

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    
    if (userId && role) {
      this.patientService.getAppointments(Number(userId), role).subscribe(
        (response) => {
          if (response.appointments) {
            this.appointments = response.appointments.map((appointment: any) => {
              const appointmentDate = new Date(appointment.date);
              const formattedDate = appointmentDate.toLocaleDateString('en-US');
              const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });
  
              return {
                ...appointment,
                date: formattedDate,
                day: dayOfWeek,
              };
            });
          }
        },
        (error) => {
          console.error('Error fetching appointments:', error);
        }
      );
    }
  }

  openBookingModal(slot: any): void {
    this.selectedSlot = slot;
    this.showBookingModal = true;
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
    this.appointmentDescription = '';
    this.selectedSlot = null;
  }

  isSlotOccupied(slot: any): boolean {
    return this.appointments.some(
      (appointment) =>
        appointment.date === slot.date &&
        appointment.time === slot.time &&
        (appointment.status === 'booked' || appointment.status === 'approved')
    );
  }

  bookAppointment(): void {
    if (!this.appointmentDescription.trim()) {
      Swal.fire('Error', 'Please enter a description for the appointment.', 'error');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (userId) {
      this.patientService.bookAppointment({
        user_id: Number(userId),
        day: this.selectedSlot.day,
        time: this.selectedSlot.time,
        date: this.selectedSlot.date,
        description: this.appointmentDescription,
        status: 'booked',
      }).subscribe(
        (response) => {
          if (response.error) {
            Swal.fire('Error', response.error, 'error');
          } else {
            Swal.fire('Success', 'Appointment successfully booked.', 'success');
            this.fetchAppointments();
            this.closeBookingModal();
          }
        },
        (error) => {
          Swal.fire('Error', 'Failed to book appointment. Please try again.', 'error');
        }
      );
    }
  }

  openCancelModal(appointmentId: number): void {
    this.appointmentToCancel = appointmentId;
    this.showModal = true;
  }

  closeCancelModal(): void {
    this.showModal = false;
    this.cancellationReason = '';
  }

  cancelAppointment(appointmentId: number): void {
    if (this.cancellationReason.trim() === '') {
      Swal.fire('Error', 'Please provide a cancellation reason.', 'error');
      return;
    }

    this.patientService.cancelAppointmentWithReason(appointmentId, this.cancellationReason).subscribe(
      (response) => {
        if (response.message === 'Appointment cancelled successfully.') {
          Swal.fire('Success', 'Appointment cancelled successfully', 'success');
          this.fetchAppointments();
          this.closeCancelModal();
        } else {
          Swal.fire('Error', 'Failed to cancel appointment', 'error');
        }
      },
      (error) => {
        Swal.fire('Error', 'An error occurred while canceling the appointment', 'error');
      }
    );
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
