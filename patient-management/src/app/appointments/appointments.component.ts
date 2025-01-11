import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../services/patient.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];
  timezoneOffset: number = new Date().getTimezoneOffset() * 60000; // Get local timezone offset in milliseconds
  currentDate: Date = new Date(2025, 0, 1); // Explicitly set to January 1, 2025
  currentMonth: number = this.currentDate.getMonth(); // Initialize to January (0-indexed)
  currentYear: number = this.currentDate.getFullYear(); // Initialize to 2025
  selectedDate: Date = new Date(
    this.currentYear,
    this.currentMonth,
    this.currentDate.getDate()
  ); // Correctly set to January 1, 2025
  selectedTime: string = ''; // Default time

  selectedAppointment: any;
  showModal: boolean = false;
  showBookingModal: boolean = false;
  showPaymentModal: boolean = false;
  cancellationReason: string = '';
  otherReason: string = '';
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
  showRescheduleModal: boolean = false;
  appointmentToReschedule: any = null;
  availableSlots: string[] = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM']; // Available time slots

  constructor(private patientService: PatientService, private router: Router) {} // Inject Router

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

    if (userId && role) {
      // Ensure selectedDate is correctly set before making the API call
      this.selectedDate = new Date(this.currentYear, this.currentMonth, 1);

      this.patientService.getAppointments(Number(userId), role).subscribe(
        (response) => {
          if (response.appointments) {
            this.appointments = response.appointments.map(
              (appointment: any) => {
                console.log('Appointment Date:', appointment.date); // Check the format
                const appointmentDate = new Date(appointment.date);
                if (isNaN(appointmentDate.getTime())) {
                  console.error('Invalid date:', appointment.date);
                }
                const formattedDate =
                  appointmentDate.toLocaleDateString('en-US');
                const dayOfWeek = appointmentDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                });
                return { ...appointment, date: formattedDate, day: dayOfWeek };
              }
            );
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
    this.currentDate = new Date(this.currentYear, this.currentMonth, 1); // Update currentDate
    this.selectedDate = this.currentDate; // Keep selectedDate consistent with currentDate
  }

  openBookingModal(date: Date): void {
    this.selectedDate = date;
    this.fetchAvailableSlots(date);
    this.showBookingModal = true;
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
    this.appointmentDescription = '';
    this.selectedTime = '';
  }

  fetchAvailableSlots(date: Date): void {
    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    this.patientService.getAvailableSlots(formattedDate).subscribe(
      (response) => {
        if (response.slots) {
          this.availableSlots = response.slots;
        } else {
          this.availableSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM'];
        }
      },
      (error) => {
        console.error('Error fetching available slots:', error);
        this.availableSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM'];
      }
    );
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

    if (!this.selectedTime) {
      Swal.fire(
        'Error',
        'Please select a time slot for the appointment.',
        'error'
      );
      return;
    }

    const userId = localStorage.getItem('userId');
    if (userId) {
      const appointmentDay = this.selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
      });
      const formattedDate = this.selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD format

      this.patientService
        .bookAppointment({
          user_id: Number(userId),
          date: formattedDate, // Send the correctly formatted date
          time: this.selectedTime, // Add time to the request
          day: appointmentDay, // Add day to the request
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

  // Method to check if an appointment exists on the selected date
  isDateBooked(date: Date): boolean {
    const appointmentsOnDate = this.appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.toLocaleDateString() === date.toLocaleDateString();
    });
    return appointmentsOnDate.length >= this.availableSlots.length;
  }

  // Implementing the daysInMonth() method
  daysInMonth(): Date[] {
    const days: Date[] = [];
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0); // Last day of the month
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1); // First day of the month

    for (
      let date = firstDayOfMonth;
      date <= lastDayOfMonth;
      date.setDate(date.getDate() + 1)
    ) {
      days.push(new Date(date)); // Push each day of the month
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

  cancellationReasons: string[] = [
    'Scheduling conflict',
    'Health issue',
    'Changed mind',
    'Found alternative provider',
    'Other',
  ];

  openCancelModal(appointmentId: number): void {
    this.appointmentToCancel = appointmentId;
    this.showModal = true;
  }

  closeCancelModal(): void {
    this.showModal = false;
    this.cancellationReason = ''; // Reset reason on modal close
    this.otherReason = ''; // Reset custom reason on modal close
  }

  onReasonChange(): void {
    // Clear the custom reason input when a non-'Other' reason is selected
    if (this.cancellationReason !== 'Other') {
      this.otherReason = '';
    }
  }

  cancelAppointment(appointmentId: number | null): void {
    if (appointmentId === null) {
      Swal.fire('Error', 'Invalid appointment ID.', 'error');
      return;
    }

    if (this.cancellationReason.trim() === '') {
      Swal.fire('Error', 'Please select a cancellation reason.', 'error');
      return;
    }

    // Use the custom reason if 'Other' is selected
    const finalReason =
      this.cancellationReason === 'Other' && this.otherReason.trim() !== ''
        ? this.otherReason.trim()
        : this.cancellationReason;

    if (this.cancellationReason === 'Other' && finalReason === '') {
      Swal.fire(
        'Error',
        'Please provide a custom cancellation reason.',
        'error'
      );
      return;
    }

    this.patientService
      .cancelAppointmentWithReason(appointmentId, finalReason)
      .subscribe(
        (response) => {
          if (response.message === 'Appointment cancelled successfully.') {
            Swal.fire(
              'Success',
              'Appointment cancelled successfully',
              'success'
            );
            this.fetchAppointments();
            this.closeCancelModal();
          } else {
            Swal.fire('Error', 'Failed to cancel appointment', 'error');
          }
        },
        (error) => {
          Swal.fire(
            'Error',
            'An error occurred while canceling the appointment',
            'error'
          );
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
              Swal.fire(
                'Deleted!',
                'The appointment has been deleted.',
                'success'
              );
              this.fetchAppointments();
            } else {
              Swal.fire(
                'Deleted!',
                'The appointment has been deleted.',
                'success'
              );
            }
          },
          (error) => {
            Swal.fire(
              'Error',
              'An error occurred while deleting the appointment',
              'error'
            );
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

  handleRefund(appointment: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to process the refund for this appointment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Refund',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.processRefund(appointment.id);
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

          // After refund is processed, update the appointment status and delete it
          const appointmentIndex = this.appointments.findIndex(
            (appointment) => appointment.id === appointmentId
          );
          if (appointmentIndex !== -1) {
            this.appointments[appointmentIndex].payment_status = 'failed'; // Update status to failed after refund
            this.appointments[appointmentIndex].refund_status = 'processed'; // Update refund status
          }

          // After processing the refund, you can delete the appointment
          this.deleteAppointment(appointmentId);
        } else {
          Swal.fire(
            'Error',
            response.message || 'Refund failed. Please try again.',
            'error'
          );
        }
      },
      (error) => {
        console.error('Refund error:', error);
        Swal.fire(
          'Error',
          'An error occurred while processing the refund.',
          'error'
        );
      }
    );
  }

  getRefundStatusClass(refundStatus: string): string {
    switch (refundStatus.toLowerCase()) {
      case 'pending':
        return 'refund-pending';
      case 'processed':
        return 'refund-processed';
      case 'failed':
        return 'refund-failed';
      default:
        return '';
    }
  }

  // Separate function to open the reschedule modal
  openRescheduleModal(appointment: any): void {
    this.appointmentToReschedule = appointment;
    this.showRescheduleModal = true; // Show the reschedule modal
  }

  // Close the reschedule modal
  closeRescheduleModal(): void {
    this.showRescheduleModal = false;
    this.appointmentToReschedule = null; // Reset the appointment to reschedule
  }

  // Method to handle rescheduling the appointment
  rescheduleAppointment(newDate: Date, newTime: string): void {
    if (this.appointmentToReschedule) {
      // Adjust the date to UTC+8 (Philippine timezone)
      const adjustedDate = new Date(
        newDate.getTime() - newDate.getTimezoneOffset() * 60000
      );
      const formattedDate = adjustedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

      // Ensure the time is in the correct format (HH:mm:ss)
      const formattedTime = newTime; // Example: '16:00:00'

      const newSlot = {
        date: formattedDate,
        time: formattedTime,
      };

      // Call the service to update the appointment with the new date and time
      this.patientService
        .rescheduleAppointment(this.appointmentToReschedule.id, newSlot)
        .subscribe(
          (response) => {
            Swal.fire(
              'Success',
              'Appointment rescheduled successfully.',
              'success'
            );
            this.fetchAppointments(); // Refresh the appointment list to reflect changes
            this.closeRescheduleModal(); // Close the reschedule modal after rescheduling
          },
          (error) => {
            Swal.fire(
              'Error',
              'An error occurred while rescheduling the appointment.',
              'error'
            );
          }
        );
    } else {
      Swal.fire('Error', 'No appointment selected for rescheduling.', 'error');
    }
  }

  redirectToPayment(appointment: any): void {
    this.router.navigate(['/payment'], {
      queryParams: { appointmentId: appointment.id },
    });
  }
}
