import { Component, computed, DestroyRef, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouteStateService } from '../../services/route-state/route-state';
import { Loader } from '../../shared/ui/loader/loader';
import { TodoListItem } from '../../shared/ui/todo-list-item/todo-list-item';
import { APP_ROUTES } from '../../shared/util/constants';
import { TodosStore } from '../../store/todos-store';

@Component({
  selector: 'app-todo-board',
  imports: [TodoListItem, Loader, RouterOutlet],
  templateUrl: './todo-board.html',
  styleUrl: './todo-board.scss',
})
export class TodoBoard {
  protected readonly todosStore = inject(TodosStore);
  private readonly routeState = inject(RouteStateService);

  protected showDetailsContainer = computed(() => !!this.todosStore.selectedItemId());

  constructor() {
    this.routeState.setupRouteListener(
      inject(DestroyRef),
      (id) => this.todosStore.setSelectedItemId(id),
      [APP_ROUTES.BOARD]
    );

    effect(() => {
      const selectedId = this.todosStore.selectedItemId();
      this.routeState.navigateWithId(APP_ROUTES.BOARD, selectedId);
    });
  }
}
