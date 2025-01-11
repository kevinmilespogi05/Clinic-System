import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private baseUrl = 'http://localhost/Clinic-System/clinicapi'; // Base API URL

  constructor(private http: HttpClient) {}

  // Authentication
  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/api/auth/login.php`, { username, password })
      .pipe(catchError(this.handleError));
  }

  // Patient Management
  register(userDetails: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/api/users/register.php`,
      userDetails
    );
  }

  getDashboardData(userId: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/api/dashboard/get_dashboard.php?id=${userId}`
    );
  }

  getProfile(userId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/api/users/get_profile.php?id=${userId}`
    );
  }

  updateProfile(userId: number, updatedData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/users/update_profile.php`, {
      user_id: userId,
      first_name: updatedData.first_name,
      last_name: updatedData.last_name,
      contact_number: updatedData.contact_number,
      date_of_birth: updatedData.date_of_birth,
      medical_history: updatedData.medical_history,
      card_first_name: updatedData.card_first_name,
      card_last_name: updatedData.card_last_name,
      card_number: updatedData.card_number,
      card_expiry: updatedData.card_expiry,
      card_security_code: updatedData.card_security_code,
      billing_address: updatedData.billing_address,
      city: updatedData.city,
      province: updatedData.province,
      billing_postal_code: updatedData.billing_postal_code,
    });
  }

  // Appointments Management
  getAppointments(userId?: number, role?: string): Observable<any> {
    let url = `${this.baseUrl}/api/appointments/get_appointments.php`;
    if (userId && role) {
      url += `?id=${userId}&role=${role}`;
    }
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  updateAppointmentStatus(
    appointmentId: number,
    paymentStatus: string
  ): Observable<any> {
    const url = `${this.baseUrl}/api/appointments/update_status.php`; // Adjust the URL as needed
    const body = {
      appointment_id: appointmentId,
      payment_status: paymentStatus, // Use 'payment_status' instead of 'status'
    };

    return this.http.post<any>(url, body);
  }

  // Book Appointment
  bookAppointment(data: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/api/appointments/book.php`, data)
      .pipe(catchError(this.handleError));
  }

  // Cancel Appointment with Reason
  cancelAppointmentWithReason(
    appointmentId: number,
    reason: string
  ): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/api/appointments/cancel.php`, {
        appointment_id: appointmentId,
        reason: reason,
      })
      .pipe(catchError(this.handleError));
  }

  // Delete Appointment
  deleteAppointment(appointmentId: number): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/api/appointments/delete_appointment.php`, {
        id: appointmentId,
      })
      .pipe(catchError(this.handleError));
  }

  // Process Payment
  processPayment(paymentDetails: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/api/payment/process_payment.php`, paymentDetails)
      .pipe(catchError(this.handleError));
  }

  // Payment Confirmation (after successful payment)
  confirmPayment(
    appointmentId: number,
    paymentStatus: string
  ): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/api/payment/payment_success.php`, {
        appointment_id: appointmentId,
        payment_status: paymentStatus,
      })
      .pipe(catchError(this.handleError));
  }

  // API call to process refund
  processRefund(appointmentId: number): Observable<any> {
    return this.http
      .post<any>(
        `${this.baseUrl}/api/appointments/refund.php`,
        JSON.stringify({ appointment_id: appointmentId }), // Send data as JSON
        { headers: { 'Content-Type': 'application/json' } } // Set the correct content type
      )
      .pipe(catchError(this.handleError));
  }

  // API call to reschedule appointment (assuming user selects a new slot)
  rescheduleAppointment(appointmentId: number, newSlot: any): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/api/appointments/reschedule.php`, {
        appointment_id: appointmentId,
        new_slot: newSlot,
      })
      .pipe(catchError(this.handleError));
  }

  checkAppointmentConflict(userId: number, date: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/api/appointments/checkConflict.php`,
      {
        user_id: userId,
        date: date,
      }
    );
  }

  // Get Available Slots for a Date
  getAvailableSlots(date: string): Observable<any> {
    return this.http
      .get<any>(
        `${this.baseUrl}/api/appointments/get_available_slots.php?date=${date}`
      )
      .pipe(catchError(this.handleError));
  }

  // Combined Stats (Billing + Appointments)
  getCombinedStats(): Observable<any> {
    return new Observable((observer) => {
      // Fetch appointments stats
      this.http
        .get<any>(`${this.baseUrl}/api/appointments/stats.php`)
        .pipe(catchError(this.handleError))
        .subscribe((appointmentsStats) => {
          // Fetch billing stats
          this.http
            .get<any>(`${this.baseUrl}/api/billing/stats.php`)
            .pipe(catchError(this.handleError))
            .subscribe((billingStats) => {
              // Combine both stats
              const combinedStats = {
                ...appointmentsStats.data,
                ...billingStats.data,
              };
              observer.next(combinedStats);
              observer.complete();
            });
        });
    });
  }

  // Billing Management
  getInvoicesByUserId(userId: number): Observable<any[]> {
    return this.http
      .post<any[]>(`${this.baseUrl}/api/billing/get_user_invoices.php`, {
        userId,
      })
      .pipe(catchError(this.handleError));
  }

  getInvoices(): Observable<any[]> {
    return this.http
      .post<any[]>(`${this.baseUrl}/api/billing/read_user.php`, { user_id: 1 })
      .pipe(catchError(this.handleError));
  }

  createInvoice(invoice: any): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/api/billing/create.php`, invoice)
      .pipe(catchError(this.handleError));
  }

  updateInvoiceStatus(invoiceId: number, status: string): Observable<any> {
    return this.http
      .put<any>(`${this.baseUrl}/api/billing/update_payment.php`, {
        invoice_id: invoiceId,
        status,
      })
      .pipe(catchError(this.handleError));
  }

  updateInvoiceDescription(
    invoiceId: number,
    description: string
  ): Observable<any> {
    return this.http
      .put<any>(`${this.baseUrl}/api/billing/update_description.php`, {
        invoice_id: invoiceId,
        description,
      })
      .pipe(catchError(this.handleError));
  }

  // Insurance Management
  getInsuranceClaims(userId: number, isAdmin: number = 0): Observable<any[]> {
    return this.http
      .get<any[]>(
        `${this.baseUrl}/api/insurance/read_all.php?user_id=${userId}&is_admin=${isAdmin}`
      )
      .pipe(catchError(this.handleError));
  }

  createInsuranceClaim(claim: any): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/api/insurance/create.php`, claim)
      .pipe(catchError(this.handleError));
  }

  updateInsuranceClaim(claim: any): Observable<any> {
    return this.http
      .put<any>(`${this.baseUrl}/api/insurance/update_status.php`, claim)
      .pipe(catchError(this.handleError));
  }

  getInsuranceStats(): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/api/insurance/stats.php`)
      .pipe(catchError(this.handleError));
  }

  // Error Handler
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }
}
