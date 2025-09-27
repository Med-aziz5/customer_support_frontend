import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { AuthService, User } from '../../core/auth.service';

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
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css'],
})
export class TicketsComponent implements OnInit {
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  router = inject(Router);

  tickets: Ticket[] = [];
  agents: User[] = [];
  loading = false;
  role: 'CLIENT' | 'AGENT' | 'ADMIN' = 'CLIENT';
  assignForm = this.fb.group({ agentId: [''] });

  requestedMeetings = new Set<number>();
  showAssignedOnly = false;

  message = '';
  messageTimeout: any;

  ngOnInit() {
    const user = this.auth.getUser();
    if (user && user.role) {
      this.role = user.role as 'CLIENT' | 'AGENT' | 'ADMIN';
    }
    this.fetchTickets();
    if (this.role === 'ADMIN') {
      this.fetchAgents();
    }
  }

  fetchTickets() {
    this.loading = true;
    const url = this.role === 'CLIENT' ? '/api/v1/tickets/user' : '/api/v1/tickets';
    this.http
      .get<{ data: Ticket[]; total_count: number }>(url)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => (this.tickets = res.data),
        error: (err) => console.error('Error fetching tickets:', err),
      });
  }

  fetchAgents() {
    this.http.get<{ data: User[] }>('/api/v1/users').subscribe({
      next: (res) => {
        this.agents = res.data.filter((u) => u.role === 'AGENT');
      },
      error: (err) => console.error('Error fetching agents:', err),
    });
  }

  toggleAssignedTickets() {
    if (this.showAssignedOnly) {
      this.http.get<{ data: Ticket[] }>('/api/v1/tickets/assigned-to-me').subscribe({
        next: (res) => (this.tickets = res.data),
        error: (err) => console.error('Error fetching assigned tickets:', err),
      });
    } else {
      this.fetchTickets();
    }
  }

  showMessage(msg: string) {
    this.message = msg;
    clearTimeout(this.messageTimeout);
    this.messageTimeout = setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  assignToSelf(ticketId: number) {
    this.http.patch(`/api/v1/tickets/assign-to-self/${ticketId}`, {}, { observe: 'response' }).subscribe({
      next: () => {
        this.fetchTickets();
        this.showMessage('Ticket assigned to you successfully!');
      },
      error: (err) => console.error('Error assigning ticket:', err),
    });
  }

  assignToAgent(ticketId: number) {
    const agentId = this.assignForm.value.agentId;
    if (!agentId) return;
    this.http.post(`/api/v1/tickets/assign/${ticketId}`, { agentId }).subscribe({
      next: () => {
        this.fetchTickets();
        this.showMessage('Ticket assigned to the agent successfully!');
      },
      error: (err) => console.error(err),
    });
  }

  editTicket(ticketId: number) {
    this.router.navigate(['/tickets/edit', ticketId]);
  }

  goToTicketDetails(ticketId: number) {
    this.router.navigate(['/tickets', ticketId]);
  }

  deleteTicket(ticketId: number) {
    if (!confirm('Are you sure you want to delete this ticket?')) return;
    this.http.delete(`/api/v1/tickets/${ticketId}`).subscribe({
      next: () => {
        alert('Ticket deleted successfully!');
        this.fetchTickets();
      },
      error: (err) => {
        if (err.status === 403) {
          alert('You are not authorized to delete this ticket.');
        } else {
          alert(err.error?.message || 'Failed to delete ticket.');
        }
      },
    });
  }

  requestMeeting(ticketId: number) {
    if (!confirm('Do you want to request a meeting for this ticket?')) return;
    this.http.post(`/api/v1/meetings/request/${ticketId}`, null).subscribe({
      next: () => {
        alert('Meeting request sent successfully!');
        this.requestedMeetings.add(ticketId);
      },
      error: (err) => alert(err.error?.message || 'Failed to request meeting'),
    });
  }
}
