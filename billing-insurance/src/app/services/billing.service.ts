import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  private apiUrl = 'http://localhost/clinicapi/api/billing';

  constructor(private http: HttpClient) {}

  getInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/read_user.php`);
  }

  createInvoice(invoice: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create.php`, invoice);
  }

  updateInvoice(invoice: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update_payment.php`, invoice);
  }
}
