import { Component, signal } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],  
  template: `
    <div class="app-container">
      <h1>{{ title() }}</h1>
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.scss'],
})
export class App {
  protected readonly title = signal('Task Manager');
}

