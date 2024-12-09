import { Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { InsuranceComponent as UserInsuranceComponent } from './user/insurance/insurance.component';
import { InvoiceComponent as UserInvoiceComponent } from './user/invoice/invoice.component';
import { AnalyticsComponent } from './admin/analytics/analytics.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { InsuranceComponent as AdminInsuranceComponent } from './admin/insurance/insurance.component';
import { InvoiceComponent as AdminInvoiceComponent } from './admin/invoice/invoice.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: 'login', component: LoginComponent, title: 'Login' },
    { path: 'user/insurance', component: UserInsuranceComponent, title: 'User Insurance' },
    { path: 'user/invoice', component: UserInvoiceComponent, title: 'User Invoice' },
    { path: 'admin/analytics', component: AnalyticsComponent, title: 'Admin Analytics' },
    { path: 'admin/dashboard', component: DashboardComponent, title: 'Admin Dashboard' },
    { path: 'admin/insurance', component: AdminInsuranceComponent, title: 'Admin Insurance' },
    { path: 'admin/invoice', component: AdminInvoiceComponent, title: 'Admin Invoice' },
];
