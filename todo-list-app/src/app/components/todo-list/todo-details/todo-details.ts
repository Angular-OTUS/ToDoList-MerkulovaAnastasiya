import { Component, computed, inject, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { TodosApi } from '../../../services/todos-api/todos-api';

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
  private readonly todo$ = toSignal(
    this.activatedRoute.paramMap.pipe(
      takeUntil(this.destroy$),
      switchMap((params) => {
        const id = params.get('id');
        return id ? this.todosApiService.getTodoById(id) : [null];
      }),
    ),
  );

  protected currentDescription = computed(() => this.todo$()?.description || null);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
