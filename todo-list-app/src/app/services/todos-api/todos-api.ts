import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AddTodoDto, EditTodoDto } from '../../shared/types/dto/todo.dto';
import { ITodoItem } from '../../shared/types/todo-item.interface';
import { TOAST_TEXT, TOAST_VARIANT, TODO_STATUS } from '../../shared/util/constants';
import { ToastService } from '../toast/toast';

@Injectable({
  providedIn: 'root',
})
export class TodosApi {
  private readonly baseUrl: string = `${environment.baseApi}/todos`;
  private readonly http: HttpClient = inject(HttpClient);
  private readonly toastService: ToastService = inject(ToastService);

  private handleSuccess(message: string) {
    this.toastService.addToast({
      variant: TOAST_VARIANT.SUCCESS,
      message: message,
    });
  }

  private handleError<T>(message: string, result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(message, error);
      this.toastService.addToast({
        variant: TOAST_VARIANT.ERROR,
        message: message,
      });
      return of(result as T);
    };
  }

  public addNewTodo(newTodo: AddTodoDto): Observable<ITodoItem | null> {
    return this.http
      .post<ITodoItem>(this.baseUrl, { ...newTodo, status: TODO_STATUS.INPROGRESS })
      .pipe(
        tap(() => this.handleSuccess(TOAST_TEXT.ADD_TODO)),
        catchError(this.handleError<ITodoItem | null>(TOAST_TEXT.ERROR_TODO, null)),
      );
  }

  public editTodo(todo: EditTodoDto): Observable<ITodoItem | null> {
    return this.http.put<ITodoItem>(`${this.baseUrl}/${todo.id}`, todo).pipe(
      tap(() => this.handleSuccess(TOAST_TEXT.UPDATE_TODO)),
      catchError(this.handleError<ITodoItem | null>(TOAST_TEXT.ERROR_TODO, null)),
    );
  }

  public removeTodo(id: string): Observable<unknown | null> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.handleSuccess(TOAST_TEXT.DELETE_TODO)),
      catchError(this.handleError<null>(TOAST_TEXT.ERROR_TODO, null)),
    );
  }

  public getTodoById(id: string): Observable<ITodoItem | null> {
    return this.http
      .get<ITodoItem>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError<ITodoItem | null>(TOAST_TEXT.ERROR_TODO, null)));
  }

  public getAllTodos(): Observable<ITodoItem[]> {
    return this.http.get<ITodoItem[]>(this.baseUrl).pipe(
      catchError(this.handleError<ITodoItem[]>(TOAST_TEXT.ERROR_TODOS, [])),
    );
  }
}
