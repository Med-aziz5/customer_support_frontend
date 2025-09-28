// src/app/meetings/meeting/meeting.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingService } from './meeting.service';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-meeting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.css']
})
export class MeetingComponent implements OnInit {
  private meetingService = inject(MeetingService);
  private auth = inject(AuthService);

  role: string | null = null;
  meetings: any[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.auth.user$.subscribe({
      next: (user) => {
        this.role = user?.role || null;
        if (this.role === 'ADMIN' || this.role === 'AGENT') {
          this.loadMeetings();
        } else {
          this.loading = false;
          this.error = 'You are not authorized to view meetings';
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load user info';
      }
    });
  }

  loadMeetings() {
    this.meetingService.getAllMeetings().subscribe({
      next: (res) => {
        this.meetings = res.sort(
          (a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.message || 'Failed to load meetings';
        this.loading = false;
      }
    });
  }
}
