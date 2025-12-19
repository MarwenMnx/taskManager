import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form (ngSubmit)="login()" #loginForm="ngForm">
        <input
          type="email"
          name="email"
          [(ngModel)]="email"
          placeholder="Enter your email"
          required
        />
        <button type="submit" [disabled]="!loginForm.form.valid">Login</button>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
      text-align: center;
    }

    input {
      width: 100%;
      padding: 8px;
      margin-bottom: 12px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }

    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background-color: #1976d2;
      color: white;
      cursor: pointer;
    }

    button:disabled {
      background-color: #999;
      cursor: not-allowed;
    }
  `]
})
export class LoginComponent {
  email: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.email);
    this.router.navigate(['/tasks']); 
  }
}
