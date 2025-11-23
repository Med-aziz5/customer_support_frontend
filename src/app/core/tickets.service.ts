import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../tickets/tickets/ticket.model';
import { User } from '../core/auth.service';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);

  createTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>('/api/v1/tickets', ticket);
  }

  getTickets(role: 'CLIENT' | 'AGENT' | 'ADMIN'): Observable<{ data: Ticket[] }> {
    const url = role === 'CLIENT' ? '/api/v1/tickets/user' : '/api/v1/tickets';
    return this.http.get<{ data: Ticket[] }>(url);
  }

  getAssignedTickets(): Observable<{ data: Ticket[] }> {
    return this.http.get<{ data: Ticket[] }>('/api/v1/tickets/assigned-to-me');
  }

  getAgents(): Observable<{ data: User[] }> {
    return this.http.get<{ data: User[] }>('/api/v1/users');
  }

  assignToSelf(ticketId: number): Observable<any> {
    return this.http.patch(`/api/v1/tickets/assign-to-self/${ticketId}`, {}, { observe: 'response' });
  }

  assignToAgent(ticketId: number, agentId: number): Observable<any> {
    return this.http.post(`/api/v1/tickets/assign/${ticketId}`, { agentId });
  }

  resolveTicket(ticketId: number): Observable<any> {
    return this.http.put(`/api/v1/tickets/${ticketId}/resolve`, {});
  }

  deleteTicket(ticketId: number): Observable<any> {
    return this.http.delete(`/api/v1/tickets/${ticketId}`);
  }

  requestMeeting(ticketId: number): Observable<any> {
    return this.http.post(`/api/v1/meetings/request/${ticketId}`, null);
  }
}
