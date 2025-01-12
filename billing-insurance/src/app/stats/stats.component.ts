import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../services/patient.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-stats',
  standalone: true,
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
  imports: [CommonModule],
})
export class StatsComponent implements OnInit {
  combinedStats: any;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.fetchCombinedStats();
  }
  fetchCombinedStats(): void {
    this.patientService.getCombinedStats().subscribe(
      (response: any) => {
        if (response) {
          this.combinedStats = response;
          this.renderCombinedChart(response);
        } else {
          console.error('Failed to fetch stats:', response.message);
        }
      },
      (error: any) => {
        console.error('Error fetching stats:', error);
      }
    );
  }
  renderCombinedChart(stats: any): void {
    const ctx = document.getElementById(
      'combinedStatsChart'
    ) as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Paid Appointments',
          'Unpaid Appointments',
          'Total Appointments',
          'Total Patients',
          'Booked',
          'Cancelled',
        ],
        datasets: [
          {
            label: 'Billing Stats',
            data: [
              stats.paid_invoices,
              stats.unpaid_invoices,
              0,
              0,
              0,
              0, // Fill with zeros for appointment-related labels
            ],
            backgroundColor: [
              '#4caf50',
              '#f44336',
              '#ffffff',
              '#ffffff',
              '#ffffff',
              '#ffffff',
            ],
          },
          {
            label: 'Appointments Stats',
            data: [
              0,
              0, // Fill with zeros for billing-related labels
              stats.total_appointments,
              stats.total_patients,
              stats.booked_count,
              stats.cancelled_count,
            ],
            backgroundColor: [
              '#ffffff',
              '#ffffff',
              '#4caf50',
              '#2196f3',
              '#ff9800',
              '#f44336',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            min: 0, // Start y-axis at zero
            ticks: {
              stepSize: 1, // Increment by 1
              precision: 0, // Use whole numbers only
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
      },
    });
  }
}