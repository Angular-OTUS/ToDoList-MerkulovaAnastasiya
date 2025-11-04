import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { TodosApiService } from '../../services/todos-api/todos-api';
import { ITodoItem } from '../types/todo-item.interface';
import { APP_ROUTES } from '../util/constants';


export const TodoResolver : ResolveFn<ITodoItem | null> = (
  route: ActivatedRouteSnapshot
) => {
  const todosApiService = inject(TodosApiService);
  const router = inject(Router);

  const id = route.paramMap.get('id');

  if (!id) {
    router.navigate([APP_ROUTES.ERROR]);
    return of(null);
  }

  return todosApiService.getTodoById(id).pipe(
    map((todo) => {
      if (!todo) {
        router.navigate([APP_ROUTES.ERROR]);
        return null;
      }
      return todo;
    }),
    catchError(() => {
      router.navigate([APP_ROUTES.ERROR]);
      return of(null);
    })
  );
};
