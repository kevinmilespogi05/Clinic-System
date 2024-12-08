import { Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { InsuranceComponent } from './user/insurance/insurance.component';
import { InvoiceComponent } from './user/invoice/invoice.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login'},
    { path: 'login', component: LoginComponent, title: 'Login' },
    { path: 'insurance', component: InsuranceComponent, title: 'Insurance' },
    { path: 'invoice', component: InvoiceComponent, title: 'Invoice' },
];
