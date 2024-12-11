import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  private baseUrl = 'http://localhost/Clinic-System/clinicapi'; // Base API URL

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/api/auth/login.php`, { username, password })
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

  // billing.service.ts
getInsuranceClaims(userId: number, isAdmin: number): Observable<any[]> {
  const url = `${this.baseUrl}/api/insurance/read_all.php?user_id=${userId}&is_admin=${isAdmin}`;
  return this.http.get<any[]>(url).pipe(catchError(this.handleError));
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

  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(error);
  }
}
