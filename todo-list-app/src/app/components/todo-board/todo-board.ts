import { Component, computed, DestroyRef, inject, OnInit, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouteStateService } from '../../services/route-state/route-state';
import { TodosStateService } from '../../services/todos-state/todos-state';
import { ITodoItem } from '../../shared/types/todo-item.interface';
import { Loader } from '../../shared/ui/loader/loader';
import { TodoListItem } from '../../shared/ui/todo-list-item/todo-list-item';
import { APP_ROUTES } from '../../shared/util/constants';

@Component({
  selector: 'app-todo-board',
  imports: [TodoListItem, Loader, RouterOutlet],
  templateUrl: './todo-board.html',
  styleUrl: './todo-board.scss',
})
export class TodoBoard implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
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

  private setupRouteListener(): void {
    this.routeState.setupRouteListener(
      this.destroyRef,
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
