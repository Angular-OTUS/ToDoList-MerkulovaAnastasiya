import { Routes } from '@angular/router';
import { APP_ROUTES } from './shared/util/constants';

export const routes: Routes = [
  {
    path: APP_ROUTES.MAIN,
    redirectTo: APP_ROUTES.TASKS,
    pathMatch:'full',
    title: 'Main',
  },
  {
    path: APP_ROUTES.TASKS,
    loadComponent: () => import('./components/todo-list/todo-list').then((c) => c.TodoList),
    title: 'Backlog',
    children: [
      {
        path: APP_ROUTES.TASK_DETAILS,
        loadComponent: () =>
          import('./components/todo-list/todo-details/todo-details').then(
            (c) => c.TodoDetails,
          ),
      },
    ],
  },
  {
    path: APP_ROUTES.ERROR,
    redirectTo: APP_ROUTES.TASKS,
    title: 'Error',
  },
];
