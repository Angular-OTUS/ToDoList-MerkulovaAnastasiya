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
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TodosDataService } from '../../services/todos-data/todos-data';
import { ITodoItem } from '../../shared/types/todo-item.interface';
import { Loader } from '../../shared/ui/loader/loader';
import { TodoForm } from '../todo-form/todo-form';
import { TodoListItem } from './todo-list-item/todo-list-item';
import { EditTodoDto } from '../../shared/types/todo.dto';

@Component({
  selector: 'app-todo-list',
  imports: [TodoListItem, FormsModule, MatFormFieldModule, MatInputModule, Loader, TodoForm],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList implements OnInit, OnDestroy {
  private timeoutId?: number;
  private readonly todosDataService: TodosDataService = inject(TodosDataService);

  protected todos: WritableSignal<ITodoItem[]> = signal<ITodoItem[]>(
    this.todosDataService.getAllTodos()
  );
  public newTodoText: WritableSignal<string> = signal<string>('');
  public newTodoDescription: WritableSignal<string> = signal<string>('');

  public selectedItemId: WritableSignal<number | null> = signal<number | null>(null);

  public currentDescription = computed(() => {
    const selectedId = this.selectedItemId();
    if (!selectedId) return null;

    const todo = this.todosDataService.getTodoById(selectedId);

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

    const todoData = {
      text: this.newTodoText(),
      description: this.newTodoDescription(),
    };

    this.todosDataService.addNewTodo(todoData);
    this.todos.set(this.todosDataService.getAllTodos());

    this.newTodoText.set('');
    this.newTodoDescription.set('');
  }

  public selectTodoId(id: number): void {
    this.selectedItemId.set(id);
  }

  public updateTodo(data: EditTodoDto): void {
    this.todosDataService.editTodo(data);
  }

  public deleteTodoById(id: number): void {
    if (this.selectedItemId() === id) {
      this.selectedItemId.set(null);
    }
    this.todosDataService.removeTodo(id);
    this.todos.set(this.todosDataService.getAllTodos());
  }
}
