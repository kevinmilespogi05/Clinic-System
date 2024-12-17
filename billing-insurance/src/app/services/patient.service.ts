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
  register(
    username: string,
    password: string,
    name: string,
    contact_number: string,
    date_of_birth: string,
    medicalHistory: string
  ): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/users/register.php`, {
      username,
      password,
      name,
      contact_number,
      date_of_birth,
      medicalHistory,
    });
  }

  getDashboardData(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/dashboard/get_dashboard.php?id=${userId}`);
  }

  getProfile(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/users/get_profile.php?id=${userId}`);
  }

  updateProfile(userId: number, updatedData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/users/update_profile.php`, {
      user_id: userId,
      name: updatedData.name,
      contact_number: updatedData.contact_number,
      date_of_birth: updatedData.date_of_birth,
      medical_history: updatedData.medical_history,
    });
  }

  // Appointments Management
  getAppointments(userId?: number): Observable<any> {
    let url = `${this.baseUrl}/api/appointments/get_appointments.php`;
    if (userId) {
      url += `?id=${userId}`;
    }
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  bookAppointment(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/appointments/create.php`, data);
  }

  cancelAppointment(appointmentId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/appointments/cancel.php`, { appointment_id: appointmentId });
  }

  updateAppointmentStatus(appointmentId: number, status: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/appointments/update_status.php`, {
      id: appointmentId,
      status,
    }).pipe(catchError(this.handleError));
  }

  deleteAppointment(appointmentId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/appointments/delete_appointment.php`, {
      id: appointmentId,
    }).pipe(catchError(this.handleError));
  }

  // Combined Stats (Billing + Appointments)
  getCombinedStats(): Observable<any> {
    return new Observable((observer) => {
      // Fetch appointments stats
      this.http.get<any>(`${this.baseUrl}/api/appointments/stats.php`).pipe(
        catchError(this.handleError)
      ).subscribe((appointmentsStats) => {
        // Fetch billing stats
        this.http.get<any>(`${this.baseUrl}/api/billing/stats.php`).pipe(
          catchError(this.handleError)
        ).subscribe((billingStats) => {
          // Combine both stats
          const combinedStats = {
            ...appointmentsStats.data,
            ...billingStats.data
          };
          observer.next(combinedStats);
          observer.complete();
        });
      });
    });
  }

  // Billing Management
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
        id: invoiceId,
        status, // 'paid' or 'unpaid'
      })
      .pipe(catchError(this.handleError));
  }

  updateInvoiceDescription(invoiceId: number, description: string): Observable<any> {
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
      .get<any[]>(`${this.baseUrl}/api/insurance/read_all.php?user_id=${userId}&is_admin=${isAdmin}`)
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
    return this.http.get<any>(`${this.baseUrl}/api/insurance/stats.php`).pipe(catchError(this.handleError));
  }

  // Error Handler
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }
}