import { createReducer, on } from '@ngrx/store';
import { Task } from '../task.model';
import * as TaskActions from './tasks.actions';

export const initialState: Task[] = [];

export const tasksReducer = createReducer(
  initialState,
  on(TaskActions.addTask, (state, { task }) => [...state, task]),
  on(TaskActions.updateTask, (state, { task }) =>
    state.map(t => (t.id === task.id ? task : t))
  ),
  on(TaskActions.deleteTask, (state, { id }) => state.filter(t => t.id !== id)),
  on(TaskActions.toggleTask, (state, { id }) =>
    state.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
  ),
  on(TaskActions.loadTasks, (_, { tasks }) => [...tasks])
);
