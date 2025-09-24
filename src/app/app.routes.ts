import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';


export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  { path: '', redirectTo: 'tickets', pathMatch: 'full' },
  { path: 'tickets', loadComponent: () => import('./tickets/tickets-list.component').then(m => m.TicketsListComponent) /* add guards later */ },
  { path: 'tickets/:id', loadComponent: () => import('./tickets/ticket-detail.component').then(m => m.TicketDetailComponent) /* add guards */ },
  // admin, dashboard, profile, etc...
];
