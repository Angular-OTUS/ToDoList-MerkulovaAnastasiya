export const TOOLTIP_TEXT = {
  LIST_ITEM: 'Show description. Double click opens editor.',
  ADD_BUTTON: 'Save todo',
  DELETE_BUTTON: 'Remove todo',
  SAVE_TITLE: 'Save new title',
} as const;

export const TOAST_TEXT = {
  ADD_TODO: 'Todo successfully saved',
  DELETE_TODO: 'Todo was removed',
  UPDATE_TODO: 'Todo was updated',
  ERROR_TODO: 'Failed to manage todo',
  ERROR_TODOS: 'Failed to fetch todos',
} as const;

export const TOAST_VARIANT = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export const TOAST_ICONS = {
  [TOAST_VARIANT.SUCCESS]: 'check_circle',
  [TOAST_VARIANT.ERROR]: 'error',
} as const;

export const DEFAULT_FILTER_STATUS='ALL'

export const TODO_STATUS = {
  INPROGRESS : 'InProgress',
  COMPLETED: 'Completed',
} as const;
