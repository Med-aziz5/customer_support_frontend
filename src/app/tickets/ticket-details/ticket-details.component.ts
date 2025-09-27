import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth.service';

interface Comment {
  id: number;
  content: string;
  created_at: string;
  author?: { id: number; email: string; role: string };
}

interface Note {
  id: number;
  content: string;
  created_at: string;
  agent?: { id: number; email: string; role?: string };
}

interface TicketHistory {
  id: number;
  action: string;
  created_at: string;
  user?: { id: number; email: string; role: string };
}

@Component({
  selector: 'app-ticket-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css'],
})
export class TicketDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  auth = inject(AuthService);

  ticketId!: number;
  role!: 'CLIENT' | 'AGENT' | 'ADMIN';
  loading = false;

  comments: Comment[] = [];
  notes: Note[] = [];
  history: TicketHistory[] = [];

  newComment = this.fb.control('');
  newNote = this.fb.control('');

  ngOnInit() {
    const user = this.auth.getUser();
    if (user) this.role = user.role as 'CLIENT' | 'AGENT' | 'ADMIN';

    this.ticketId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchTicketData();
  }

  fetchTicketData() {
    this.loading = true;

    // Fetch comments
    this.http
      .get<{ data: Comment[] }>(`/api/v1/comments/ticket/${this.ticketId}`)
      .subscribe({
        next: (res) => (this.comments = res.data || []),
        error: () => (this.comments = []),
      });

    // Fetch notes (agent/admin only)
    if (this.role !== 'CLIENT') {
      this.http
        .get<{ data: Note[] }>(`/api/v1/notes/tickets/${this.ticketId}`)
        .subscribe({
          next: (res) => (this.notes = res.data || []),
          error: () => (this.notes = []),
        });
    }

    // Fetch history
    this.http
      .get<{ data: TicketHistory[] }>(
        `/api/v1/history/tickets/${this.ticketId}`
      )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => (this.history = res.data || []),
        error: () => (this.history = []),
      });
  }

  addComment() {
    if (!this.newComment.value?.trim()) return;

    this.http
      .post<{ data: Comment }>(`/api/v1/comments/ticket/${this.ticketId}`, {
        content: this.newComment.value,
      })
      .subscribe({
        next: (res) => {
          this.comments.push(res.data);
          this.newComment.reset();
        },
      });
  }

 addNote() {
  if (!this.newNote.value || this.role === 'CLIENT') return;
  this.http
    .post<{ data: Note }>(`/api/v1/notes/tickets/${this.ticketId}`, {
      content: this.newNote.value,
    })
    .subscribe({
      next: (res) => {
        this.notes.push(res.data);
        this.newNote.reset();
      },
    });
}

}
