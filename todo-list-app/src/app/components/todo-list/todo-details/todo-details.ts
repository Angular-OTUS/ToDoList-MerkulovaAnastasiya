import { Component, computed, inject, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { TodosApi } from '../../../services/todos-api/todos-api';
import { APP_ROUTES } from '../../../shared/util/constants';

@Component({
  selector: 'app-todo-details',
  imports: [],
  templateUrl: './todo-details.html',
  styleUrl: './todo-details.scss',
})
export class TodoDetails implements OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly todosApiService = inject(TodosApi);
  private readonly router = inject(Router);

  private readonly todo$ = toSignal(
    this.activatedRoute.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        return id ? this.todosApiService.getTodoById(id) : [null];
      }),
      tap((todo) => {
        if (!todo) this.router.navigate([APP_ROUTES.ERROR]);
      })
    )
  );
  protected currentDescription = computed(() => this.todo$()?.description || null);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
