import { createAction, props } from '@ngrx/store';
import { Task } from '../task.model';

export const addTask = createAction('[Task] Add', props<{ task: Task }>());
export const updateTask = createAction('[Task] Update', props<{ task: Task }>());
export const deleteTask = createAction('[Task] Delete', props<{ id: string }>());
export const toggleTask = createAction('[Task] Toggle', props<{ id: string }>());
export const loadTasks = createAction('[Task] Load', props<{ tasks: Task[] }>());
