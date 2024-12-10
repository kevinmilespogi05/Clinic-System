import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-analytics',
  standalone: true,
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.fetchStats();
  }

  fetchStats(): void {
    this.patientService.getStats().subscribe(
      (response) => {
        if (response.success) {
          const stats = response.data;
          this.renderChart(stats);
        } else {
          console.error('Failed to fetch stats:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching stats:', error);
      }
    );
  }

  renderChart(stats: any): void {
    const ctx = document.getElementById('statsChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Total Appointments', 'Total Patients', 'Booked', 'Cancelled'],
        datasets: [
          {
            label: 'Count',
            data: [
              stats.total_appointments,
              stats.total_patients,
              stats.booked_count,
              stats.cancelled_count
            ],
            backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#f44336']
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    });
  }
}
