import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  users: any[] = []; // To store patient data
  invoices: any[] = []; // To store invoices for patients
  insuranceClaims: any[] = []; // To store insurance claims for patients

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadInvoices();
    this.loadInsuranceClaims();
  }

  // Load users from the API
  loadUsers() {
    this.http
      .get('http://localhost/clinicapi/patients.php')
      .subscribe((data: any) => {
        this.users = data;
      });
  }

  // Load invoices from the API
  loadInvoices() {
    this.http
      .get('http://localhost/clinicapi/invoice.php')
      .subscribe((data: any) => {
        this.invoices = data;
      });
  }

  // Load insurance claims from the API
  loadInsuranceClaims() {
    this.http
      .get('http://localhost/clinicapi/insurance.php')
      .subscribe((data: any) => {
        this.insuranceClaims = data;
      });
  }
}
