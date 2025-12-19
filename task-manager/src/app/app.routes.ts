import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login.component';
import { TaskListComponent } from './features/tasks/task-list.component';
import { AuthGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
