import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);

  // Client
  getMyAverageRating(): Observable<any> {
    return this.http.get('/api/v1/feedback/my-average/');
  }

  getTotalTicketsByUser(): Observable<any> {
    return this.http.get('/api/v1/tickets/stats/total-by-user/');
  }

  // Agent
  getMySolvedTickets(): Observable<any> {
    return this.http.get('/api/v1/tickets/stats/my-solved/');
  }

  getTotalSolvedTickets(): Observable<any> {
    return this.http.get('/api/v1/tickets/stats/total-solved/');
  }

  // Admin
  getBestAgent(): Observable<any> {
    return this.http.get('/api/v1/tickets/stats/best-agent/');
  }

  getWorstAgent(): Observable<any> {
    return this.http.get('/api/v1/tickets/stats/worst-agent/');
  }

  getTotalTickets(): Observable<any> {
    return this.http.get('/api/v1/tickets/stats/total/');
  }

  getBestRatedAgent(): Observable<any> {
    return this.http.get('/api/v1/feedback/best-agent/');
  }

  getWorstRatedAgent(): Observable<any> {
    return this.http.get('/api/v1/feedback/worst-agent/');
  }
}
