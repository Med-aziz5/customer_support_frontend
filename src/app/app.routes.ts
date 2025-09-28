// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { TicketsComponent } from './tickets/tickets/tickets.component';
import { CreateTicketComponent } from './tickets/create-ticket/create-ticket.component';
import { EditTicketComponent } from './tickets/edit-ticket/edit-ticket.component';
import { AuthGuard } from './core/auth.guard';
import { UsersComponent } from './users/users.component';
import { MeetingComponent } from './meetings/meetings.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TicketDetailsComponent } from './tickets/ticket-details/ticket-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tickets', component: TicketsComponent, canActivate: [AuthGuard] },
  { path: 'tickets/create', component: CreateTicketComponent, canActivate: [AuthGuard] },
  { path: 'tickets/edit/:id', component: EditTicketComponent, canActivate: [AuthGuard] },
  // placeholders for now
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: 'meetings', component: MeetingComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'tickets/:id', component: TicketDetailsComponent, canActivate: [AuthGuard] },


  { path: '**', redirectTo: 'login' },
];
