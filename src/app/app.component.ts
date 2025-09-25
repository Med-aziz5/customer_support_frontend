import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService, User } from './core/auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private authService = inject(AuthService); // ✅ use this in logout
  private router = inject(Router);           // ✅ inject router

  user$: Observable<User | null> = this.authService.user$;

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        alert('Logout successful'); 
        this.router.navigate(['/login']); // ✅ navigate after logout
      },
      error: (err) => {
        console.error('Logout failed', err);
        alert('Logout failed, please try again.');
      }
    });
  }
}
