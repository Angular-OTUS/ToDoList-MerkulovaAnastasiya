import { Routes } from '@angular/router';
import { TodoResolver } from './shared/resolver/todos-resolver';
import { APP_ROUTES, ROUTE_TITLES } from './shared/util/constants';

export const routes: Routes = [
  {
    path: APP_ROUTES.MAIN,
    redirectTo: APP_ROUTES.TASKS,
    pathMatch:'full',
    title: ROUTE_TITLES.MAIN,
  },
  {
    path: APP_ROUTES.TASKS,
    loadComponent: () => import('./components/todo-list/todo-list').then((c) => c.TodoList),
    title: ROUTE_TITLES.BACKLOG,
    children: [
      {
        path: APP_ROUTES.TASK_DETAILS,
        loadComponent: () =>
          import('./components/todo-list/todo-details/todo-details').then(
            (c) => c.TodoDetails,
          ),
          resolve:{
            todo:TodoResolver
          }
      },
    ],
  },
  {
    path: APP_ROUTES.BOARD,
    loadComponent: () => import('./components/todo-board/todo-board').then((c) => c.TodoBoard),
    title: ROUTE_TITLES.BOARD,children: [
      {
        path: APP_ROUTES.TASK_DETAILS,
        loadComponent: () =>
          import('./components/todo-list/todo-details/todo-details').then(
            (c) => c.TodoDetails,
          ),
          resolve:{
            todo:TodoResolver
          }
      },
    ],
  },
  {
    path: APP_ROUTES.ERROR,
    redirectTo: APP_ROUTES.TASKS,
    title: ROUTE_TITLES.ERROR,
  },
];
