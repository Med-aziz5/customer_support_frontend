// src/app/sidebar/sidebar.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService, User } from '../core/auth.service';
import { Observable } from 'rxjs';

interface SidebarLink {
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  user$: Observable<User | null> = this.auth.user$;
  links: SidebarLink[] = [];

  ngOnInit() {
    this.user$.subscribe(user => {
      if (!user) {
        this.links = [];
        return;
      }

      const baseLinks: SidebarLink[] = [
        { label: 'Dashboard', route: '/dashboard' },
        { label: 'Tickets', route: '/tickets' },
        { label: 'Notifications', route: '/notifications' },
      ];

      if (user.role === 'AGENT') {
        this.links = [...baseLinks, { label: 'Meetings', route: '/meetings' }];
      } else if (user.role === 'ADMIN') {
        this.links = [...baseLinks, { label: 'Meetings', route: '/meetings' }, { label: 'Users', route: '/users' }];
      } else {
        this.links = baseLinks; // CLIENT
      }
    });
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: err => console.error('Logout failed', err)
    });
  }
}
