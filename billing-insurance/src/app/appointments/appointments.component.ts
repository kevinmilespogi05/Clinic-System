import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { DatePipe } from '@angular/common'; // Import DatePipe
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule], // Include CommonModule and FormsModule in the imports
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
  providers: [DatePipe], // Add DatePipe to the providers array
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];

  constructor(private patientService: PatientService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments() {
    this.patientService.getAppointments().subscribe(
      (data) => {
        // Filter out appointments where the status is 'Cancelled'
        this.appointments = data.appointments
          .filter((appointment: any) => appointment.status?.toLowerCase() !== 'cancelled')
          .map((appointment: any) => ({
            ...appointment,
            patient_name: appointment.name, // Map patient name
            status: appointment.status || 'Pending', // Default status if not present
          }));
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  }

  formatDate(date: string): string {
    if (Date.parse(date)) {
      return this.datePipe.transform(date, 'shortDate') || date;
    }
    return date; // Return original if not a valid date
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  // Approve Appointment
  approve(appointmentId: number): void {
    this.patientService.approveAppointment(appointmentId).subscribe(
      (response) => {
        Swal.fire('Success', 'The appointment has been approved.', 'success');
        this.loadAppointments();
      },
      (error) => {
        console.error('Failed to approve appointment:', error);
        Swal.fire('Error', 'Failed to approve the appointment.', 'error');
      }
    );
  }

  // Decline Appointment
  decline(appointmentId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to decline this appointment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, decline it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.patientService.declineAppointment(appointmentId).subscribe(
          (response) => {
            Swal.fire('Declined', 'The appointment has been declined.', 'success');
            this.loadAppointments();
          },
          (error) => {
            console.error('Failed to decline appointment:', error);
            Swal.fire('Error', 'Failed to decline the appointment.', 'error');
          }
        );
      }
    });
  }

  // Edit Appointment
  edit(appointment: any): void {
    Swal.fire({
      title: 'Edit Appointment',
      html: `
        <input id="swal-input-title" class="swal2-input" placeholder="Title" value="${appointment.title}">
        <input id="swal-input-date" class="swal2-input" type="date" value="${appointment.date}">
        <input id="swal-input-time" class="swal2-input" type="time" value="${appointment.time}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const updatedTitle = (document.getElementById('swal-input-title') as HTMLInputElement).value;
        const updatedDate = (document.getElementById('swal-input-date') as HTMLInputElement).value;
        const updatedTime = (document.getElementById('swal-input-time') as HTMLInputElement).value;

        return { title: updatedTitle, date: updatedDate, time: updatedTime };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedAppointment = {
          ...appointment,
          title: result.value?.title,
          date: result.value?.date,
          time: result.value?.time,
        };

        this.patientService.updateAppointment(updatedAppointment).subscribe(
          (response) => {
            Swal.fire('Updated', 'The appointment has been updated.', 'success');
            this.loadAppointments();
          },
          (error) => {
            console.error('Failed to update appointment:', error);
            Swal.fire('Error', 'Failed to update the appointment.', 'error');
          }
        );
      }
    });
  }

  // Delete Appointment Method with SweetAlert2 Confirmation
  deleteAppointment(appointmentId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this appointment!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.patientService.deleteAppointment(appointmentId).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'The appointment has been deleted.', 'success');
            this.loadAppointments();
          },
          (error) => {
            console.error('Failed to delete appointment:', error);
            Swal.fire('Error', 'Failed to delete the appointment.', 'error');
          }
        );
      }
    });
  }
}
