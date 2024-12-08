import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  appointments: any[] = [];

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
}  