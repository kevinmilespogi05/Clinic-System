import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { ProfileComponent } from './user/profile/profile.component';
import { DashboardComponent as UserDashboardComponent } from './user/dashboard/dashboard.component';
import { AppointmentsComponent as UserAppointmentsComponent } from './user/appointments/appointments.component';
import { RegisterComponent } from './user/register/register.component';
import { DashboardComponent as AdminDashboardComponent } from './admin/dashboard/dashboard.component';
import { AppointmentsComponent as AdminAppointmentsComponent } from './admin/appointments/appointments.component';
import { PatientComponent } from './admin/patient/patient.component';
import { SideNavComponent } from './user/side-nav/side-nav.component';

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
    component: SideNavComponent, // Wrap routes with the side nav
    children: [
      { path: 'dashboard', component: UserDashboardComponent, title: 'User Dashboard' },
      { path: 'appointments', component: UserAppointmentsComponent, title: 'User Appointments' },
      { path: 'profile', component: ProfileComponent, title: 'Profile' }
    ]
  },

  // Admin routes
  {
    path: 'admin',
    component: AdminDashboardComponent, // Replace with an admin layout component if needed
    children: [
      { path: 'dashboard', component: AdminDashboardComponent, title: 'Admin Dashboard' },
      { path: 'appointments', component: AdminAppointmentsComponent, title: 'Admin Appointments' },
      { path: 'patient', component: PatientComponent, title: 'Admin Patient Management' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
