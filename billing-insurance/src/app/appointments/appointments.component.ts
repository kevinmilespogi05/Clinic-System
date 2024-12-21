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
  selectedStatus: string = 'approved'; // Default status for modal
  showEditModal: boolean = false; // Flag for showing the modal
  selectedAppointment: any = null; // To hold the appointment being edited

  constructor(private patientService: PatientService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.patientService.getAppointments().subscribe(
      (data: any) => {
        if (data && data.appointments && Array.isArray(data.appointments)) {
          // Remove the filter for cancelled appointments to load all data
          this.appointments = data.appointments.map((appointment: any) => ({
            ...appointment,
            patient_name: appointment.username,
            status: appointment.status || 'Pending',
          }));
        } else if (data.error) {
          console.error('Appointments data is not in the expected format', data.error);
          Swal.fire({
            title: 'Error',
            text: data.error,
            icon: 'error',
            confirmButtonText: 'Retry',
          });
        }
      },
      (error: any) => {
        console.error('An error occurred:', error);
        Swal.fire({
          title: 'Error',
          text: 'Unable to load appointments.',
          icon: 'error',
          confirmButtonText: 'Retry',
        });
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
    return date;
  }

  // Approve Appointment
  approve(appointmentId: number): void {
    this.patientService.approveAppointment(appointmentId).subscribe(
      (response) => {
        Swal.fire('Success', 'The appointment has been approved.', 'success');
        this.loadAppointments(); // Reload appointments
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
            this.loadAppointments(); // Reload appointments
          },
          (error) => {
            console.error('Failed to decline appointment:', error);
            Swal.fire('Error', 'Failed to decline the appointment.', 'error');
          }
        );
      }
    });
  }

  openEditModal(appointment: any): void {
    this.selectedAppointment = appointment;
    this.selectedStatus = appointment.status.toLowerCase() === 'approved' ? 'approved' : 'cancelled';
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  updateStatus(): void {
    if (this.selectedAppointment) {
      this.patientService.updateAppointmentStatus(this.selectedAppointment.id, this.selectedStatus).subscribe(
        (response: any) => {
          Swal.fire('Success', 'The appointment status has been updated.', 'success');
          this.loadAppointments(); // Reload appointments after status update
          this.closeEditModal();
        },
        (error: any) => {
          console.error('Failed to update appointment status:', error);
          Swal.fire('Error', 'Failed to update the appointment status.', 'error');
        }
      );
    }
  }
  

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
          (response: any) => {
            Swal.fire('Deleted!', 'The appointment has been deleted.', 'success');
            this.loadAppointments();
          },
          (error: any) => {
            console.error('Failed to delete appointment:', error);
            Swal.fire('Error', 'Failed to delete the appointment.', 'error');
          }
        );
      }
    });
  }
}