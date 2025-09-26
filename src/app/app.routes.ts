// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { TicketsComponent } from './tickets/tickets/tickets.component';
import { CreateTicketComponent } from './tickets/create-ticket/create-ticket.component';
import { EditTicketComponent } from './tickets/edit-ticket/edit-ticket.component';
import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tickets', component: TicketsComponent, canActivate: [AuthGuard] },
  { path: 'tickets/create', component: CreateTicketComponent, canActivate: [AuthGuard] },
  { path: 'tickets/edit/:id', component: EditTicketComponent, canActivate: [AuthGuard] },
  // placeholders for now
  { path: 'dashboard', component: TicketsComponent, canActivate: [AuthGuard] },
  { path: 'notifications', component: TicketsComponent, canActivate: [AuthGuard] },
  { path: 'meetings', component: TicketsComponent, canActivate: [AuthGuard] },
  { path: 'users', component: TicketsComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'login' },
];
