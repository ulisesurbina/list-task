import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./task-list/task-list').then(m => m.TaskList),
  },
  {
    path: 'new',
    loadComponent: () => import('./task-form/task-form').then(m => m.TaskForm)
  },
  {
    path: 'edit/:idTask',
    loadComponent: () => import('./task-form/task-form').then(m => m.TaskForm)
  }
] as Routes;