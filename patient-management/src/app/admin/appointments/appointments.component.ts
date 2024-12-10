import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { DatePipe } from '@angular/common';  // Import DatePipe
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Include CommonModule and FormsModule in the imports
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
  providers: [DatePipe]  // Add DatePipe to the providers array
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];

  constructor(private patientService: PatientService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments() {
    // Call the service to get appointments and the name of the patient
    this.patientService.getAppointments().subscribe(
      (data) => {
        this.appointments = data.appointments.map((appointment: any) => {
          // Here, we assume that the appointment object already contains the name
          // If not, fetch the name using an additional API call (this can be handled in the service)
          return {
            ...appointment,
            patient_name: appointment.name // Assuming 'name' is part of the appointment object
          };
        });
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }

  // Format the time as 'HH:mm' from 'HH:mm:ss'
  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  }

  // Use DatePipe to format the date (e.g., 'shortDate')
  formatDate(date: string): string {
    if (Date.parse(date)) {
      return this.datePipe.transform(date, 'shortDate') || date;
    }
    return date; // Return original if not a valid date
  }
}
