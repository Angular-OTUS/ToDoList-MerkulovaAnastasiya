import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AddTodoDto, EditTodoDto } from '../../shared/types/dto/todo.dto';
import { ITodoItem } from '../../shared/types/todo-item.interface';
import { TodosApiService } from '../todos-api/todos-api';

@Injectable({
  providedIn: 'root',
})
export class TodosStateService {
  private destroy$ = new Subject<void>();
  private readonly todosApiService = inject(TodosApiService);

  public todos: WritableSignal<ITodoItem[]> = signal([]);
  public isLoading: WritableSignal<boolean> = signal(true);
  public selectedItemId: WritableSignal<string | null> = signal(null);
  public editingItemId: WritableSignal<string | null> = signal(null);
  public filterValue: WritableSignal<string | null> = signal(null);

  public completedTodos = computed(() =>
    this.todos().filter((todo) => todo.status === 'Completed')
  );

  public incompleteTodos = computed(() =>
    this.todos().filter((todo) => todo.status === 'InProgress')
  );

  public selectedTodo = computed(() => {
    const selectedId = this.selectedItemId();
    return selectedId ? this.todos().find((todo) => todo.id === selectedId) : null;
  });

  public editingTodo = computed(() => {
    const editingId = this.editingItemId();
    return editingId ? this.todos().find((todo) => todo.id === editingId) : null;
  });

  public filteredTodos = computed(() => {
    const filter = this.filterValue();

    if (!filter) {
      return this.todos();
    }

    return [...this.todos()].filter((todo) => todo.status === filter);
  });

  public onDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public loadTodos(): void {
    this.isLoading.set(true);
    this.todosApiService
      .getAllTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((todos) => {
        this.todos.set(todos);
        this.isLoading.set(false);
      });
  }

  public onFilterChange(value: string | null): void {
    this.filterValue.set(value);
  }

  public setSelectedItemId(id: string | null): void {
    this.selectedItemId.set(id);
  }

  public setEditingItemId(id: string | null): void {
    this.editingItemId.set(id);
  }

  public toggleEditing(id: string | null): void {
    this.editingItemId.set(id);
  }

  public addNewTodo(todoData: AddTodoDto): void {
    if (!todoData.text.trim() && !todoData.description.trim()) return;
    this.todosApiService
      .addNewTodo(todoData)
      .pipe(
        filter((newTodo) => !!newTodo),
        takeUntil(this.destroy$)
      )
      .subscribe((newTodo) => {
        this.todos.update((currentTodos) => [...currentTodos, newTodo]);
      });
  }

  public updateTodo(data: EditTodoDto): void {
    this.todosApiService
      .editTodo(data)
      .pipe(
        filter((updatedTodo) => !!updatedTodo),
        takeUntil(this.destroy$)
      )
      .subscribe((updatedTodo) => {
        this.todos.update((currentTodos) =>
          currentTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
        );
        this.toggleEditing(null);
      });
  }

  public deleteTodoById(id: string): void {
    this.todosApiService
      .removeTodo(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.todos.update((currentTodos) => currentTodos.filter((todo) => todo.id !== id));

        if (this.selectedItemId() === id) {
          this.selectedItemId.set(null);
        }
        if (this.editingItemId() === id) {
          this.editingItemId.set(null);
        }
      });
  }

}
