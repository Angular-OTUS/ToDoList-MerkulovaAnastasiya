import { Component, computed, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { TodosStateService } from '../../services/todos-state/todos-state';
import { ITodoItem } from '../../shared/types/todo-item.interface';
import { Loader } from '../../shared/ui/loader/loader';
import { TodoListItem } from '../../shared/ui/todo-list-item/todo-list-item';
import { APP_ROUTES } from '../../shared/util/constants';
import { RouteStateService } from '../../services/route-state/route-state';

@Component({
  selector: 'app-todo-board',
  imports: [TodoListItem, Loader, RouterOutlet],
  templateUrl: './todo-board.html',
  styleUrl: './todo-board.scss',
})
export class TodoBoard implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  private readonly todosState: TodosStateService = inject(TodosStateService);
  private readonly routeState: RouteStateService = inject(RouteStateService);

  protected completedTodos: Signal<ITodoItem[]> = this.todosState.completedTodos;
  protected inprogressTodos: Signal<ITodoItem[]> = this.todosState.incompleteTodos;
  protected isLoading: Signal<boolean> = this.todosState.isLoading;
  protected selectedItemId: Signal<string | null> = this.todosState.selectedItemId;

  protected showDetailsContainer = computed(() => !!this.selectedItemId());

  ngOnInit(): void {
    this.todosState.loadTodos();
    this.setupRouteListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.todosState.onDestroy();
  }

  private setupRouteListener(): void {
    this.routeState.setupRouteListener(
      this.destroy$,
      (id) => this.todosState.setSelectedItemId(id),
      [APP_ROUTES.BOARD]
    );
  }

  protected selectTodoId(id: string): void {
    this.todosState.setSelectedItemId(id);
    this.routeState.navigateWithId(APP_ROUTES.BOARD, id);
  }

  protected onDeleteSuccess(id: string): void {
    if (this.selectedItemId() !== id) return;
    this.todosState.setSelectedItemId(null);
    this.routeState.navigateWithId(APP_ROUTES.BOARD, null);
  }
}
