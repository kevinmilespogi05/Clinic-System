import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../services/patient.service';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);

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
          this.renderCharts(response);
        } else {
          console.error('Failed to fetch stats:', response.message);
        }
      },
      (error: any) => {
        console.error('Error fetching stats:', error);
      }
    );
  }

  renderCharts(stats: any): void {
    const ctxAppointments = document.getElementById('appointmentsChart') as HTMLCanvasElement;
    const ctxOtherStats = document.getElementById('otherStatsChart') as HTMLCanvasElement;

    const appointmentsTotal = stats.paid_invoices + stats.unpaid_invoices + stats.total_appointments;
    const otherStatsTotal = stats.total_patients + stats.booked_count + stats.cancelled_count;

    // Appointments Breakdown Pie Chart (Paid, Unpaid, Total Appointments)
    new Chart(ctxAppointments, {
      type: 'pie',
      data: {
        labels: ['Paid Appointments', 'Unpaid Appointments', 'Total Appointments'],
        datasets: [
          {
            data: [stats.paid_invoices, stats.unpaid_invoices, stats.total_appointments],
            backgroundColor: ['#4caf50', '#f44336', '#2196f3'], // Green, Red, Blue
            borderWidth: 0, // Removes the white line
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                const value = tooltipItem.raw as number;
                const percentage = ((value / appointmentsTotal) * 100).toFixed(2);
                return `${tooltipItem.label}: ${percentage}%`;
              },
            },
          },
          datalabels: {
            color: '#000',
            font: {
              size: 14,
            },
            formatter: function (value: number) {
              if (value === 0) {
                return ''; // Hide labels with zero value
              }
              const percentage = ((value / appointmentsTotal) * 100).toFixed(0);
              return `${percentage}%`;
            },
            align: 'center',
            anchor: 'center',
          },
        },
      },
    });

    // Other Stats Pie Chart (Paid vs. Unpaid Invoices)
new Chart(ctxOtherStats, {
  type: 'pie',
  data: {
    labels: ['Paid Invoices', 'Unpaid Invoices'],
    datasets: [
      {
        data: [stats.paid_invoices, stats.unpaid_invoices],
        backgroundColor: ['#4caf50', '#f44336'], // Green for Paid, Red for Unpaid
        borderWidth: 0,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw as number;
            const percentage = ((value / (stats.paid_invoices + stats.unpaid_invoices)) * 100).toFixed(2);
            return `${tooltipItem.label}: ${percentage}%`;
          },
        },
      },
      datalabels: {
        color: '#000',
        font: {
          size: 14,
        },
        formatter: function (value: number) {
          if (value === 0) {
            return ''; // Hide zero values
          }
          const percentage = ((value / (stats.paid_invoices + stats.unpaid_invoices)) * 100).toFixed(0);
          return `${percentage}%`;
        },
        align: 'center',
        anchor: 'center',
      },
    },
  },
});
}
}
