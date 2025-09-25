import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // ✅

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loading = false;
  serverError: string | null = null;

  submit() {
  if (this.form.invalid) return;
  this.loading = true;
  this.serverError = null;

  this.auth.login(this.form.value as { email: string; password: string })
    .pipe(finalize(() => (this.loading = false)))
    .subscribe({
      next: () => {
        // token is saved in localStorage by interceptor
        this.router.navigate(['/tickets']); // redirect after login
      },
      error: err => {
        console.error('Login error:', err);
        this.serverError = err?.error?.message || 'Login failed';
      }
    });
}

}
