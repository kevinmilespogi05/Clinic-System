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
  pendingAppointments: any[] = [];
  appointments: any[] = [];
  selectedStatus: string = 'approved';
  showEditModal: boolean = false;
  selectedAppointment: any = null;

  constructor(private patientService: PatientService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.patientService.getAppointments().subscribe(
      (data: any) => {
        if (data && data.appointments && Array.isArray(data.appointments)) {
          this.pendingAppointments = data.appointments
            .filter((appt: any) => appt.status === 'pending')
            .map((appointment: any) => ({
              ...appointment,
              patient_name: appointment.username || 'Unknown Patient',
            }));
    
          this.appointments = data.appointments
            .filter((appt: any) => appt.status !== 'pending')
            .map((appointment: any) => ({
              ...appointment,
              patient_name: appointment.username || 'Unknown Patient',
            }));
        } else {
          Swal.fire('Error', 'Invalid data format', 'error');
        }
      },
      (error) => {
        console.error('Error loading appointments:', error);
        Swal.fire('Error', 'Unable to load appointments.', 'error');
      }
    );
  }
  
  
  
  

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'shortDate') || date;
  }

  // Approve Appointment
  approve(appointmentId: number): void {
    this.patientService.approveAppointment(appointmentId).subscribe(
      () => {
        Swal.fire('Success', 'Appointment approved.', 'success');
        this.moveAppointment(appointmentId, 'approved');
      },
      (error) => {
        console.error('Error approving appointment:', error);
        Swal.fire('Error', 'Failed to approve appointment.', 'error');
      }
    );
  }

// Decline Appointment
decline(appointmentId: number): void {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to cancel this appointment?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, cancel it!',
  }).then((result) => {
    if (result.isConfirmed) {
      this.patientService.declineAppointment(appointmentId).subscribe(
        () => {
          Swal.fire('Cancelled', 'Appointment has been cancelled and deleted.', 'success');
          this.loadAppointments(); // Reload the list after deletion
        },
        (error) => {
          console.error('Error cancelling appointment:', error);
          Swal.fire('Error', 'Failed to cancel appointment.', 'error');
        }
      );
    }
  });
}


moveAppointment(appointmentId: number, newStatus: string): void {
  const appointmentIndex = this.pendingAppointments.findIndex((appt) => appt.id === appointmentId);
  if (appointmentIndex > -1) {
    const appointment = { ...this.pendingAppointments[appointmentIndex], status: newStatus };
    
    // Check if the appointment has been approved before moving it to the appointments section
    if (newStatus === 'approved' && appointment.payment_status === 'paid') {
      this.pendingAppointments.splice(appointmentIndex, 1);
      this.appointments.push(appointment);
    }
  }
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
          () => {
            Swal.fire('Deleted!', 'Appointment deleted.', 'success');
            this.appointments = this.appointments.filter((appt) => appt.id !== appointmentId);
          },
          (error) => {
            console.error('Error deleting appointment:', error);
            Swal.fire('Error', 'Failed to delete appointment.', 'error');
          }
        );
      }
    });
  }

generateInvoice(appointmentId: number): void {
  // Find the appointment by its ID
  const appointment = this.appointments.find(appt => appt.id === appointmentId);

  // Proceed only if the payment status is 'paid'
  if (appointment && appointment.payment_status === 'paid') {
    this.patientService.generateInvoice(appointmentId).subscribe(
      (response) => {
        if (response.success) {
          Swal.fire('Success', 'Invoice generated successfully.', 'success');
          this.loadAppointments(); // Reload appointments to show updated data
        } else {
          Swal.fire('Error', response.message, 'error');
        }
      },
      (error) => {
        console.error('Error generating invoice:', error);
        Swal.fire('Error', 'Failed to generate invoice.', 'error');
      }
    );
  } else {
    // If the appointment is not paid, show an error message
    Swal.fire('Error', 'Invoice can only be generated for paid appointments.', 'error');
  }
}

  
}