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
    <div class="login-page">
      <div class="login-container">
        <h2>🌱 Terrakodo Task Manager</h2>
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
    </div>
  `,
  styles: [`
    /* Full page background */
    .login-page {
      height: 100vh;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #dff6dd; /* light green */
    }

    /* Login box */
    .login-container {
      width: 40%;
      min-width: 300px;
      max-width: 500px;
      padding: 40px;
      border-radius: 16px;
      text-align: center;
      background: #e6f4ea; /* slightly darker green */
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      border: 2px solid #a8d5ba; /* light green border */
    }

    h2 {
      color: #2e7d32; /* dark green */
      margin-bottom: 30px;
      font-size: 2rem;
      font-family: 'Segoe UI', sans-serif;
    }

    input {
      width: 100%;
      padding: 12px;
      margin-bottom: 20px;
      border-radius: 8px;
      border: 1px solid #a8d5ba;
      outline: none;
      font-size: 1.1rem;
    }

    input:focus {
      border-color: #4caf50;
      box-shadow: 0 0 5px #a8d5ba;
    }

    button {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 8px;
      background-color: #4caf50;
      color: white;
      font-weight: bold;
      font-size: 1.1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    button:hover {
      background-color: #388e3c;
    }

    button:disabled {
      background-color: #a5d6a7;
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
