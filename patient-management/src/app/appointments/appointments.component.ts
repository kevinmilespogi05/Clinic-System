import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { PatientService } from '../services/patient.service';
import {
  startOfDay,
  endOfDay,
  addDays,
  isSameDay,
  isSameMonth,
} from 'date-fns';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CalendarModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
  providers: [PatientService],
})
export class AppointmentsComponent implements OnInit {
  viewDate: Date = new Date();
  events: any[] = [];
  activeDayIsOpen: boolean = false;
  selectedSlot: any = null;
  showBookingModal: boolean = false;
  showPaymentModal: boolean = false;
  showModal: boolean = false;
  appointmentDescription: string = '';
  selectedService: 'Consultation' | 'Surgery' | 'Therapy' = 'Consultation';
  billAmount: number = 0;
  creditCardNumber: string = '';
  cardholderName: string = '';
  expiryDate: string = '';
  cvv: string = '';
  billingAddress: string = '';
  inputAmount: number = 0;
  appointments: any[] = [];
  cancellationReason: string = '';
  appointmentToCancel: any = null;

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
            this.events = response.appointments.map((appointment: any) => ({
              start: new Date(appointment.date + ' ' + appointment.time),
              title: appointment.service,
              meta: {
                appointment,
              },
            }));
            this.appointments = response.appointments;
          }
        },
        (error) => console.error('Error fetching appointments:', error)
      );
    }
  }

  dayClicked({ date, events }: { date: Date; events: any[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
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
      Consultation: 150,
      Surgery: 75000,
      Therapy: 10000,
    };

    // Ensure proper casing for service key lookup
    const formattedService =
      this.selectedService.charAt(0).toUpperCase() +
      this.selectedService.slice(1).toLowerCase();
    this.billAmount = servicePrices[formattedService] || 0;
  }

  bookAppointment(): void {
    if (!this.appointmentDescription.trim()) {
      Swal.fire(
        'Error',
        'Please enter a description for the appointment.',
        'error'
      );
      return;
    }

    const userId = localStorage.getItem('userId');
    if (userId) {
      this.patientService
        .bookAppointment({
          user_id: Number(userId),
          day: this.selectedSlot.day,
          time: this.selectedSlot.time,
          date: this.selectedSlot.date,
          description: this.appointmentDescription,
          service: this.selectedService,
          status: 'booked',
        })
        .subscribe(
          (response) => {
            if (response.error) {
              Swal.fire('Error', response.error, 'error');
            } else {
              Swal.fire(
                'Success',
                'Appointment successfully booked.',
                'success'
              );
              this.fetchAppointments();
              this.closeBookingModal();
            }
          },
          (error) =>
            Swal.fire(
              'Error',
              'Failed to book appointment. Please try again.',
              'error'
            )
        );
    }
  }

  isSlotOccupied(slot: any): boolean {
    return this.events.some(
      (event) =>
        event.start.toDateString() === new Date(slot.date).toDateString() &&
        event.start.getHours() ===
          new Date(slot.date + ' ' + slot.time).getHours()
    );
  }

  getAvailableSlots(date: Date): any[] {
    const slots = [
      { time: '10:00 AM', date },
      { time: '11:00 AM', date },
      { time: '12:00 PM', date },
      { time: '01:00 PM', date },
    ];
    return slots.filter((slot) => !this.isSlotOccupied(slot));
  }

  openPaymentModal(appointment: any): void {
    this.showPaymentModal = true;
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
  }

  processPayment(event: Event): void {
    event.preventDefault();
    // Implement payment processing logic here
    Swal.fire('Success', 'Payment processed successfully.', 'success');
    this.closePaymentModal();
  }

  openCancelModal(appointmentId: number): void {
    this.appointmentToCancel = appointmentId;
    this.showModal = true;
  }

  closeCancelModal(): void {
    this.showModal = false;
    this.cancellationReason = '';
    this.appointmentToCancel = null;
  }

  cancelAppointment(appointmentId: number): void {
    // Implement cancellation logic here
    Swal.fire('Success', 'Appointment cancelled successfully.', 'success');
    this.closeCancelModal();
    this.fetchAppointments();
  }

  deleteAppointment(appointmentId: number): void {
    // Implement deletion logic here
    Swal.fire('Success', 'Appointment deleted successfully.', 'success');
    this.fetchAppointments();
  }

  handleRefundOrReschedule(appointment: any): void {
    // Implement refund or reschedule logic here
    Swal.fire(
      'Success',
      'Refund or reschedule processed successfully.',
      'success'
    );
    this.fetchAppointments();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'booked':
        return 'status-booked';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getPaymentStatusClass(paymentStatus: string): string {
    switch (paymentStatus) {
      case 'paid':
        return 'payment-paid';
      case 'pending':
        return 'payment-pending';
      case 'unpaid':
        return 'payment-unpaid';
      default:
        return '';
    }
  }
}
