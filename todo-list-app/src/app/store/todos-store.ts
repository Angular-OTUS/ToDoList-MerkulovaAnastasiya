import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, switchMap, tap } from 'rxjs/operators';

import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { of, pipe } from 'rxjs';
import { TodosApiService } from '../services/todos-api/todos-api';
import { AddTodoDto, EditTodoDto } from '../shared/types/dto/todo.dto';
import { ITodoItem } from '../shared/types/todo-item.interface';

interface TodosState {
  todos: ITodoItem[];
  isLoading: boolean;
  selectedItemId: string | null;
  editingItemId: string | null;
  filterValue: string | null;
}

const initialState: TodosState = {
  todos: [],
  isLoading: false,
  selectedItemId: null,
  editingItemId: null,
  filterValue: null,
};

export const TodosStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ todos, selectedItemId, editingItemId, filterValue }) => ({
    completedTodos: computed(() => todos().filter((todo) => todo.status === 'Completed')),
    incompleteTodos: computed(() => todos().filter((todo) => todo.status === 'InProgress')),
    selectedTodo: computed(() => {
      const selectedId = selectedItemId();
      return selectedId ? todos().find((todo) => todo.id === selectedId) : null;
    }),
    editingTodo: computed(() => {
      const editingId = editingItemId();
      return editingId ? todos().find((todo) => todo.id === editingId) : null;
    }),
    filteredTodos: computed(() => {
      const filter = filterValue();
      return !filter ? todos() : todos().filter((todo) => todo.status === filter);
    }),
  })),
  withMethods((store, todosApiService = inject(TodosApiService)) => {
    return {
      setSelectedItemId: (selectedItemId: string | null) => patchState(store, { selectedItemId }),
      setEditingItemId: (editingItemId: string | null) => patchState(store, { editingItemId }),
      onFilterChange: (filterValue: string | null) => patchState(store, { filterValue }),

      loadTodos: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() =>
            todosApiService.getAllTodos().pipe(
              tap((todos) => patchState(store, { todos, isLoading: false })),
              catchError(() => {
                patchState(store, { isLoading: false });
                return of([]);
              })
            )
          )
        )
      ),
      addNewTodo: rxMethod<AddTodoDto>(
        pipe(
          switchMap((todoData) => {
            if (!todoData.text?.trim() && !todoData.description?.trim()) return of(null);
            patchState(store, { isLoading: true });
            return todosApiService.addNewTodo(todoData).pipe(
              tap((newTodo) => {
                if (newTodo) {
                  patchState(store, (state) => ({
                    todos: [...state.todos, newTodo],
                    isLoading: false,
                  }));
                } else {
                  patchState(store, { isLoading: false });
                }
              }),
              catchError(() => {
                patchState(store, { isLoading: false });
                return of(null);
              })
            );
          })
        )
      ),
      updateTodo: rxMethod<EditTodoDto>(
        pipe(
          switchMap((todoData) => {
            patchState(store, { isLoading: true });
            return todosApiService.editTodo(todoData).pipe(
              tap((updatedTodo) => {
                if (updatedTodo) {
                  patchState(store, (state) => ({
                    todos: state.todos.map((todo) =>
                      todo.id === updatedTodo.id ? updatedTodo : todo
                    ),
                    editingItemId: null,
                    isLoading: false,
                  }));
                } else {
                  patchState(store, { isLoading: false });
                }
              }),
              catchError(() => {
                patchState(store, { isLoading: false });
                return of(null);
              })
            );
          })
        )
      ),
      deleteTodoById: rxMethod<string>(
        pipe(
          switchMap((id) => {
            patchState(store, (state) => ({
              todos: state.todos.filter((todo) => todo.id !== id),
              editingItemId: state.editingItemId === id ? null : state.editingItemId,
              selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
            }));

            return todosApiService.removeTodo(id).pipe(
              catchError(() => {
                patchState(store, { todos: store.todos() });
                return of(null);
              })
            );
          })
        )
      ),
    };
  }),
  withHooks({
    onInit(store) {
      store.loadTodos();
    },
  })
);
