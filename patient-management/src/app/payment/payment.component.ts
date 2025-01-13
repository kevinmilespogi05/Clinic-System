import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule], // Include CommonModule and FormsModule in the imports
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  appointmentId: number | null = null;
  appointment: any = null; // Store appointment data
  totalAmount: number = 0;

  @ViewChild('paymentRef', {static: true}) paymentRef!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,  // Inject the Router service
    private patientService: PatientService // Inject the service
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.appointmentId = +params['appointmentId'] || null;
      console.log('Appointment ID:', this.appointmentId);
      if (this.appointmentId) {
        this.fetchAppointmentDetails();
      }
    });
  
    window.paypal.Buttons({
      style: { layout: 'horizontal', color: 'blue', shape: 'rect', label: 'paypal' },
      createOrder: (data: any, actions: any) => actions.order.create({
        purchase_units: [{ amount: { value: this.totalAmount, currency_code: 'PHP' } }]
      }),
      onApprove: (data: any, actions: any) => actions.order.capture().then((details: any) => {
        console.log('Payment completed!', details);
        this.updateAppointmentStatus(this.appointmentId, 'paid');
        this.router.navigate(['/appointments']);
      }),
      onError: (error: any) => console.error('Error processing payment:', error),
    }).render(this.paymentRef.nativeElement);
  }
  
  fetchAppointmentDetails(): void {
    const userId = 3; // Replace with actual user ID from auth system
    const role = 'user'; // Determine the role dynamically
    this.patientService.getAppointments(userId, role).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.appointments && response.appointments.length) {
          this.appointment = response.appointments.find((appt: any) => appt.id === this.appointmentId);
          if (this.appointment) {
            this.totalAmount = this.appointment.bill_amount;
          }
        }
      },
      (error) => console.error('Error fetching appointment details', error)
    );
  }
  

    // Define the updateAppointmentStatus method
    updateAppointmentStatus(appointmentId: number | null, status: string): Promise<void> {
      return new Promise((resolve, reject) => {
        if (appointmentId) {
          this.patientService.updateAppointmentStatus(appointmentId, status).subscribe(
            (response) => {
              console.log('Appointment status updated successfully:', response);
              resolve();
            },
            (error) => {
              console.error('Error updating appointment status:', error);
              reject(error);
            }
          );
        }
      });
    }
    
  // Cancel method to redirect to the appointments component
  cancel(): void {
    this.router.navigate(['/appointments']); // Redirect to appointments page
  }
}
