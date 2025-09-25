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

  // Login
login(payload: { email: string; password: string }) {
  return this.http.post<{
    message: string;
    data: { accessToken: string; user: User };
  }>('/api/v1/auth/login', payload).pipe(
    tap(res => {
      localStorage.setItem('access_token', res.data.accessToken); // must match getToken()
      this._user$.next(res.data.user);
    })
  );
}


  // Register
  register(payload: { email: string; password: string; first_name: string; last_name: string }) {
    return this.http.post<{
      message: string;
      data: { accessToken: string; user: User };
    }>('/api/v1/auth/register', payload).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.data.accessToken);
        this._user$.next(res.data.user);
      })
    );
  }

  // Load user details from server (optional, e.g., refresh page)
  loadUserDetails() {
    return this.http.get<User>('/api/v1/auth/users/me').pipe(
      tap(user => this._user$.next(user))
    );
  }

  // Logout
  logout() {
   return this.http.post('/api/v1/auth/logout', {}).pipe(
     tap(() => {
      localStorage.removeItem('access_token'); // remove AFTER logout succeeds
      this._user$.next(null);
      })
    );
  }

  // Get token
  getToken() {
     return localStorage.getItem('access_token');
  }


  // Get user object
  getUser(): User | null {
    return this._user$.getValue();
  }

  // Check if logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
