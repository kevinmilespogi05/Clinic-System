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
  selectedDate: Date = new Date(2025, 0, 1); // January 1, 2025
  currentMonth: number = this.selectedDate.getMonth(); // Current month
  currentYear: number = this.selectedDate.getFullYear(); // Current year
  selectedAppointment: any;
  showModal: boolean = false;
  showBookingModal: boolean = false;
  showPaymentModal: boolean = false;
  cancellationReason: string = '';
  appointmentDescription: string = '';
  appointmentToCancel: number | null = null;
  selectedSlot: any = null;
  selectedService: 'Consultation' | 'Surgery' | 'Therapy' = 'Consultation';
  billAmount: number = 0;
  creditCardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';
  cardholderName: string = '';
  billingAddress: string = '';
  appointmentToPay: any = null;
  inputAmount: number | null = null;

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

  changeMonth(direction: string): void {
    if (direction === 'next') {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    } else if (direction === 'prev') {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    }
    this.selectedDate = new Date(this.currentYear, this.currentMonth);  // Set new selected date
  }
  

  openBookingModal(appointment: any): void {
    // Your existing logic for opening the booking modal and populating it with appointment data.
    this.selectedAppointment = appointment; // Example: store the appointment to reschedule.
    this.showBookingModal = true; // Open the modal
  }
  

  closeBookingModal(): void {
    this.showBookingModal = false;
    this.appointmentDescription = '';
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
        date: this.selectedDate.toISOString(),
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

  // Method to check if an appointment exists on the selected date
  isDateBooked(date: Date): boolean {
    return this.appointments.some(
      (appointment) => new Date(appointment.date).toLocaleDateString() === date.toLocaleDateString() && appointment.status === 'booked'
    );
  }

  // Implementing the daysInMonth() method
  daysInMonth(): Date[] {
    const days: Date[] = [];
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    
    for (let date = firstDayOfMonth; date <= lastDayOfMonth; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }
    return days;
  }

  calculateBill(): void {
    switch (this.selectedService) {
      case 'Consultation':
        this.billAmount = 500; // Example amount for consultation
        break;
      case 'Surgery':
        this.billAmount = 5000; // Example amount for surgery
        break;
      case 'Therapy':
        this.billAmount = 1500; // Example amount for therapy
        break;
      default:
        this.billAmount = 0;
        break;
    }
  }
  
  openPaymentModal(appointment: any): void {
    this.appointmentToPay = appointment;
    this.selectedService = appointment.service;
    this.showPaymentModal = true;
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.creditCardNumber = '';
    this.expiryDate = '';
    this.cvv = '';
    this.inputAmount = null;
  }

  processPayment(event: Event): void {
    event.preventDefault();
  
    if (this.inputAmount > this.billAmount) {
      Swal.fire('Error', `Amount cannot exceed $${this.billAmount}.`, 'error');
      return;
    }
  
    const amountToPay = this.inputAmount || this.billAmount;
  
    if (!this.creditCardNumber || !this.expiryDate || !this.cvv || !this.cardholderName || !this.billingAddress) {
      Swal.fire('Error', 'Please complete all the payment fields.', 'error');
      return;
    }
  
    const paymentDetails = {
      user_id: this.appointmentToPay.user_id,
      appointment_id: this.appointmentToPay.id,
      amount: amountToPay,
      payment_method: 'credit card',
    };
  
    this.patientService.processPayment(paymentDetails).subscribe(
      (response) => {
        if (response.success) {
          Swal.fire('Success', 'Payment successful!', 'success');
          this.appointmentToPay.payment_status = 'paid';  // Update payment status
          this.fetchAppointments();
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

  cancelAppointment(appointmentId: number | null): void {
    if (appointmentId === null) {
      Swal.fire('Error', 'Invalid appointment ID.', 'error');
      return;
    }
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
              Swal.fire('Deleted!', 'The appointment has been deleted.', 'success');
            }
          },
          (error) => {
            Swal.fire('Error', 'An error occurred while deleting the appointment', 'error');
          }
        );
      }
    });
  }

  getPaymentStatusClass(paymentStatus: string): string {
    if (!paymentStatus) {
      return ''; // Return an empty string if paymentStatus is undefined or null
    }
  
    switch (paymentStatus.toLowerCase()) {
      case 'pending':
        return 'payment-pending';
      case 'paid':
        return 'payment-paid';
      case 'failed':
        return 'payment-failed';
      default:
        return '';
    }
  }

  handleRefundOrReschedule(appointment: any): void {
    Swal.fire({
      title: 'Choose an option',
      text: 'Would you like to refund or reschedule the appointment?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Refund',
      cancelButtonText: 'Reschedule',
    }).then((result) => {
      if (result.isConfirmed) {
        this.processRefund(appointment.id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.openBookingModal(appointment); // Reschedule logic can be handled directly here
      }
    });
  }
  
  processRefund(appointmentId: number): void {
    // Check if appointmentId is valid
    if (!appointmentId) {
      Swal.fire('Error', 'Invalid Appointment ID.', 'error');
      return;
    }
  
    this.patientService.processRefund(appointmentId).subscribe(
      (response) => {
        if (response.success) {
          Swal.fire('Success', 'Refund successfully processed!', 'success');
          this.fetchAppointments(); // Refresh the appointment list
  
          // After refund is processed, hide the refund button and show delete button
          const appointment = this.appointments.find(appointment => appointment.id === appointmentId);
          if (appointment) {
            appointment.refundProcessed = true; // Set the refund status
          }
        } else {
          Swal.fire('Error', response.message || 'Refund failed. Please try again.', 'error');
        }
      },
      (error) => {
        console.error('Refund error:', error);
        Swal.fire('Error', 'An error occurred while processing the refund.', 'error');
      }
    );
  }  
}