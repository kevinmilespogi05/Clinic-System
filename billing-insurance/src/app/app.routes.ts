import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';

// Define a layout component for users
export const routes: Routes = [
  // Default redirect
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  // Authentication routes
  { path: 'login', component: LoginComponent, title: 'Login' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
