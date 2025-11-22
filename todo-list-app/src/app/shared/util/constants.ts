export const TOOLTIP_TEXT = {
  LIST_ITEM: 'tooltips.showDescription',
  ADD_BUTTON: 'tooltips.saveTodo',
  DELETE_BUTTON: 'tooltips.removeTodo',
  SAVE_TITLE: 'tooltips.saveTitle',
} as const;

export const TOAST_TEXT = {
  ADD_TODO: 'toasts.addTodoSuccess',
  DELETE_TODO: 'toasts.deleteTodoSuccess',
  UPDATE_TODO: 'toasts.updateTodoSuccess',
  ERROR_TODO: 'toasts.failedToManageTodo',
  ERROR_TODOS: 'toasts.failedToFetchTodos',
} as const;

export const TOAST_VARIANT = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export const TOAST_ICONS = {
  [TOAST_VARIANT.SUCCESS]: 'check_circle',
  [TOAST_VARIANT.ERROR]: 'error',
} as const;

export const DEFAULT_FILTER_STATUS = 'ALL';

export const TODO_STATUS = {
  INPROGRESS: 'InProgress',
  COMPLETED: 'Completed',
} as const;

export const APP_ROUTES = {
  MAIN: '',
  TASKS: 'tasks',
  BOARD: 'board',
  TASK_DETAILS: ':id',
  ERROR: '**',
} as const;

export const ROUTE_TITLES = {
  MAIN: 'Main',
  BACKLOG: 'Backlog',
  BOARD: 'Board',
  ERROR: 'Error',
} as const;
