import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
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
        this.appointments = data.appointments.map((appointment: any) => ({
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
            // Show success message
            Swal.fire('Deleted!', 'The appointment has been deleted.', 'success');
            this.loadAppointments(); // Reload appointments after deletion
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
