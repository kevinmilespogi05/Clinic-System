import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { ProfileComponent } from './user/profile/profile.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { AppointmentsComponent } from './user/appointments/appointments.component';
import { RegisterComponent } from './user/register/register.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'register', component: RegisterComponent, title: 'Register' },
  { path: 'profile', component: ProfileComponent, title: 'Profile' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
  { path: 'appointments', component: AppointmentsComponent, title: 'Appointments' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
