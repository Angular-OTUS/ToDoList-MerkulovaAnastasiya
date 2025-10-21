import { Component, computed, inject, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TodosApi } from '../../services/todos-api/todos-api';
import { ITodoItem } from '../../shared/types/todo-item.interface';
import { Loader } from "../../shared/ui/loader/loader";
import { TodoListItem } from '../../shared/ui/todo-list-item/todo-list-item';
import { TODO_STATUS } from '../../shared/util/constants';

@Component({
  selector: 'app-todo-board',
  imports: [TodoListItem, Loader],
  templateUrl: './todo-board.html',
  styleUrl: './todo-board.scss'
})
export class TodoBoard implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly todosApiService = inject(TodosApi);
  protected todos: WritableSignal<ITodoItem[]> = signal([]);
  protected isLoading: WritableSignal<boolean> = signal(true);

   protected completedTodos: Signal<ITodoItem[]> = computed(() => {
    return [...this.todos()].filter((todo) => todo.status === TODO_STATUS.COMPLETED);
  });
   protected inprogressTodos: Signal<ITodoItem[]> = computed(() => {
    return [...this.todos()].filter((todo) => todo.status === TODO_STATUS.INPROGRESS);
  });

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
}
