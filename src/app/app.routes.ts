import { Routes } from '@angular/router';
import { Home } from './home/home';
import { privateGuard, publicGuard } from './core/auth.guard';

export const routes: Routes = [
    {
        path: '', redirectTo: 'home', pathMatch: 'full'
    },
    {
        path: 'home', component: Home
    },
    {
        canActivateChild:[publicGuard()],
        path: 'auth',
        loadChildren: () => import('./auth/features/auth.routes').then(m => m.default)
    },
    {
        canActivateChild:[privateGuard()],
        path: 'tasks',
        loadComponent:() => import('./shared/ui/navbar').then(m => m.Navbar),
        loadChildren: () => import('./task/features/task.routes').then(m => m.default)
    }
];