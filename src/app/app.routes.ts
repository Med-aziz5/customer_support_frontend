import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { TicketsComponent } from './tickets/tickets.component'; // placeholder for after-login view
import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tickets', component: TicketsComponent,canActivate:[AuthGuard] }, 
  { path: '**', redirectTo: 'login' }, // fallback
];
