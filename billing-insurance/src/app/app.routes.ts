import { Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { InsuranceComponent as UserInsuranceComponent } from './user/insurance/insurance.component';
import { BillingComponent as UserBillingComponent } from './user/billing/billing.component';
import { AnalyticsComponent } from './admin/analytics/analytics.component';
import { AdminInsuranceComponent } from './admin/admin-insurance/admin-insurance.component';
import { InvoiceComponent as AdminInvoiceComponent } from './admin/invoice/invoice.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: 'login', component: LoginComponent, title: 'Login' },
    { path: 'user/insurance', component: UserInsuranceComponent, title: 'User Insurance' },
    { path: 'user/invoice', component: UserBillingComponent, title: 'User Billing' },
    { path: 'admin/analytics', component: AnalyticsComponent, title: 'Admin Analytics' },
    { path: 'admin/insurance', component: AdminInsuranceComponent, title: 'Admin Insurance' },
    { path: 'admin/invoice', component: AdminInvoiceComponent, title: 'Admin Invoice' },
];
