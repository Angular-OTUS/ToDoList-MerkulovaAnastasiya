import {
  Component,
  computed,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ITodoItem } from '../../shared/types/todo-item.interface';
import { Loader } from '../../shared/ui/loader/loader';
import { generateTodoId } from '../../shared/util/helpers';
import { TodoForm } from '../todo-form/todo-form';
import { TodoListItem } from './todo-list-item/todo-list-item';
import { INITIAL_TODOS } from './todo-list.config';

@Component({
  selector: 'app-todo-list',
  imports: [TodoListItem, FormsModule, MatFormFieldModule, MatInputModule, Loader, TodoForm],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList implements OnInit, OnDestroy {
  private timeoutId?: number;
  protected todos: WritableSignal<ITodoItem[]> = signal<ITodoItem[]>(INITIAL_TODOS);

  public newTodoText: WritableSignal<string> = signal<string>('');
  public newTodoDescription: WritableSignal<string> = signal<string>('');

  public selectedItemId: WritableSignal<number | null> = signal<number | null>(null);

  public currentDescription = computed(() => {
    const selectedId = this.selectedItemId();
    if (!selectedId) return null;

    const todo = this.todos().find((t) => t.id === selectedId);
    return todo ? todo.description : null;
  });

  public isLoading: WritableSignal<boolean> = signal<boolean>(true);
  public isSubmitDisabled: Signal<boolean> = computed(
    () => !this.newTodoText().trim() && !this.newTodoDescription().trim()
  );

  public ngOnInit(): void {
    this.timeoutId = setTimeout(() => {
      this.isLoading.set(false);
    }, 500);
  }

  public ngOnDestroy(): void {
    if (this.timeoutId !== undefined) {
      window.clearTimeout(this.timeoutId);
    }
  }

  public addNewTodo(): void {
    if (this.isSubmitDisabled()) return;

    this.todos.update((currentTodos) => [
      ...currentTodos,
      {
        id: generateTodoId(this.todos()),
        text: this.newTodoText(),
        description: this.newTodoDescription(),
      },
    ]);

    this.newTodoText.set('');
    this.newTodoDescription.set('');
  }

  public selectTodoId(id: number): void {
    this.selectedItemId.set(id);
  }

  public deleteTodoById(id: number): void {
    this.todos.update((currentTodos) => [...currentTodos.filter((todo) => todo.id !== id)]);
  }
}
