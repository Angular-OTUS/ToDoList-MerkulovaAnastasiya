import { ITodoItem } from '../types/todo-item.interface';

export const generateTodoId = (todos: ITodoItem[]) =>
  todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) + 1 : 1;
