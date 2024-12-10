import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule], // Import CommonModule to use *ngFor and *ngIf
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'], // Ensure proper name for styles
})
export class DashboardComponent {
  appointments = [
    { date: '2024-12-10', time: '10:00 AM', patientName: 'John Doe' },
    { date: '2024-12-11', time: '2:00 PM', patientName: 'Jane Smith' },
    // Add more appointments if necessary
  ];
}
