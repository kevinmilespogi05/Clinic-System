import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private readonly baseUrl = 'http://localhost/Clinic-System/clinicapi'; // Base API URL

  constructor(private http: HttpClient) {}

  /** ======================= Authentication ======================== */
  login(username: string, password: string): Observable<any> {
    return this.postRequest('api/auth/login.php', { username, password });
  }

  /** ======================= Patient Management ==================== */
  register(data: {
    username: string;
    password: string;
    name: string;
    contact_number: string;
    date_of_birth: string;
    medicalHistory: string;
  }): Observable<any> {
    return this.postRequest('api/users/register.php', data);
  }

  getDashboardData(userId: number): Observable<any> {
    return this.getRequest(`api/dashboard/get_dashboard.php?id=${userId}`);
  }

  getProfile(userId: number): Observable<any> {
    return this.getRequest(`api/users/get_profile.php?id=${userId}`);
  }

  updateProfile(userId: number, updatedData: any): Observable<any> {
    return this.postRequest('api/users/update_profile.php', {
      user_id: userId,
      ...updatedData,
    });
  }

  /** ======================= Appointments Management ================= */
  getAppointments(userId?: number): Observable<any> {
    const url = userId ? `api/appointments/get_appointments.php?id=${userId}` : 'api/appointments/get_appointments.php';
    return this.getRequest(url);
  }

  bookAppointment(data: any): Observable<any> {
    return this.postRequest('api/appointments/create.php', data);
  }

  cancelAppointment(appointmentId: number): Observable<any> {
    return this.postRequest('api/appointments/cancel.php', { appointment_id: appointmentId });
  }

  updateAppointmentStatus(appointmentId: number, status: string): Observable<any> {
    return this.postRequest('api/appointments/update_status.php', {
      id: appointmentId,
      status,
    });
  }

  // New methods for appointment approval, decline, and update
  approveAppointment(appointmentId: number): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/api/appointments/approve.php`, { id: appointmentId })
      .pipe(catchError(this.handleError));
  }

  declineAppointment(appointmentId: number): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/api/appointments/decline.php`, { id: appointmentId })
      .pipe(catchError(this.handleError));
  }

  updateAppointment(appointmentData: any): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/api/appointments/update.php`, appointmentData)
      .pipe(catchError(this.handleError));
  }

  deleteAppointment(appointmentId: number): Observable<any> {
    return this.postRequest('api/appointments/delete_appointment.php', { id: appointmentId });
  }

  /** ======================= Combined Stats (Billing & Appointments) ================= */
  getCombinedStats(): Observable<any> {
    return new Observable((observer) => {
      this.getRequest('api/appointments/stats.php').subscribe(
        (appointmentsStats) => {
          this.getRequest('api/billing/stats.php').subscribe(
            (billingStats) => {
              const combinedStats = { ...appointmentsStats.data, ...billingStats.data };
              observer.next(combinedStats);
              observer.complete();
            },
            (error) => observer.error(error)
          );
        },
        (error) => observer.error(error)
      );
    });
  }

  /** ======================= Billing Management ================= */
  getInvoices(): Observable<any[]> {
    return this.postRequest('api/billing/read_user.php', { user_id: 1 });
  }

  createInvoice(invoice: any): Observable<any> {
    return this.postRequest('api/billing/create.php', invoice);
  }

  updateInvoiceStatus(invoiceId: number, status: string): Observable<any> {
    return this.putRequest('api/billing/update_payment.php', {
      id: invoiceId,
      status,
    });
  }

  updateInvoiceDescription(invoiceId: number, description: string): Observable<any> {
    return this.putRequest('api/billing/update_description.php', {
      invoice_id: invoiceId,
      description,
    });
  }

  /** ======================= Insurance Management ================= */
  getInsuranceClaims(userId: number, isAdmin: number = 0): Observable<any[]> {
    return this.getRequest(`api/insurance/read_all.php?user_id=${userId}&is_admin=${isAdmin}`);
  }

  createInsuranceClaim(claim: any): Observable<any> {
    return this.postRequest('api/insurance/create.php', claim);
  }

  updateInsuranceClaim(claim: any): Observable<any> {
    return this.putRequest('api/insurance/update_status.php', claim);
  }

  getInsuranceStats(): Observable<any> {
    return this.getRequest('api/insurance/stats.php');
  }

  /** ======================= Utility Methods ====================== */
  private getRequest(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${endpoint}`).pipe(catchError(this.handleError));
  }

  private postRequest(endpoint: string, payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${endpoint}`, payload).pipe(catchError(this.handleError));
  }

  private putRequest(endpoint: string, payload: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${endpoint}`, payload).pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}
