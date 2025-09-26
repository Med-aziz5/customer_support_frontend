import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, User } from '../core/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  users: User[] = [];
  loading = false;
  role: 'CLIENT' | 'AGENT' | 'ADMIN' = 'CLIENT';
  message = '';
  showCreateAgentForm = false;

  createAgentForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
  });

  ngOnInit() {
    const user = this.auth.getUser();
    if (user && user.role) this.role = user.role as 'CLIENT' | 'AGENT' | 'ADMIN';
    this.fetchUsers();
  }

  fetchUsers() {
    if (this.role !== 'ADMIN') return;

    this.loading = true;
    this.http.get<{ data: User[] }>('/api/v1/users')
      .subscribe({
        next: (res) => { this.users = res.data; this.loading = false; },
        error: (err) => { console.error(err); this.loading = false; }
      });
  }

  toggleCreateAgent() {
    this.showCreateAgentForm = !this.showCreateAgentForm;
  }

  createAgent() {
    if (this.createAgentForm.invalid) return;

    const payload = this.createAgentForm.value;
    this.http.post('/api/v1/auth/create-agent', payload).subscribe({
      next: () => {
        this.message = 'Agent created successfully!';
        this.showCreateAgentForm = false;
        this.createAgentForm.reset();
        this.fetchUsers();
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        console.error(err);
        this.message = err.error?.message || 'Failed to create agent';
      }
    });
  }
}
