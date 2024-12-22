import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../services/patient.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];
  appointmentSlots = [
    { day: 'Monday', time: '10:00 AM - 11:00 AM', date: '2024-12-16' },
    { day: 'Monday', time: '11:00 AM - 12:00 PM', date: '2024-12-16' },
    { day: 'Tuesday', time: '10:00 AM - 11:00 AM', date: '2024-12-17' },
    { day: 'Tuesday', time: '11:00 AM - 12:00 PM', date: '2024-12-17' },
    { day: 'Wednesday', time: '10:00 AM - 11:00 AM', date: '2024-12-18' },
    { day: 'Wednesday', time: '11:00 AM - 12:00 PM', date: '2024-12-18' },
    { day: 'Thursday', time: '10:00 AM - 11:00 AM', date: '2024-12-19' },
    { day: 'Thursday', time: '11:00 AM - 12:00 PM', date: '2024-12-19' },
    { day: 'Friday', time: '10:00 AM - 11:00 AM', date: '2024-12-20' },
    { day: 'Friday', time: '11:00 AM - 12:00 PM', date: '2024-12-20' },
    { day: 'Monday', time: '12:00 PM - 01:00 PM', date: '2024-12-23' },
    { day: 'Tuesday', time: '12:00 PM - 01:00 PM', date: '2024-12-24' },
    { day: 'Wednesday', time: '12:00 PM - 01:00 PM', date: '2024-12-25' },
    { day: 'Thursday', time: '12:00 PM - 01:00 PM', date: '2024-12-26' },
    { day: 'Friday', time: '12:00 PM - 01:00 PM', date: '2024-12-27' },
  ];

  // Variables for modal and payment processing
  showModal: boolean = false;
  showBookingModal: boolean = false;
  showPaymentModal: boolean = false;  // New for payment modal
  cancellationReason: string = '';
  appointmentDescription: string = '';
  appointmentToCancel: number | null = null;
  selectedSlot: any = null;
  selectedService: 'Consultation' | 'Surgery' | 'Therapy' = 'Consultation';
  billAmount: number = 0;

  // Payment form variables
  creditCardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';
  cardholderName: string = '';  // New for cardholder name
  billingAddress: string = '';  // New for billing address
  appointmentToPay: any = null;  // Store appointment to pay

  // New variable for input amount
  inputAmount: number | null = null;  // Store the amount entered by the user

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
  
    if (userId && role) {
      this.patientService.getAppointments(Number(userId), role).subscribe(
        (response) => {
          if (response.appointments) {
            this.appointments = response.appointments.map((appointment: any) => {
              const appointmentDate = new Date(appointment.date);
              const formattedDate = appointmentDate.toLocaleDateString('en-US');
              const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });
              return { ...appointment, date: formattedDate, day: dayOfWeek };
            });
          }
        },
        (error) => console.error('Error fetching appointments:', error)
      );
    }
  }

  openBookingModal(slot: any): void {
    this.selectedSlot = slot;
    this.showBookingModal = true;
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
    this.appointmentDescription = '';
    this.selectedSlot = null;
  }

  calculateBill(): void {
    const servicePrices = {
      Consultation: 50,
      Surgery: 200,
      Therapy: 100,
    };
    this.billAmount = servicePrices[this.selectedService] || 0;
  }

  isSlotOccupied(slot: any): boolean {
    return this.appointments.some(
      (appointment) =>
        appointment.date === slot.date &&
        appointment.time === slot.time &&
        ['booked', 'approved', 'pending'].includes(appointment.status)
    );
  }

  bookAppointment(): void {
    if (!this.appointmentDescription.trim()) {
      Swal.fire('Error', 'Please enter a description for the appointment.', 'error');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (userId) {
      this.patientService.bookAppointment({
        user_id: Number(userId),
        day: this.selectedSlot.day,
        time: this.selectedSlot.time,
        date: this.selectedSlot.date,
        description: this.appointmentDescription,
        service: this.selectedService,
        status: 'booked',
      }).subscribe(
        (response) => {
          if (response.error) {
            Swal.fire('Error', response.error, 'error');
          } else {
            Swal.fire('Success', 'Appointment successfully booked.', 'success');
            this.fetchAppointments();
            this.closeBookingModal();
          }
        },
        (error) => Swal.fire('Error', 'Failed to book appointment. Please try again.', 'error')
      );
    }
  }

  // Open payment modal
  openPaymentModal(appointment: any): void {
    this.appointmentToPay = appointment;  // Store the appointment to be paid
    this.selectedService = appointment.service;  // Set the service type from the appointment
    this.calculateBill();  // Recalculate the bill based on the service
    this.showPaymentModal = true;  // Show the modal
  }

  // Close payment modal
  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.creditCardNumber = '';
    this.expiryDate = '';
    this.cvv = '';
    this.inputAmount = null;  // Reset the input amount
  }

  // Process the payment
  processPayment(event: Event): void {
    event.preventDefault();

    // If no amount is entered, use the calculated bill amount
    const amountToPay = this.inputAmount || this.billAmount;

    // Validate form fields
    if (!this.creditCardNumber || !this.expiryDate || !this.cvv || !this.cardholderName || !this.billingAddress) {
      Swal.fire('Error', 'Please complete all the payment fields.', 'error');
      return;
    }

    const paymentDetails = {
      cardNumber: this.creditCardNumber,
      expiryDate: this.expiryDate,
      cvv: this.cvv,
      cardholderName: this.cardholderName,
      billingAddress: this.billingAddress,
      amount: amountToPay,  // Use the inputAmount or billAmount
    };

    this.patientService.processPayment(paymentDetails).subscribe(
      (response) => {
        if (response.success) {
          Swal.fire('Success', 'Payment successful!', 'success');
          this.appointmentToPay.status = 'paid'; // Update status
          this.closePaymentModal();
        } else {
          Swal.fire('Error', 'Payment failed. Please try again.', 'error');
        }
      },
      (error) => Swal.fire('Error', 'An error occurred while processing the payment.', 'error')
    );
  }

  openCancelModal(appointmentId: number): void {
    this.appointmentToCancel = appointmentId;
    this.showModal = true;
  }

  closeCancelModal(): void {
    this.showModal = false;
    this.cancellationReason = '';
  }

  cancelAppointment(appointmentId: number): void {
    if (this.cancellationReason.trim() === '') {
      Swal.fire('Error', 'Please provide a cancellation reason.', 'error');
      return;
    }

    this.patientService.cancelAppointmentWithReason(appointmentId, this.cancellationReason).subscribe(
      (response) => {
        if (response.message === 'Appointment cancelled successfully.') {
          Swal.fire('Success', 'Appointment cancelled successfully', 'success');
          this.fetchAppointments();
          this.closeCancelModal();
        } else {
          Swal.fire('Error', 'Failed to cancel appointment', 'error');
        }
      },
      (error) => {
        Swal.fire('Error', 'An error occurred while canceling the appointment', 'error');
      }
    );
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  deleteAppointment(appointmentId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the appointment!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.patientService.deleteAppointment(appointmentId).subscribe(
          (response) => {
            if (response.message === 'Appointment deleted successfully') {
              Swal.fire('Deleted!', 'The appointment has been deleted.', 'success');
              this.fetchAppointments();
            } else {
              Swal.fire('Error', 'Failed to delete appointment', 'error');
            }
          },
          (error) => {
            Swal.fire('Error', 'An error occurred while deleting the appointment', 'error');
          }
        );
      }
    });
  }
}
