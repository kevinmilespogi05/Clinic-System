import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class InsuranceComponent implements OnInit {
  newClaim = { policyNumber: '', amount: 0 };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  // Add an insurance claim
  addClaim() {
    this.http
      .post('http://localhost/clinicapi/insurance.php', this.newClaim)
      .subscribe(() => {
        alert('Claim submitted successfully');
      });
  }
}
