import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private baseUrl = 'http://localhost/Clinic-System/clinicapi'; // Base API URL

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/auth/login.php`, { username, password });
  }

  register(username: string, password: string, name: string, contact_number: string, date_of_birth: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/users/register.php`, {
      username,
      password,
      name,
      contact_number,
      date_of_birth
    });
  }

  // Error handler function for HTTP requests
  private handleError(error: any): Observable<never> {
    // Log the error to the console for debugging
    console.error('An error occurred:', error);

    // Return a user-friendly error message or rethrow the error
    return throwError('Something went wrong while fetching appointments. Please try again later.');
  }
}
