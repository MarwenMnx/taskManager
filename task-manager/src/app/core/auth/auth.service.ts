import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private emailSubject = new BehaviorSubject<string | null>(null);
  email$ = this.emailSubject.asObservable();

  login(email: string) {
    this.emailSubject.next(email);
  }

  logout() {
    this.emailSubject.next(null);
  }

  get currentEmail() {
    return this.emailSubject.value;
  }
}
