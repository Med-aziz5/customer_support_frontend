import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

export interface User {
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private _user$ = new BehaviorSubject<User | null>(null);
  user$ = this._user$.asObservable();

  login(payload: { email: string; password: string }) {
    return this.http.post<{
      message: string;
      data: { accessToken: string; user: User };
    }>('/api/auth/login', payload).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.data.accessToken);
        this._user$.next(res.data.user);
      })
    );
  }

  register(payload: { email: string; password: string; first_name: string; last_name: string }) {
    return this.http.post<{
      message: string;
      data: { accessToken: string; user: User };
    }>('/api/auth/register', payload).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.data.accessToken);
        this._user$.next(res.data.user);
      })
    );
  }

  loadUserDetails() {
    return this.http.get<User>('/api/auth/users/me').pipe(
      tap(user => this._user$.next(user))
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    this._user$.next(null);
    return this.http.post('/api/auth/logout', {});
  }

  getToken() {
    return localStorage.getItem('access_token');
  }
  getUser(): User | null {
    return this._user$.getValue();
  }
}
