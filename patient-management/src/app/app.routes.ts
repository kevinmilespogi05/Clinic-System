import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from './appointments/appointments.component';
import { BillingComponent } from './billing/billing.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { PaymentComponent } from './payment/payment.component';

// Define the routes
export const routes: Routes = [
  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Redirect to login page by default when the app is accessed
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Protected routes wrapped with UserSideNavComponent
  {
    path: '',
    component: SideNavComponent,
    children: [
      { path: 'appointments', component: AppointmentsComponent },
      { path: 'payment', component: PaymentComponent }, 
      { path: 'billing', component: BillingComponent },
      { path: 'insurance', component: InsuranceComponent },
      { path: 'profile', component: ProfileComponent },
    ]
  },

  // Fallback route
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
