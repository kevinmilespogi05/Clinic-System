import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private baseUrl = 'http://localhost/Clinic-System/clinicapi'; // Base API URL

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/users/login.php`, { username, password });
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
  // Get Dashboard Data
  getDashboardData(userId: number): Observable<any> {
    const url = `${this.baseUrl}/api/dashboard/get_dashboard.php`;
    return this.http.get(`${url}?user_id=${userId}`);
  }

  // Get Appointments
  getAppointments(userId: number): Observable<any> {
    const url = `${this.baseUrl}/api/appointments/get_appointments.php`;
    return this.http.get(`${url}?user_id=${userId}`);
  }

  // Book Appointment
  bookAppointment(data: { userId: number; date: string; time: string }): Observable<any> {
    const url = `${this.baseUrl}/api/appointments/create.php`;
    return this.http.post(url, data);
  }

  // Cancel Appointment
  cancelAppointment(appointmentId: number): Observable<any> {
    const url = `${this.baseUrl}/api/appointments/cancel.php`;
    const body = { appointment_id: appointmentId };
    return this.http.post(url, body);
  }

  // Get Profile Data
  getProfile(userId: number): Observable<any> {
    const url = `${this.baseUrl}/api/users/get_profile.php`;
    return this.http.get(`${url}?user_id=${userId}`);
  }

  // Update Profile
  updateProfile(userId: number, data: { name: string; contact_number: string; date_of_birth: string; medical_history: string }): Observable<any> {
    const url = `${this.baseUrl}/api/users/update_profile.php`;
    const body = { user_id: userId, ...data };
    return this.http.post(url, body);
  }
}
