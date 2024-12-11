import { Component, OnInit } from '@angular/core';
import { BillingService } from '../../services/billing.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-analytics',
  standalone: true,
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  constructor(private billingService: BillingService) {}

  ngOnInit(): void {
    this.fetchStats();
  }

  fetchStats(): void {
    this.billingService.getStats().subscribe(
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
        labels: ['Paid Invoices', 'Unpaid Invoices', 'Approved Claims', 'Rejected Claims', 'Pending Claims'],
        datasets: [
          {
            label: 'Count',
            data: [
              stats.paid_invoices,
              stats.unpaid_invoices,
              stats.approved_claims,
              stats.rejected_claims,
              stats.pending_claims
            ],
            backgroundColor: ['#4caf50', '#f44336', '#2196f3', '#ff9800', '#9c27b0']
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            min: 0, // Start y-axis at zero
            ticks: {
              stepSize: 1, // Increment by 1
              precision: 0 // Use whole numbers only
            }
          }
        },
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
