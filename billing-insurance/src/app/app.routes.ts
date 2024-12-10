import { Routes } from '@angular/router';
import { BillingComponent } from './user/billing/billing.component';
import { InsuranceComponent } from './user/insurance/insurance.component';
import { LoginComponent } from './user/login/login.component';
import { AdminInsuranceComponent } from './admin/admin-insurance/admin-insurance.component';
import { AnalyticsComponent } from './admin/analytics/analytics.component';
import { InvoiceComponent } from './admin/invoice/invoice.component';

export const routes: Routes = [
  // Redirect to login as the default route
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // User routes
  { path: 'login', component: LoginComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'insurance', component: InsuranceComponent },

  // Admin routes
  { path: 'admin-insurance', component: AdminInsuranceComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'invoice', component: InvoiceComponent },

  // Wildcard route for handling 404 errors
  { path: '**', redirectTo: 'login' },
];
