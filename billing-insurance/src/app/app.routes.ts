import { Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';







export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'online-learning'},
    { path: 'login', component: LoginComponent, title: 'Login' },
];
