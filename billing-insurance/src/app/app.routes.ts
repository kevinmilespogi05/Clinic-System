import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsComponent } from './analytics/analytics.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { PatientComponent } from './patient/patient.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { LoginComponent } from './login/login.component';
import { StatsComponent } from './stats/stats.component';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: '', 
    component: SideNavComponent, 
    children: [
      { path: 'appointments', component: AppointmentsComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'stats', component: StatsComponent},
      { path: 'insurance', component: InsuranceComponent },
      { path: 'invoice', component: InvoiceComponent },
      { path: 'patient', component: PatientComponent },
      { path: '', redirectTo: 'analytics', pathMatch: 'full' },
    ] 
  },
  { path: '**', redirectTo: 'login' }, // Redirect to login for unknown routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
