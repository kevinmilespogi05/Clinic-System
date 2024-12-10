import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InsuranceService {
  private apiUrl = 'http://localhost/clinicapi/api/insurance';

  constructor(private http: HttpClient) {}

  getClaims(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/read_all.php`);
  }

  createClaim(claim: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create.php`, claim);
  }

  updateClaim(claim: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update_status.php`, claim);
  }
}
