import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule], // Make sure CommonModule is included
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  appointments: any[] = [];
  message: string = '';  // Property to store the message from the API
  userId: number = 1;    // Replace with actual user ID

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadAppointments();  // Load appointments when the component initializes
  }

  loadAppointments(): void {
    this.patientService.getAppointments(this.userId).subscribe(
      (data) => {
        console.log('API Response:', data);  // Log the full response
        
        // Check if the 'appointments' array exists and has data
        if (data.appointments && data.appointments.length > 0) {
          this.appointments = data.appointments;  // Assign appointments if available
        } else {
          this.appointments = [];  // Keep appointments as empty array
          this.message = data.message || 'No upcoming appointments.';  // Assign message
          console.log(this.message);  // Log the message
        }
      },
      (error) => {
        console.error('Error fetching appointments:', error);
      }
    );
  }
  
}
