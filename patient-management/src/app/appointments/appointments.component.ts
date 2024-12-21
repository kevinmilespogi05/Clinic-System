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

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role'); // Assuming role is stored in local storage
    
    if (userId && role) {
      this.patientService.getAppointments(Number(userId), role).subscribe(
        (response) => {
          if (response.appointments) {
            this.appointments = response.appointments.map((appointment: any) => {
              const appointmentDate = new Date(appointment.date);
              const formattedDate = appointmentDate.toLocaleDateString('en-US'); // Format date
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
  

  isSlotOccupied(slot: any): boolean {
    // Check if the slot is already booked or approved
    return this.appointments.some(
      (appointment) =>
        appointment.date === slot.date &&
        appointment.time === slot.time &&
        (appointment.status === 'booked' || appointment.status === 'approved')
    );
  }
  
  bookAppointment(slot: any): void {
    if (this.isSlotOccupied(slot)) {
      Swal.fire('Error', 'This slot is already occupied or approved.', 'error');
      return;
    }
  
    const userId = localStorage.getItem('userId');
    if (userId) {
      const description = prompt('Enter the description for the appointment:');
      if (description) {
        this.patientService
          .bookAppointment({
            user_id: Number(userId),
            day: slot.day,
            time: slot.time,
            date: slot.date,
            description: description,
            status: 'booked',
          })
          .subscribe(
            (response) => {
              if (response.error) {
                Swal.fire('Error', response.error, 'error');
              } else {
                Swal.fire('Success', 'Appointment successfully booked.', 'success');
                this.fetchAppointments(); // Re-fetch appointments to update the list
              }
            },
            (error) => {
              console.error('Error booking appointment:', error);
              Swal.fire('Error', 'Failed to book appointment. Please try again.', 'error');
            }
          );
      } else {
        Swal.fire('Error', 'Description is required to book the appointment.', 'error');
      }
    }
  }
  
  cancelAppointment(appointmentId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to cancel this appointment?',
      icon: 'warning',
      input: 'text',
      inputPlaceholder: 'Reason for cancellation',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.patientService
          .cancelAppointment(appointmentId, result.value)
          .subscribe(
            (response) => {
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
      } else if (!result.value) {
        Swal.fire('Error', 'Cancellation reason is required', 'error');
      }
    });
  }

  approveAppointment(appointmentId: number): void {
    this.patientService
      .updateAppointmentStatus(appointmentId, 'approved')
      .subscribe(
        (response) => {
          this.appointments = this.appointments.map((appt) => {
            if (appt.id === appointmentId) {
              appt.status = 'approved';
            }
            return appt;
          });
  
          Swal.fire('Approved', 'The appointment has been approved.', 'success');
        },
        (error) => {
          console.error('Error approving appointment:', error);
          Swal.fire('Error!', 'Failed to approve appointment. Please try again later.', 'error');
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
