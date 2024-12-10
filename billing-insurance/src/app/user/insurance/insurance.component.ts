import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InsuranceService } from '../../services/insurance.service';

@Component({
  selector: 'app-insurance',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css'],
  providers: [InsuranceService],
})
export class InsuranceComponent implements OnInit {
  claims: any[] = [];

  constructor(private insuranceService: InsuranceService) {}

  ngOnInit(): void {
    this.insuranceService.getClaims().subscribe((data: any[]) => {
      this.claims = data;
    });
  }
}
