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
        labels: ['Paid Invoices', 'Unpaid Invoices', 'Accepted Claims', 'Rejected Claims'],
        datasets: [
          {
            label: 'Count',
            data: [
              stats.paid_invoices, // from your updated API response
              stats.unpaid_invoices, // from your updated API response
              stats.accepted_claims, // from your updated API response
              stats.rejected_claims // from your updated API response
            ],
            backgroundColor: ['#4caf50', '#f44336', '#2196f3', '#ff9800']
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
