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
      <div class="task-container">
        <h2>🌱 Your Tasks</h2>

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
          <li *ngFor="let task of tasks$ | async" class="task-item">
            <div *ngIf="editingTaskId !== task.id">
              <div class="task-info" [class.completed]="task.completed">
                <span class="task-title">{{ task.title }}</span>
                <span class="task-desc">{{ task.description }}</span>
                <span class="task-meta">Priority: {{ task.priority }} | Due: {{ task.dueDate | date:'shortDate' }}</span>
              </div>
              <div class="task-actions">
                <button (click)="startEdit(task)">✏️ Edit</button>
                <button (click)="toggleTask(task.id)">✔️ Done</button>
                <button (click)="deleteTask(task.id)">🗑️ Delete</button>
              </div>
            </div>

            <div *ngIf="editingTaskId === task.id" class="edit-form">
              <input type="text" [(ngModel)]="editTask.title" name="editTitle" required />
              <input type="text" [(ngModel)]="editTask.description" name="editDescription" />
              <input type="number" [(ngModel)]="editTask.priority" name="editPriority" min="1" max="5" required />
              <input type="date" [(ngModel)]="editTask.dueDate" name="editDueDate" required />
              <button (click)="saveEdit()">💾 Save</button>
              <button (click)="cancelEdit()">❌ Cancel</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    /* Full page background */
    .task-page {
      min-height: 100vh;
      width: 100%;
      background-color: #dff6dd; /* light green background */
      padding: 20px;
      display: flex;
      justify-content: center;
    }

    .task-container {
      width: 60%;
      max-width: 800px;
      background: #e6f4ea; /* slightly darker green */
      border-radius: 16px;
      padding: 30px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    }

    h2 {
      color: #2e7d32;
      margin-bottom: 20px;
      font-size: 2rem;
      text-align: center;
    }

    /* Add Task Form */
    .task-form input {
      width: calc(25% - 10px);
      margin: 5px;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #a8d5ba;
    }

    .task-form button {
      padding: 10px 20px;
      margin: 5px;
      border: none;
      border-radius: 8px;
      background-color: #4caf50;
      color: white;
      cursor: pointer;
    }

    .task-form button:hover {
      background-color: #388e3c;
    }

    /* Task Items */
    ul { list-style: none; padding: 0; }
    .task-item {
      background: #f0faf0;
      margin-bottom: 15px;
      padding: 15px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }

  .task-info {
  display: flex;
  flex-direction: column; /* stack items vertically */
  gap: 6px; /* space between title, description, and meta */
  padding: 5px 0;
}

.task-title {
  font-weight: bold;
  font-size: 1.2rem;
}

.task-desc {
  font-size: 0.95rem;
  color: #555;
  margin: 0; /* remove extra margin if any */
}

.task-meta {
  font-size: 0.85rem;
  color: #2e7d32;
}


    .task-actions {
      margin-top: 10px;
      display: flex;
      gap: 10px;
    }

    .task-actions button {
      padding: 6px 12px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      background-color: #4caf50;
      color: white;
      transition: background-color 0.3s;
    }

    .task-actions button:hover {
      background-color: #388e3c;
    }

    /* Edit form */
    .edit-form input {
      margin: 5px;
      padding: 8px;
      border-radius: 6px;
      border: 1px solid #a8d5ba;
    }

    .edit-form button {
      margin: 5px;
      padding: 8px 16px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      background-color: #4caf50;
      color: white;
    }

    .edit-form button:hover {
      background-color: #388e3c;
    }
  `]
})
export class TaskListComponent {
  tasks$: Observable<Task[]>;
  newTask: Partial<Task> = { title: '', description: '', priority: 1, dueDate: '' };

  // Edit task state
  editingTaskId: string | null = null;
  editTask: Partial<Task> = {};

  constructor(private store: Store, private auth: AuthService) {
    this.tasks$ = this.store.select(selectUserTasks(this.auth.currentEmail || ''));
  }

  // Add Task
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

  // Delete Task
  deleteTask(id: string) {
    this.store.dispatch(TaskActions.deleteTask({ id }));
  }

  // Toggle complete
  toggleTask(id: string) {
    this.store.dispatch(TaskActions.toggleTask({ id }));
  }

  // Start editing
  startEdit(task: Task) {
    this.editingTaskId = task.id;
    this.editTask = { ...task }; // clone task
  }

  // Save edit
  saveEdit() {
    if (this.editingTaskId && this.editTask.title && this.editTask.dueDate) {
      this.store.dispatch(TaskActions.updateTask({ task: this.editTask as Task }));
      this.cancelEdit();
    }
  }

  // Cancel editing
  cancelEdit() {
    this.editingTaskId = null;
    this.editTask = {};
  }
}
