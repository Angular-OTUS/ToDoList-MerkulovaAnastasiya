import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouteStateService } from '../../services/route-state/route-state';
import { Loader } from '../../shared/ui/loader/loader';
import { TodoListItem } from '../../shared/ui/todo-list-item/todo-list-item';
import { APP_ROUTES } from '../../shared/util/constants';
import { TodoFilter } from '../todo-filter/todo-filter';
import { TodosStore } from '../../store/todos-store';

@Component({
  selector: 'app-todo-list',
  imports: [TodoListItem, Loader, TodoFilter, RouterOutlet],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoList {
  protected readonly todosStore = inject(TodosStore);
  private readonly routeState: RouteStateService = inject(RouteStateService);

  protected showDetailsContainer = computed(() => !!this.todosStore.selectedItemId());

  constructor() {
    this.routeState.setupRouteListener(
      inject(DestroyRef),
      (id) => this.todosStore.setSelectedItemId(id),
      [APP_ROUTES.TASKS]
    );

    effect(() => {
      const selectedId = this.todosStore.selectedItemId();
      this.routeState.navigateWithId(APP_ROUTES.TASKS, selectedId);
    });
  }

  protected onFilterChange(value: string | null): void {
    this.todosStore.onFilterChange(value);
    this.todosStore.setSelectedItemId(null);
  }
}
