import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { AuthService } from '../core/auth.service';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  users: User[] = [];
  loading = false;
  errorMessage = '';
  message = '';

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.loading = true;
    this.http.get<{ data: User[] }>('/api/v1/users')
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: res => this.users = res.data,
        error: err => {
          console.error(err);
          this.errorMessage = err.error?.message || 'Failed to fetch users';
        }
      });
  }
}
