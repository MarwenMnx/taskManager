import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Task } from './task.model';
import * as TaskActions from './store/tasks.actions';
import { selectUserTasks } from './store/tasks.selectors';
import { AuthService } from '../../core/auth/auth.service';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="task-container">
      <h2>Your Tasks</h2>
      <form (ngSubmit)="addTask()" #taskForm="ngForm">
        <input
          type="text"
          placeholder="Title"
          [(ngModel)]="newTask.title"
          name="title"
          required
        />
        <input
          type="text"
          placeholder="Description"
          [(ngModel)]="newTask.description"
          name="description"
        />
        <input
          type="number"
          placeholder="Priority (1-5)"
          [(ngModel)]="newTask.priority"
          name="priority"
          min="1"
          max="5"
          required
        />
        <input
          type="date"
          [(ngModel)]="newTask.dueDate"
          name="dueDate"
          required
        />
        <button type="submit" [disabled]="!taskForm.form.valid">Add Task</button>
      </form>

      <ul>
        <li *ngFor="let task of tasks$ | async">
          <span [class.completed]="task.completed">{{ task.title }} (Priority: {{ task.priority }})</span>
          <button (click)="toggleTask(task.id)">✔️</button>
          <button (click)="deleteTask(task.id)">🗑️</button>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .task-container { max-width: 600px; margin: 20px auto; }
    form input { margin-right: 5px; margin-bottom: 10px; }
    ul { list-style: none; padding: 0; }
    li { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
    .completed { text-decoration: line-through; color: gray; }
  `]
})
export class TaskListComponent {
  tasks$: Observable<Task[]>;
  newTask: Partial<Task> = { title: '', description: '', priority: 1, dueDate: '' };

  constructor(private store: Store, private auth: AuthService) {
    this.tasks$ = this.store.select(selectUserTasks(this.auth.currentEmail || ''));
  }

  addTask() {
    if (!this.newTask.title || !this.newTask.dueDate) return;
    const task: Task = {
      id: uuidv4(),
      title: this.newTask.title!,
      description: this.newTask.description || '',
      priority: this.newTask.priority!,
      dueDate: this.newTask.dueDate!,
      completed: false,
      userEmail: this.auth.currentEmail!
    };
    this.store.dispatch(TaskActions.addTask({ task }));
    this.newTask = { title: '', description: '', priority: 1, dueDate: '' };
  }

  deleteTask(id: string) {
    this.store.dispatch(TaskActions.deleteTask({ id }));
  }

  toggleTask(id: string) {
    this.store.dispatch(TaskActions.toggleTask({ id }));
  }
}
