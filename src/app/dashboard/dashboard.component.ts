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
  private auth = inject(AuthService);

  role: string | null = null;
  loading = true;
  error: string | null = null;

  stats: any = {};

  ngOnInit() {
    this.auth.user$.pipe(take(1)).subscribe({
      next: user => {
        this.role = user?.role || null;
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

  loadStats() {
    if (!this.role) {
      this.loading = false;
      return;
    }

    const requests: any[] = [];

    // CLIENT STATS
    if (this.role === 'CLIENT') {
      requests.push(
        this.dashboardService.getTotalTicketsByUser()
          .pipe(finalize(() => this.loading = false))
          .subscribe({
            next: res => this.stats.totalTickets = res,
            error: this.handleStatError('totalTickets')
          })
      );

      requests.push(
        this.dashboardService.getMyAverageRating()
          .pipe(finalize(() => this.loading = false))
          .subscribe({
            next: res => this.stats.myRating = res,
            error: this.handleStatError('myRating')
          })
      );
    }

    // AGENT STATS
    if (this.role === 'AGENT') {
      requests.push(
        this.dashboardService.getMySolvedTickets()
          .pipe(finalize(() => this.loading = false))
          .subscribe({
            next: res => this.stats.mySolvedTickets = res,
            error: this.handleStatError('mySolvedTickets')
          })
      );

      requests.push(
        this.dashboardService.getTotalSolvedTickets()
          .pipe(finalize(() => this.loading = false))
          .subscribe({
            next: res => this.stats.totalSolvedTickets = res,
            error: this.handleStatError('totalSolvedTickets')
          })
      );
    }

    // ADMIN STATS
    if (this.role === 'ADMIN') {
      const adminStats = [
        { key: 'totalTickets', method: this.dashboardService.getTotalTickets.bind(this.dashboardService) },
        { key: 'bestAgent', method: this.dashboardService.getBestAgent.bind(this.dashboardService) },
        { key: 'worstAgent', method: this.dashboardService.getWorstAgent.bind(this.dashboardService) },
        { key: 'bestRatedAgent', method: this.dashboardService.getBestRatedAgent.bind(this.dashboardService) },
        { key: 'worstRatedAgent', method: this.dashboardService.getWorstRatedAgent.bind(this.dashboardService) }
      ];

      adminStats.forEach(stat => {
        requests.push(
          stat.method()
            .pipe(finalize(() => this.loading = false))
            .subscribe({
              next: res => this.stats[stat.key] = res || null,
              error: this.handleStatError(stat.key)
            })
        );
      });
    }

    // If no requests were added, stop loading
    if (requests.length === 0) this.loading = false;
  }
}
