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
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { TodosApi } from '../../services/todos-api/todos-api';
import { AddTodoDto, EditTodoDto } from '../../shared/types/dto/todo.dto';
import { ITodoItem } from '../../shared/types/todo-item.interface';
import { Loader } from '../../shared/ui/loader/loader';
import { TodoFilter } from '../todo-filter/todo-filter';
import { TodoForm } from '../todo-form/todo-form';
import { TodoListItem } from './todo-list-item/todo-list-item';

@Component({
  selector: 'app-todo-list',
  imports: [TodoListItem, Loader, TodoForm, TodoFilter],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly todosApiService = inject(TodosApi);

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

  private selectedId$ = toObservable(this.selectedItemId).pipe(takeUntil(this.destroy$));

  protected selectedTodo = toSignal(
    this.selectedId$.pipe(
      switchMap((selectedId) =>
        selectedId ? this.todosApiService.getTodoById(selectedId) : of(null),
      ),
    ),
    { initialValue: null },
  );

  protected currentDescription = computed(() => this.selectedTodo()?.description || null);

  public ngOnInit(): void {
    this.loadTodos();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
  }

  protected onFilterChange(value: string | null): void {
    this.filterValue.set(value);
    this.selectedItemId.set(null);
  }

  protected addNewTodo(todoData: AddTodoDto): void {
    if (!todoData.text.trim() && !todoData.description.trim()) return;
    this.todosApiService
      .addNewTodo(todoData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((newTodo) => {
        if (newTodo) {
          this.todos.update((currentTodos) => [...currentTodos, newTodo]);
        }
      });
  }

  protected updateTodo(data: EditTodoDto): void {
    this.todosApiService
      .editTodo(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((updatedTodo) => {
        if (updatedTodo) {
          this.todos.update((currentTodos) =>
            currentTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
          );
          this.closeEditing();
        }
      });
  }

  protected deleteTodoById(id: string): void {
    if (this.selectedItemId() === id) {
      this.selectedItemId.set(null);
    }

    this.todosApiService
      .removeTodo(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.todos.update((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
      });
  }
}
