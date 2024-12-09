import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private baseUrl = 'http://localhost/Clinic-System/clinicapi'; // Base API URL

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/auth/login.php`, { username, password });
  }

  register(username: string, password: string, name: string, contact_number: string, date_of_birth: string, medicalHistory: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/users/register.php`, {
      username,
      password,
      name,
      contact_number,
      date_of_birth,
      medicalHistory  // Include medical history in the request
    });
}


  // Get Dashboard Data
  getDashboardData(userId: number): Observable<any> {
    const url = `${this.baseUrl}/api/dashboard/get_dashboard.php`;
    return this.http.get(`${url}?id=${userId}`);
  }

  // Get Appointments (optionally filter by id)
  getAppointments(userId?: number): Observable<any> {
    let url = `${this.baseUrl}/api/appointments/get_appointments.php`;
  
    if (userId) {
      url = `${url}?id=${userId}`;
    }
  
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }
  
   // Update appointment status
updateAppointmentStatus(appointmentId: number, status: string): Observable<any> {
  const url = `${this.baseUrl}/api/appointments/update_status.php`;
  return this.http.post<any>(url, { id: appointmentId, status }).pipe(
    catchError(this.handleError)
  );
}

// Delete appointment
deleteAppointment(appointmentId: number): Observable<any> {
  const url = `${this.baseUrl}/api/appointments/delete_appointment.php`;
  return this.http.post<any>(url, { id: appointmentId }).pipe(
    catchError(this.handleError)
  );
}


  // Book Appointment
  bookAppointment(data: any): Observable<any> {
    const url = `${this.baseUrl}/api/appointments/create.php`; // API endpoint to create the appointment
    return this.http.post(url, data); // Send the data to the backend
  }

  // Cancel Appointment
  cancelAppointment(appointmentId: number): Observable<any> {
    const url = `${this.baseUrl}/api/appointments/cancel.php`;
    const body = { appointment_id: appointmentId };
    return this.http.post(url, body);
  }

  // Fetch Insurance Claims
    getInsuranceClaims(userId: number): Observable<any> {
    const url = `${this.baseUrl}/api/insurance/read_all.php`;
    return this.http.get<any>(`${url}?user_id=${userId}&is_admin=0`).pipe(
      catchError(this.handleError)
    );
    }

    // Get Profile Data
    getProfile(userId: number): Observable<any> {
      const url = `${this.baseUrl}/api/users/get_profile.php`;
      return this.http.get<any>(`${url}?id=${userId}`);
    }
  
   // Update Profile
updateProfile(userId: number, updatedData: any): Observable<any> {
  const url = `${this.baseUrl}/api/users/update_profile.php`;
  return this.http.post<any>(url, {
    user_id: userId,
    name: updatedData.name,
    contact_number: updatedData.contact_number,
    date_of_birth: updatedData.date_of_birth,
    medical_history: updatedData.medical_history // Add medical history
  });
}

// Fetch stats from backend
getStats(): Observable<any> {
  const url = `${this.baseUrl}/api/appointments/stats.php`;
  return this.http.get<any>(url).pipe(
    catchError(this.handleError)
  );
}

  // Error handler function for HTTP requests
  private handleError(error: any): Observable<never> {
    // Log the error to the console for debugging
    console.error('An error occurred:', error);

    // Return a user-friendly error message or rethrow the error
    return throwError('Something went wrong while fetching appointments. Please try again later.');
  }
}
