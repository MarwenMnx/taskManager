import { bootstrapApplication } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideRouter } from '@angular/router';
import { tasksReducer } from './app/features/tasks/store/tasks.reducer';
import { routes } from './app/app.routes';
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [
    provideStore({ tasks: tasksReducer }),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
