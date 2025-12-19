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
    <div class="task-page">
      <h2>Your Tasks</h2>

      <!-- Add Task Form -->
      <form (ngSubmit)="addTask()" #taskForm="ngForm" class="task-form">
        <input type="text" placeholder="Title" [(ngModel)]="newTask.title" name="title" required />
        <input type="text" placeholder="Description" [(ngModel)]="newTask.description" name="description" />
        <input type="number" placeholder="Priority (1-5)" [(ngModel)]="newTask.priority" name="priority" min="1" max="5" required />
        <input type="date" [(ngModel)]="newTask.dueDate" name="dueDate" required />
        <button type="submit" [disabled]="!taskForm.form.valid">Add Task</button>
      </form>

      <!-- Task List -->
      <ul>
        <li *ngFor="let task of tasks$ | async" class="task-card">
          <div *ngIf="editingTaskId !== task.id">
            <div class="task-info" [class.completed]="task.completed">
              <span class="task-title">{{ task.title }}</span>
              <span class="task-desc">{{ task.description }}</span>
              <span class="task-meta">Priority: {{ task.priority }} | Due: {{ task.dueDate | date:'shortDate' }}</span>
            </div>
            <div class="task-buttons">
              <button (click)="startEdit(task)">✏️ Edit</button>
              <button (click)="toggleTask(task.id)">✔️ Complete</button>
              <button (click)="deleteTask(task.id)">🗑️ Delete</button>
            </div>
          </div>

          <div *ngIf="editingTaskId === task.id" class="edit-task">
            <input type="text" [(ngModel)]="editTask.title" name="editTitle" required />
            <input type="text" [(ngModel)]="editTask.description" name="editDescription" />
            <input type="number" [(ngModel)]="editTask.priority" name="editPriority" min="1" max="5" required />
            <input type="date" [(ngModel)]="editTask.dueDate" name="editDueDate" required />
            <div class="edit-buttons">
              <button (click)="saveEdit()">💾 Save</button>
              <button (click)="cancelEdit()">❌ Cancel</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .task-page {
      max-width: 700px;
      margin: 30px auto;
      padding: 20px;
      background-color: #e8f5e9; /* soft green background */
      border-radius: 12px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    h2 {
      text-align: center;
      color: #2e7d32;
      margin-bottom: 20px;
    }

    .task-form {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 25px;
    }

    .task-form input {
      flex: 1 1 45%;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #a5d6a7;
    }

    .task-form button {
      flex: 1 1 100%;
      padding: 10px;
      background-color: #2e7d32;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      transition: background 0.3s;
    }

    .task-form button:disabled {
      background-color: #a5d6a7;
      cursor: not-allowed;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    .task-card {
      background-color: white;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    }

    .task-info { display: flex; flex-direction: column; gap: 6px; }

    .task-title { font-weight: bold; font-size: 1.2rem; color: #1b5e20; }
    .task-desc { font-size: 1rem; color: #555; }
    .task-meta { font-size: 0.85rem; color: #388e3c; }

    .task-buttons {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }

    .task-buttons button {
      flex: 1;
      padding: 6px 10px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-weight: bold;
      transition: 0.3s;
    }

    .task-buttons button:nth-child(1) { background-color: #81c784; color: white; }
    .task-buttons button:nth-child(2) { background-color: #4caf50; color: white; }
    .task-buttons button:nth-child(3) { background-color: #e57373; color: white; }

    .task-buttons button:hover { opacity: 0.85; }

    .completed { text-decoration: line-through; color: gray; }

    .edit-task input {
      flex: 1 1 45%;
      padding: 8px;
      margin-bottom: 8px;
      border-radius: 6px;
      border: 1px solid #a5d6a7;
    }

    .edit-buttons {
      display: flex;
      gap: 10px;
    }

    .edit-buttons button {
      flex: 1;
      padding: 6px 10px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-weight: bold;
    }

    .edit-buttons button:nth-child(1) { background-color: #4caf50; color: white; }
    .edit-buttons button:nth-child(2) { background-color: #e57373; color: white; }
  `]
})
export class TaskListComponent {
  tasks$: Observable<Task[]>;
  newTask: Partial<Task> = { title: '', description: '', priority: 1, dueDate: '' };

  editingTaskId: string | null = null;
  editTask: Partial<Task> = {};

  constructor(private store: Store, private auth: AuthService) {
    const email = this.auth.currentEmail;
    if (email) {
      const savedTasks = localStorage.getItem(`tasks_${email}`);
      if (savedTasks) {
        const tasks: Task[] = JSON.parse(savedTasks);
        this.store.dispatch(TaskActions.loadTasks({ tasks }));
      }
    }

    this.tasks$ = this.store.select(selectUserTasks(this.auth.currentEmail || ''));

    this.store.select(selectUserTasks(this.auth.currentEmail || '')).subscribe(tasks => {
      if (this.auth.currentEmail) {
        localStorage.setItem(`tasks_${this.auth.currentEmail}`, JSON.stringify(tasks));
      }
    });
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

  deleteTask(id: string) { this.store.dispatch(TaskActions.deleteTask({ id })); }
  toggleTask(id: string) { this.store.dispatch(TaskActions.toggleTask({ id })); }
  startEdit(task: Task) { this.editingTaskId = task.id; this.editTask = { ...task }; }
  saveEdit() {
    if (this.editingTaskId && this.editTask.title && this.editTask.dueDate) {
      this.store.dispatch(TaskActions.updateTask({ task: this.editTask as Task }));
      this.cancelEdit();
    }
  }
  cancelEdit() { this.editingTaskId = null; this.editTask = {}; }
}
