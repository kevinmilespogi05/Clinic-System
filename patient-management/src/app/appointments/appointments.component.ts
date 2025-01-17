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
  timezoneOffset: number = new Date().getTimezoneOffset() * 60000;
  currentDate: Date = new Date(2025, 0, 1);
  currentMonth: number = this.currentDate.getMonth();
  currentYear: number = this.currentDate.getFullYear();
  selectedDate: Date = new Date(
    this.currentYear,
    this.currentMonth,
    this.currentDate.getDate()
  );
  selectedTime: string = '';

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
 availableSlots: string[] = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
 rescheduleCurrentMonth: number = this.currentDate.getMonth();
 rescheduleCurrentYear: number = this.currentDate.getFullYear();
 rescheduleSelectedDate: Date = new Date(this.rescheduleCurrentYear, this.rescheduleCurrentMonth, this.currentDate.getDate());


  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

    if (userId && role) {
      this.selectedDate = new Date(this.currentYear, this.currentMonth, 1);

      this.patientService.getAppointments(Number(userId), role).subscribe(
        (response) => {
          if (response.appointments) {
            this.appointments = response.appointments.map(
              (appointment: any) => {
                console.log('Appointment Date:', appointment.date);
                const appointmentDate = new Date(appointment.date);
                if (isNaN(appointmentDate.getTime())) {
                  console.error('Invalid date:', appointment.date);
                }
                const formattedDate =
                  appointmentDate.toLocaleDateString('en-US');
                const dayOfWeek = appointmentDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                });
                return {
                  ...appointment,
                  date: formattedDate,
                  day: dayOfWeek,
                  time: appointment.time,
                };
              }
            );
          }
        },
        (error) => console.error('Error fetching appointments:', error)
      );
    }
  }

  formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12;
    const displayHours = formattedHours ? formattedHours : 12;
    const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${displayHours}:${displayMinutes} ${ampm}`;
  }

  formatTimeFromString(timeStr: string): string {
    const [time, modifier] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    let hoursIn24 = hours;
    if (modifier === 'PM' && hours !== 12) {
      hoursIn24 += 12;
    } else if (modifier === 'AM' && hours === 12) {
      hoursIn24 = 0;
    }

    const date = new Date(1970, 0, 1, hoursIn24, minutes);

    return this.formatTime(date);
  }

  changeMonth(direction: string, context: 'main' | 'reschedule'): void {
    if (context === 'main') {
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
      this.currentDate = new Date(this.currentYear, this.currentMonth, 1);
      this.selectedDate = this.currentDate;
    } else if (context === 'reschedule') {
      if (direction === 'next') {
        if (this.rescheduleCurrentMonth === 11) {
          this.rescheduleCurrentMonth = 0;
          this.rescheduleCurrentYear++;
        } else {
          this.rescheduleCurrentMonth++;
        }
      } else if (direction === 'prev') {
        if (this.rescheduleCurrentMonth === 0) {
          this.rescheduleCurrentMonth = 11;
          this.rescheduleCurrentYear--;
        } else {
          this.rescheduleCurrentMonth--;
        }
      }
      this.rescheduleSelectedDate = new Date(this.rescheduleCurrentYear, this.rescheduleCurrentMonth, 1);
    }
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
    const formattedDate = date.toISOString().split('T')[0];
    this.patientService.getAvailableSlots(formattedDate).subscribe(
      (response) => {
        if (response.slots) {
          this.availableSlots = response.slots.map((slot) => this.formatTimeFromString(slot));
        } else {
          // Default time slots if no data is returned
          this.availableSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
        }
      },
      (error) => {
        console.error('Error fetching available slots:', error);
        this.availableSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
      }
    );
  }
  

  bookAppointment(): void {
    if (!this.appointmentDescription.trim()) {
      Swal.fire('Error', 'Please enter a description for the appointment.', 'error');
      return;
    }
  
    if (!this.selectedTime) {
      Swal.fire('Error', 'Please select a time slot for the appointment.', 'error');
      return;
    }
  
    const userId = localStorage.getItem('userId');
    if (userId) {
      const appointmentDay = this.selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
  
      // Adjust the date for the timezone offset
      const adjustedDate = new Date(this.selectedDate.getTime() - this.timezoneOffset);
  
      // Format the adjusted date
      const formattedDate = adjustedDate.toISOString().split('T')[0];
  
      this.patientService.bookAppointment({
        user_id: Number(userId),
        date: formattedDate,
        time: this.selectedTime,
        day: appointmentDay,
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
  

 isDateInPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to midnight
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0); // Reset time to midnight
  return checkDate <= today; // Disable today and past dates
}


  isDateBooked(date: Date): boolean {
    const appointmentsOnDate = this.appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.toLocaleDateString() === date.toLocaleDateString();
    });
    return appointmentsOnDate.length >= this.availableSlots.length;
  }

  daysInMonth(month: number = this.currentMonth, year: number = this.currentYear): Date[] {
    const days: Date[] = [];
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfMonth = new Date(year, month, 1);
  
    for (
      let date = firstDayOfMonth;
      date <= lastDayOfMonth;
      date.setDate(date.getDate() + 1)
    ) {
      days.push(new Date(date));
    }
    return days;
  }
  

  calculateBill(): void {
    switch (this.selectedService) {
      case 'Consultation':
        this.billAmount = 500;
        break;
      case 'Surgery':
        this.billAmount = 5000;
        break;
      case 'Therapy':
        this.billAmount = 1500;
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
    this.cancellationReason = '';
    this.otherReason = '';
  }

  onReasonChange(): void {
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
      return '';
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
        this.openRescheduleModal(appointment);
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
    if (!appointmentId) {
      Swal.fire('Error', 'Invalid Appointment ID.', 'error');
      return;
    }

    this.patientService.processRefund(appointmentId).subscribe(
      (response) => {
        if (response.success) {
          Swal.fire('Success', 'Refund successfully processed!', 'success');
          this.fetchAppointments();
          const appointmentIndex = this.appointments.findIndex(
            (appointment) => appointment.id === appointmentId
          );
          if (appointmentIndex !== -1) {
            this.appointments[appointmentIndex].payment_status = 'failed';
            this.appointments[appointmentIndex].refund_status = 'processed';
          }

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

  openRescheduleModal(appointment: any): void {
    this.appointmentToReschedule = appointment;
    this.selectedTime = appointment.time;
    this.showRescheduleModal = true;
    this.selectedDate = null; // Reset selected date when closing the modal
  }

  closeRescheduleModal(): void {
    this.showRescheduleModal = false;
    this.appointmentToReschedule = null;
    this.selectedTime = '';
    this.selectedDate = null; // Reset selected date when closing the modal
  }
  

  rescheduleAppointment(newDate: Date, newTime: string): void {
    if (this.appointmentToReschedule) {
      if (!newTime) {
        Swal.fire('Error', 'Please select a time for the rescheduled appointment.', 'error');
        return;
      }
  
      // Validate the reschedule date
      if (!this.isRescheduleValid(newDate, this.appointmentToReschedule.date)) {
        Swal.fire(
          'Error',
          'You can only reschedule your appointment for next week or next month.',
          'error'
        );
        return;
      }
  
      const adjustedDate = new Date(newDate.getTime() - newDate.getTimezoneOffset() * 60000);
      const formattedDate = adjustedDate.toISOString().split('T')[0];
      const formattedTime = newTime;
  
      console.log('Rescheduled Date:', formattedDate, 'Time:', formattedTime);
  
      const newSlot = { date: formattedDate, time: formattedTime };
  
      this.patientService.rescheduleAppointment(this.appointmentToReschedule.id, newSlot).subscribe(
        (response) => {
          if (response.success) {
            Swal.fire('Success', 'Appointment rescheduled successfully.', 'success');
            this.fetchAppointments();
            this.closeRescheduleModal();
          } else {
            Swal.fire('Error', 'An error occurred while rescheduling the appointment.', 'error');
          }
        },
        (error) => {
          console.error('Error rescheduling appointment:', error);
          Swal.fire('Error', 'An error occurred while rescheduling the appointment.', 'error');
        }
      );
    } else {
      Swal.fire('Error', 'No appointment selected for rescheduling.', 'error');
    }
  }
  

  // Method to handle date selection
selectDate(day: Date): void {
  this.selectedDate = day;
}

// Method to check if the date is selected
isSelected(day: Date): boolean {
  return this.selectedDate && this.selectedDate.getTime() === day.getTime();
}

// Method to check if the selected date is valid for rescheduling (next week or next month)
isRescheduleValid(selectedDate: Date, originalDate: Date): boolean {
  const currentDate = new Date();
  const selectedDateObj = new Date(selectedDate);
  const originalDateObj = new Date(originalDate);

  // Calculate the date range (next week or next month)
  const minRescheduleDate = new Date(originalDateObj);
  minRescheduleDate.setDate(originalDateObj.getDate() + 7); // next week

  const maxRescheduleDate = new Date(originalDateObj);
  maxRescheduleDate.setMonth(originalDateObj.getMonth() + 1); // next month

  // Check if the selected date is within the allowed range
  return selectedDateObj >= minRescheduleDate && selectedDateObj <= maxRescheduleDate;
}



  redirectToPayment(appointment: any): void {
    this.router.navigate(['/payment'], {
      queryParams: { appointmentId: appointment.id },
    });
  }
}
