// ticket.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ticket {
  title: string;
  description: string;
  category: string;
  priority: string;
}

@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);

  createTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>('/api/v1/tickets', ticket);
  }
}
