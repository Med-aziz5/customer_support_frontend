import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';

interface Ticket {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  assigned_to?: number;
  user_id: number;
}

@Component({
  selector: 'app-edit-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.css'],
})
export class EditTicketComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ticketForm = this.fb.group({
    title: ['', [Validators.required]],
    description: [''],
    category: ['', [Validators.required]],
    priority: ['', [Validators.required]],
  });

  ticketId!: number;
  loading = false;
  errorMessage = '';
  successMessage = '';

  categories = ['BUG', 'FEATURE_REQUEST', 'SUPPORT', 'BILLING'];
  priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('id');
    if (!param) {
      this.errorMessage = 'Ticket ID not provided';
      return;
    }

    this.ticketId = Number(param);
    this.loadTicket();
  }

  loadTicket() {
    this.loading = true;
    this.http.get<Ticket>(`/api/v1/tickets/${this.ticketId}`)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (ticket) => {
          this.ticketForm.patchValue({
            title: ticket.title,
            description: ticket.description,
            category: ticket.category,
            priority: ticket.priority,
          });
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err.error?.message || 'Failed to load ticket';
        }
      });
  }

  updateTicket() {
    if (this.ticketForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // PATCH requires a body, so we send ticketForm.value
    this.http.patch(`/api/v1/tickets/${this.ticketId}`, this.ticketForm.value)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.successMessage = 'Ticket updated successfully!';
          setTimeout(() => this.router.navigate(['/tickets']), 1000);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err.error?.message || 'Failed to update ticket';
        }
      });
  }
}
