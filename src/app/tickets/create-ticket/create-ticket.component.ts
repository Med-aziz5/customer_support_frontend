import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

interface Ticket {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  user_id: number;
  assigned_to?: number;
}

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css'],
})
export class CreateTicketComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private auth = inject(AuthService);

  loading = false;
  successMessage = '';
  errorMessage = '';

  ticketForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    category: ['', Validators.required],
    priority: ['', Validators.required],
  });

  categories = ['BUG', 'FEATURE_REQUEST', 'SUPPORT', 'BILLING'];
  priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  submitTicket() {
    if (this.ticketForm.invalid) return;

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload = { ...this.ticketForm.value };

    this.http.post<{ data: Ticket }>('/api/v1/tickets', payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.successMessage = 'Ticket created successfully!';
          this.ticketForm.reset();
          setTimeout(() => this.router.navigate(['/tickets']), 1000);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err.error?.message || 'Failed to create ticket';
        }
      });
  }
}
