import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { TicketsComponent } from './tickets/tickets.component'; // placeholder for after-login view

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tickets', component: TicketsComponent }, // protected route later
  { path: '**', redirectTo: 'login' }, // fallback
];
