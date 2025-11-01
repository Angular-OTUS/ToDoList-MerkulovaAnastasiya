import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  Signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { TodosStateService } from '../../services/todos-state/todos-state';
import { ITodoItem } from '../../shared/types/todo-item.interface';
import { Loader } from '../../shared/ui/loader/loader';
import { TodoListItem } from '../../shared/ui/todo-list-item/todo-list-item';
import { APP_ROUTES } from '../../shared/util/constants';
import { TodoFilter } from '../todo-filter/todo-filter';
import { RouteStateService } from '../../services/route-state/route-state';

@Component({
  selector: 'app-todo-list',
  imports: [TodoListItem, Loader, TodoFilter, RouterOutlet],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoList implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  private readonly todosState: TodosStateService = inject(TodosStateService);
  private readonly routeState: RouteStateService = inject(RouteStateService);

  protected todos: Signal<ITodoItem[]> = this.todosState.todos;
  protected isLoading: Signal<boolean> = this.todosState.isLoading;
  protected filterValue: Signal<string | null> = this.todosState.filterValue;
  protected filteredTodos: Signal<ITodoItem[]> = this.todosState.filteredTodos;
  protected selectedItemId: Signal<string | null> = this.todosState.selectedItemId;

  protected showDetailsContainer = computed(() => !!this.selectedItemId());

  public ngOnInit(): void {
    this.todosState.loadTodos();
    this.setupRouteListener();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.todosState.onDestroy();
  }

  private setupRouteListener(): void {
    this.routeState.setupRouteListener(
      this.destroy$,
      (id) => this.todosState.setSelectedItemId(id),
      [APP_ROUTES.TASKS]
    );
  }

  protected selectTodoId(id: string): void {
    this.todosState.setSelectedItemId(id);
    this.routeState.navigateWithId(APP_ROUTES.TASKS, id);
  }

  protected onFilterChange(value: string | null): void {
    this.todosState.onFilterChange(value);
    this.todosState.setSelectedItemId(null);
    this.routeState.navigateWithId(APP_ROUTES.TASKS, null);
  }

  protected onDeleteSuccess(id: string): void {
    if (this.selectedItemId() !== id) return;
    this.todosState.setSelectedItemId(null);
    this.routeState.navigateWithId(APP_ROUTES.TASKS, null);
  }
}
