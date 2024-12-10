import { Routes } from '@angular/router';
import { BillingComponent } from './user/billing/billing.component';
import { InsuranceComponent } from './user/insurance/insurance.component';

export const routes: Routes = [
  {
    path: 'billing',
    loadComponent: () =>
      import('./user/billing/billing.component').then(
        (m) => m.BillingComponent
      ),
  },
  {
    path: 'insurance',
    loadComponent: () =>
      import('./user/insurance/insurance.component').then(
        (m) => m.InsuranceComponent
      ),
  },
  { path: '', redirectTo: '/billing', pathMatch: 'full' },
];
