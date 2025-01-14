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
    // Wait for the DOM to load before accessing canvas elements
    setTimeout(() => {
      const ctxAppointments = document.getElementById('appointmentsChart') as HTMLCanvasElement;
      const ctxInsurance = document.getElementById('insuranceChart') as HTMLCanvasElement;
      const ctxOtherStats = document.getElementById('otherStatsChart') as HTMLCanvasElement;
  
      if (!ctxAppointments || !ctxInsurance || !ctxOtherStats) {
        console.error('Failed to find canvas elements. Ensure IDs are correct and DOM is loaded.');
        return;
      }
  
      const appointmentsTotal = stats.paid_invoices + stats.unpaid_invoices + stats.total_appointments;
      const insuranceTotal = stats.approved_claims + stats.pending_claims;
      const otherStatsTotal = stats.total_patients + stats.booked_count + stats.cancelled_count;

  
      // Appointments Chart
      new Chart(ctxAppointments, {
        type: 'pie',
        data: {
          labels: ['Paid Appointments', 'Unpaid Appointments', 'Total Appointments'],
          datasets: [
            {
              data: [stats.paid_invoices, stats.unpaid_invoices, stats.total_appointments],
              backgroundColor: ['#4caf50', '#f44336', '#2196f3'],
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
                  return ''; // Hide zero values
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
      
  
      // Insurance Claims Chart
      new Chart(ctxInsurance, {
        type: 'pie',
        data: {
          labels: ['Approved Claims', 'Pending Claims'],
          datasets: [
            {
              data: [stats.approved_claims, stats.pending_claims],
              backgroundColor: ['#4caf50', '#ff9800'],
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
                  const percentage = ((value / insuranceTotal) * 100).toFixed(2);
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
                const percentage = ((value / insuranceTotal) * 100).toFixed(0);
                return `${percentage}%`;
              },
              align: 'center',
              anchor: 'center',
            },
          },
        },
      });
  
      // Other Stats Chart
      new Chart(ctxOtherStats, {
        type: 'pie',
        data: {
          labels: ['Paid Invoices', 'Unpaid Invoices'],
          datasets: [
            {
              data: [stats.paid_invoices, stats.unpaid_invoices],
              backgroundColor: ['#4caf50', '#f44336'],
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
                  const percentage = ((value / otherStatsTotal) * 100).toFixed(2);
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
                const percentage = ((value / otherStatsTotal) * 100).toFixed(0);
                return `${percentage}%`;
              },
              align: 'center',
              anchor: 'center',
            },
          },
        },
      });
    }, 0); // Defer execution to allow DOM rendering
  }
}  
