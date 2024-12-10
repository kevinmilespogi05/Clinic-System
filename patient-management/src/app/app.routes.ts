import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { ProfileComponent } from './user/profile/profile.component';
import { DashboardComponent as UserDashboardComponent } from './user/dashboard/dashboard.component';
import { AppointmentsComponent as UserAppointmentsComponent } from './user/appointments/appointments.component';
import { RegisterComponent } from './user/register/register.component';
import { AppointmentsComponent as AdminAppointmentsComponent } from './admin/appointments/appointments.component';
import { PatientComponent } from './admin/patient/patient.component';
import { SideNavComponent as UserSideNavComponent } from './user/side-nav/side-nav.component';
import { SideNavComponent as AdminSideNavComponent } from './admin/side-nav/side-nav.component';
import { AnalyticsComponent } from './admin/analytics/analytics.component';

// Define a layout component for users
export const routes: Routes = [
  // Default redirect
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  // Authentication routes
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'register', component: RegisterComponent, title: 'Register' },

  // User routes with SideNav
  {
    path: 'user',
    component: UserSideNavComponent, // Wrap routes with the user side nav
    children: [
      { path: 'dashboard', component: UserDashboardComponent, title: 'User Dashboard' },
      { path: 'appointments', component: UserAppointmentsComponent, title: 'User Appointments' },
      { path: 'profile', component: ProfileComponent, title: 'Profile' }
    ]
  },

  // Admin routes with SideNav
  {
    path: 'admin',
    component: AdminSideNavComponent, // Wrap routes with the admin side nav
    children: [
      { path: 'appointments', component: AdminAppointmentsComponent, title: 'Admin Appointments' },
      {path:  'analytics', component: AnalyticsComponent, title: 'Admin Analytics'},
      { path: 'patient', component: PatientComponent, title: 'Admin Patient Management' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
