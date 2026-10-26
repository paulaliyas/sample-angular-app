import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home').then((m) => m.Home) },
  { path: 'todos', loadComponent: () => import('./todos/todos').then((m) => m.Todos) },
  {
    path: 'initiative',
    loadChildren: () => import('./features/initiative/initiative.module').then((m) => m.InitiativeModule),
  },
  { path: '**', redirectTo: '' },
];
