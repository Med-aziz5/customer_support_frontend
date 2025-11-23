import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../dashboard.service';
import { AuthService } from '../core/auth.service';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  public auth = inject(AuthService);

  role: 'CLIENT' | 'AGENT' | 'ADMIN' | null = null;
  loading = true;
  error: string | null = null;

  stats: any = {};
  counters: Record<string, number> = {};

  ngOnInit() {
    this.auth.user$.pipe(take(1)).subscribe({
      next: user => {
        this.role = user?.role as 'CLIENT' | 'AGENT' | 'ADMIN' || null;
        this.loadStats();
      },
      error: err => {
        this.error = 'Failed to get user info';
        console.error(err);
        this.loading = false;
      }
    });
  }

  private handleStatError(statKey: string) {
    return (err: any) => {
      console.error(err);
      if (err.status === 404 && err.error?.message) {
        this.stats[statKey] = { message: err.error.message };
      } else {
        this.stats[statKey] = { message: 'Error loading data' };
      }
    };
  }

  private animateCounter(statKey: string, value: number) {
    this.counters[statKey] = 0;
    const step = Math.max(1, Math.floor(value / 50));
    const interval = setInterval(() => {
      this.counters[statKey] += step;
      if (this.counters[statKey] >= value) {
        this.counters[statKey] = value;
        clearInterval(interval);
      }
    }, 20);
  }

  loadStats() {
    if (!this.role) {
      this.loading = false;
      return;
    }

if (this.role === 'CLIENT') {
  this.dashboardService.getTotalTicketsByUser()
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: res => {
        this.stats.totalTickets = res;
        if (res?.total_tickets !== undefined) this.animateCounter('totalTickets', res.total_tickets);
      },
      error: this.handleStatError('totalTickets')
    });

  this.dashboardService.getMyAverageRating()
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: res => {
        this.stats.myRating = res;
        if (res?.average !== undefined) this.animateCounter('myRating', res.average);
      },
      error: this.handleStatError('myRating')
    });
}


if (this.role === 'AGENT') {
  this.dashboardService.getMySolvedTickets()
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: res => {
        this.stats.mySolvedTickets = res;
        if (res?.total_solved !== undefined) this.animateCounter('mySolvedTickets', res.total_solved);
      },
      error: this.handleStatError('mySolvedTickets')
    });

  this.dashboardService.getTotalSolvedTickets()
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: res => {
        this.stats.totalSolvedTickets = res;
        if (res?.average !== undefined) this.animateCounter('totalSolvedTickets', res.average);
      },
      error: this.handleStatError('totalSolvedTickets')
    });
}


    if (this.role === 'ADMIN') {
      this.loading = true;
      const adminStats = [
        { key: 'totalTickets', method: this.dashboardService.getTotalTickets.bind(this.dashboardService), numericKey: 'total_tickets' },
        { key: 'bestAgent', method: this.dashboardService.getBestAgent.bind(this.dashboardService) },
        { key: 'worstAgent', method: this.dashboardService.getWorstAgent.bind(this.dashboardService) },
        { key: 'bestRatedAgent', method: this.dashboardService.getBestRatedAgent.bind(this.dashboardService) },
        { key: 'worstRatedAgent', method: this.dashboardService.getWorstRatedAgent.bind(this.dashboardService) }
      ];

      let completedRequests = 0;

      adminStats.forEach(stat => {
        stat.method()
          .pipe(finalize(() => {
            completedRequests++;
            if (completedRequests === adminStats.length) this.loading = false;
          }))
          .subscribe({
            next: res => {
              this.stats[stat.key] = res || null;
              if (stat.numericKey && res?.[stat.numericKey] !== undefined) {
                this.animateCounter(stat.key, res[stat.numericKey]);
              }
            },
            error: this.handleStatError(stat.key)
          });
      });
    }
  }
}
