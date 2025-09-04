import { Routes } from '@angular/router';

export default [
  {
    path: 'sign-in',
    loadComponent: () => import('./sign-in/sign-in').then(m => m.SignIn),
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./sign-up/sign-up').then(m => m.SignUp),
  }
] as Routes;