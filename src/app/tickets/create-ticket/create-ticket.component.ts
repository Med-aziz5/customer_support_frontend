import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css'],
})
export class CreateTicketComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  loading = false;
  successMessage = '';
  errorMessage = '';

  ticketForm = this.fb.group({
    title: ['', [Validators.required]],
    description: [''],
    category: ['', [Validators.required]],
    priority: ['', [Validators.required]],
  });

  categories = ['BUG', 'FEATURE_REQUEST', 'SUPPORT', 'BILLING'];
  priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  submitTicket() {
    if (this.ticketForm.invalid) return;

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.http.post('/ticket', this.ticketForm.value)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.successMessage = 'Ticket created successfully!';
          this.ticketForm.reset();
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err.error?.message || 'Failed to create ticket';
        }
      });
  }
}
