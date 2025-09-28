import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
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
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = false;
  serverError: string | null = null;

  submit() {
    console.log('Form submitted', this.form.value, 'Valid?', this.form.valid);

    if (this.form.invalid) {
      this.serverError = "Please fill all fields correctly";
      return;
    }

    const { first_name, last_name, email, password } = this.form.value;

    const payload = {
      first_name: first_name!,
      last_name: last_name!,
      email: email!,
      password: password!,
    };

    this.loading = true;
    this.serverError = null;

    this.auth.register(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          console.log('Registration successful');
          this.router.navigate(['/tickets']);
        },
        error: err => {
          console.error('Registration error', err);
          this.serverError = err?.error?.message || 'Registration failed';
        }
      });
  }
}
