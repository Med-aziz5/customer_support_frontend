import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private http = inject(HttpClient);

  getAllMeetings(): Observable<any[]> {
    return this.http.get<any[]>('/api/v1/meetings');
  }
}
