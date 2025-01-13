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
  availableSlots: string[] = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM']; 

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
            this.appointments = response.appointments.map((appointment: any) => {
              // Combine date and time directly
              const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
  
              if (isNaN(appointmentDateTime.getTime())) {
                console.error('Invalid date/time:', appointment.date, appointment.time);
              }
  
              // No timezone adjustment
              const formattedDate = appointmentDateTime.toLocaleDateString('en-US');
              const dayOfWeek = appointmentDateTime.toLocaleDateString('en-US', { weekday: 'long' });
              const formattedTime = appointmentDateTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });
  
              return {
                ...appointment,
                date: formattedDate,
                day: dayOfWeek,
                time: formattedTime,
              };
            });
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
    this.currentDate = new Date(this.currentYear, this.currentMonth, 1); 
    this.selectedDate = this.currentDate;
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
          this.availableSlots = response.slots.map(slot => this.formatTimeFromString(slot));
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
          date: formattedDate, 
          time: this.selectedTime, 
          day: appointmentDay, 
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


  isDateBooked(date: Date): boolean {
    const appointmentsOnDate = this.appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.toLocaleDateString() === date.toLocaleDateString();
    });
    return appointmentsOnDate.length >= this.availableSlots.length;
  }


  daysInMonth(): Date[] {
    const days: Date[] = [];
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0); 
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1); 

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
        this.billAmount = 150; 
        break;
      case 'Surgery':
        this.billAmount = 75000; 
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
        this.openBookingModal(appointment); 
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
    this.selectedTime = appointment.time; // Pre-select the existing time
    this.showRescheduleModal = true;
}

closeRescheduleModal(): void {
    this.showRescheduleModal = false;
    this.appointmentToReschedule = null;
    this.selectedTime = ''; // Reset the selected time when closing the modal
}

rescheduleAppointment(newDate: Date, newTime: string): void {
    if (this.appointmentToReschedule) {
      if (!newTime) {
        Swal.fire('Error', 'Please select a time for the rescheduled appointment.', 'error');
        return;
      }

      // Adjust the date to account for timezone offset
      const adjustedDate = new Date(newDate.getTime() - newDate.getTimezoneOffset() * 60000);

      // Format the date and time properly
      const formattedDate = adjustedDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      const formattedTime = newTime; // Use the selected time

      // Log for debugging purposes
      console.log('Rescheduled Date:', formattedDate, 'Time:', formattedTime);

      const newSlot = {
        date: formattedDate,
        time: formattedTime,
      };

      // Call the reschedule API with the adjusted slot
      this.patientService
        .rescheduleAppointment(this.appointmentToReschedule.id, newSlot)
        .subscribe(
          (response) => {
            if (response.success) {
              Swal.fire('Success', 'Appointment rescheduled successfully.', 'success');
              this.fetchAppointments(); // Refresh the appointments
              this.closeRescheduleModal(); // Close the modal
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

  
  redirectToPayment(appointment: any): void {
    this.router.navigate(['/payment'], {
      queryParams: { appointmentId: appointment.id },
    });
  }
}
