import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { TodosApi } from '../../services/todos-api/todos-api';
import { AddTodoDto, EditTodoDto } from '../../shared/types/dto/todo.dto';
import { ITodoItem } from '../../shared/types/todo-item.interface';
import { Loader } from '../../shared/ui/loader/loader';
import { APP_ROUTES } from '../../shared/util/constants';
import { TodoFilter } from '../todo-filter/todo-filter';
import { TodoForm } from '../todo-form/todo-form';
import { TodoListItem } from './todo-list-item/todo-list-item';

@Component({
  selector: 'app-todo-list',
  imports: [TodoListItem, Loader, TodoForm, TodoFilter, RouterOutlet],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly todosApiService = inject(TodosApi);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  protected todos: WritableSignal<ITodoItem[]> = signal([]);
  protected isLoading: WritableSignal<boolean> = signal(true);

  protected selectedItemId: WritableSignal<string | null> = signal(null);
  protected editingItemId: WritableSignal<string | null> = signal(null);

  protected filterValue: WritableSignal<string | null> = signal(null);

  protected filteredTodos: Signal<ITodoItem[]> = computed(() => {
    const filter = this.filterValue();

    if (!filter) {
      return this.todos();
    }

    return [...this.todos()].filter((todo) => todo.status === filter);
  });

  public ngOnInit(): void {
    this.loadTodos();
    this.setupRouteListener();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupRouteListener(): void {
    this.activatedRoute.firstChild?.paramMap
      .pipe(
        takeUntil(this.destroy$),
        map((params) => params.get('id')),
      )
      .subscribe((id) => this.selectedItemId.set(id));
  }

  private loadTodos(): void {
    this.isLoading.set(true);
    this.todosApiService
      .getAllTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((todos) => {
        this.todos.set(todos);
        this.isLoading.set(false);
      });
  }

  protected openEditing(id: string): void {
    this.editingItemId.set(id);
  }

  protected closeEditing(): void {
    this.editingItemId.set(null);
  }

  protected selectTodoId(id: string): void {
    this.selectedItemId.set(id);
    this.router.navigate([APP_ROUTES.TASKS, id]);
  }

  protected onFilterChange(value: string | null): void {
    this.filterValue.set(value);
    this.selectedItemId.set(null);
    this.router.navigate([APP_ROUTES.TASKS]);
  }

  protected addNewTodo(todoData: AddTodoDto): void {
    if (!todoData.text.trim() && !todoData.description.trim()) return;
    this.todosApiService
      .addNewTodo(todoData)
      .pipe(
        filter((newTodo) => !!newTodo),
        takeUntil(this.destroy$),
      )
      .subscribe((newTodo) => {
        this.todos.update((currentTodos) => [...currentTodos, newTodo]);
      });
  }

  protected updateTodo(data: EditTodoDto): void {
    this.todosApiService
      .editTodo(data)
      .pipe(
        filter((updatedTodo) => !!updatedTodo),
        takeUntil(this.destroy$),
      )
      .subscribe((updatedTodo) => {
        this.todos.update((currentTodos) =>
          currentTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
        );
        this.closeEditing();
      });
  }

  protected deleteTodoById(id: string): void {
    if (this.selectedItemId() === id) {
      this.selectedItemId.set(null);
      this.router.navigate([APP_ROUTES.TASKS]);
    }

    this.todosApiService
      .removeTodo(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.todos.update((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
      });
  }
}
