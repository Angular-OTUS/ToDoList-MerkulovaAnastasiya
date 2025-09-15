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
import { Loader } from "../../shared/ui/loader/loader";
import { ITodoItem } from './todo-item.interface';
import { TodoListItem } from './todo-list-item/todo-list-item';
import { INITIAL_TODOS } from './todo-list.config';
import { Button } from '../../shared/ui/button/button';

@Component({
  selector: 'app-todo-list',
  imports: [
    TodoListItem,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    Loader,
    Button
],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList implements OnInit, OnDestroy {
  private timeoutId: number | null = null;
  protected todos: WritableSignal<ITodoItem[]> = signal<ITodoItem[]>(INITIAL_TODOS);
  public newTodoText: WritableSignal<string> = signal<string>('');

  public isLoading: WritableSignal<Boolean> = signal<Boolean>(true);
  public isSubmitDisabled: Signal<boolean> = computed(() => !this.newTodoText().trim());

  public ngOnInit(): void {
    this.timeoutId = setTimeout(() => {
      this.isLoading.set(false);
    }, 500);
  }

  public ngOnDestroy(): void {
    if (!this.timeoutId) return;
    clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }

  public addNewTodo(e: Event): void {
    e.preventDefault();

    if (this.isSubmitDisabled()) return;

    const newId =
      this.todos().length > 0 ? Math.max(...this.todos().map((todo) => todo.id)) + 1 : 1;

    this.todos.update((currentTodos) => [
      ...currentTodos,
      {
        id: newId,
        text: this.newTodoText(),
      },
    ]);

    this.newTodoText.set('');
  }

  public deleteTodoById(id: number): void {
    this.todos.update((currentTodos) => [...currentTodos.filter((todo) => todo.id !== id)]);
  }
}
