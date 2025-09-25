import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  category: string;
  assigned_to?: number;
  user_id: number;
}

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css'],
})
export class TicketsComponent implements OnInit {
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);


  tickets: Ticket[] = [];
  loading = false;
  role: 'CLIENT' | 'AGENT' | 'ADMIN' = 'CLIENT';
  assignForm = this.fb.group({ agentId: [''] });

  constructor() {
    const user = this.auth.getUser();
    if (user) this.role = user.role as any;
  }

  ngOnInit() {
    this.fetchTickets();
  }

  fetchTickets() {
    this.loading = true;
    const url = this.role === 'CLIENT' ? '/ticket/user' : '/ticket';

    this.http.get<Ticket[]>(url)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => (this.tickets = res),
        error: (err) => console.error(err),
      });
  }

  assignToSelf(ticketId: number) {
    this.http.patch(`/ticket/assign-to-self/${ticketId}`, {}).subscribe({
      next: () => this.fetchTickets(),
      error: (err) => console.error(err),
    });
  }

  assignToAgent(ticketId: number) {
    const agentId = this.assignForm.value.agentId;
    if (!agentId) return;
    this.http.post(`/ticket/assign/${ticketId}`, { agentId }).subscribe({
      next: () => this.fetchTickets(),
      error: (err) => console.error(err),
    });
  }
  editTicket(ticketId: number) {
  // navigate to edit ticket page
  this.router.navigate(['/tickets/edit', ticketId]);
}
deleteTicket(ticketId: number) {
  if (!confirm('Are you sure you want to delete this ticket?')) return;

  this.http.delete(`/ticket/${ticketId}`)
    .subscribe({
      next: () => {
        alert('Ticket deleted successfully!');
        this.fetchTickets(); 
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Failed to delete ticket');
      }
    });
}
requestedMeetings = new Set<number>(); // store ticket IDs

requestMeeting(ticketId: number) {
  if (!confirm('Do you want to request a meeting for this ticket?')) return;

  this.http.post(`/meeting/request/${ticketId}`, {})
    .subscribe({
      next: () => {
        alert('Meeting request sent successfully!');
        this.requestedMeetings.add(ticketId); // mark as requested
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Failed to request meeting');
      }
    });
}

}

