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

  // User Login
  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/api/auth/login.php`, { username, password })
      .pipe(catchError(this.handleError));
  }

  // User Registration
  register(
    username: string,
    password: string,
    name: string,
    contactNumber: string,
    dateOfBirth: string
  ): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/api/users/register.php`, {
        username,
        password,
        name,
        contact_number: contactNumber,
        date_of_birth: dateOfBirth,
      })
      .pipe(catchError(this.handleError));
  }

  // Get Profile Data
  getProfile(userId: number): Observable<any> {
    const url = `${this.baseUrl}/api/users/get_profile.php`;
    return this.http
      .get<any>(`${url}?id=${userId}`)
      .pipe(catchError(this.handleError));
  }

  // Update Profile
  updateProfile(userId: number, updatedData: any): Observable<any> {
    const url = `${this.baseUrl}/api/users/update_profile.php`;
    return this.http
      .post<any>(url, {
        user_id: userId,
        name: updatedData.name,
        contact_number: updatedData.contact_number,
        date_of_birth: updatedData.date_of_birth,
      })
      .pipe(catchError(this.handleError));
  }

  // Error handler for HTTP requests
  private handleError(error: any): Observable<never> {
    // Log the error details for debugging
    console.error('HTTP Error:', error);

    // Return a user-friendly error message
    const errorMessage =
      error?.error?.message || 'An error occurred. Please try again later.';
    return throwError(() => new Error(errorMessage));
  }
}
