import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsComponent } from './analytics/analytics.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { PatientComponent } from './patient/patient.component';
import { SideNavComponent } from './side-nav/side-nav.component';

export const routes: Routes = [
  {
    path: '',
    component: SideNavComponent, // Parent component
    children: [
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'appointments', component: AppointmentsComponent },
      { path: 'insurance', component: InsuranceComponent },
      { path: 'invoice', component: InvoiceComponent },
      { path: 'patient', component: PatientComponent },
      { path: '', redirectTo: 'analytics', pathMatch: 'full' }, // Default route
    ],
  },
  { path: '**', redirectTo: '' }, // Fallback route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
