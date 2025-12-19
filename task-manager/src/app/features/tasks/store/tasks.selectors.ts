import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Task } from '../task.model';

export const selectTasks = createFeatureSelector<Task[]>('tasks');

export const selectUserTasks = (email: string) =>
  createSelector(selectTasks, tasks => tasks.filter(t => t.userEmail === email));
