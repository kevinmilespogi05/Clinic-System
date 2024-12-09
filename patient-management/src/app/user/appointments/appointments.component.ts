import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for NgIf and NgFor
import { PatientService } from '../../services/patient.service'; // Import the service to get data
import { RouterModule } from '@angular/router'; // Import RouterModule


@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule], // Add CommonModule here
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = []; // Array to store appointments

  constructor(private patientService: PatientService) {} // Inject the PatientService

  ngOnInit(): void {
    this.fetchAppointments(); // Fetch appointments when the component is initialized
  }

  fetchAppointments(): void {
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    if (userId) {
      // Use your service to fetch appointments
      this.patientService.getAppointments(Number(userId)).subscribe(
        (data) => {
          this.appointments = data.appointments || []; // Assign the fetched data to the appointments array
        },
        (error) => {
          console.error('Error fetching appointments:', error); // Handle error
        }
      );
    }
  }
}
