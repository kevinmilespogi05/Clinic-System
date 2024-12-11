import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { AdminInsuranceComponent } from './admin/admin-insurance/admin-insurance.component';
import { AnalyticsComponent } from './admin/analytics/analytics.component';
import { InvoiceComponent } from './admin/invoice/invoice.component';
import { SideNavComponent as AdminSideNavComponent } from './admin/side-nav/side-nav.component';

// Define routes
export const routes: Routes = [
  // Default redirect to login
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  // Authentication routes
  { path: 'login', component: LoginComponent, title: 'Login' },

  // Admin routes with SideNav
  {
    path: 'admin',
    component: AdminSideNavComponent, // Wrap routes with the admin side nav
    children: [
      {
        path: 'insurance',
        component: AdminInsuranceComponent,
        title: 'Admin Insurance',
      },
      { path: 'analytics', component: AnalyticsComponent, title: 'Analytics' },
      { path: 'invoice', component: InvoiceComponent, title: 'Invoice' },
    ],
  },

  // Wildcard route for a 404 page (optional)
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
