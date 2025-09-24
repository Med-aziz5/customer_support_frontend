import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirm_password: ['', Validators.required],
  });

  loading = false;
  serverError: string | null = null;

  submit() {
    if (this.form.invalid) return;

    if (this.form.value.password !== this.form.value.confirm_password) {
      this.serverError = "Passwords do not match";
      return;
    }

    this.loading = true;
    this.serverError = null;

    const payload = {
      first_name: this.form.value.first_name!,
      last_name: this.form.value.last_name!,
      email: this.form.value.email!,
      password: this.form.value.password!,
    };

    this.auth.register(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => this.router.navigate(['/tickets']),
        error: err => {
          this.serverError = err?.error?.message || 'Registration failed';
        }
      });
  }
}
