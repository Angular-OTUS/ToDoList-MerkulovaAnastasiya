import { TTodoStatus } from '../todo-item.interface';

export interface AddTodoDto {
  text: string;
  description: string;
}

export interface EditTodoDto extends AddTodoDto {
  id: string;
  status: TTodoStatus;
}
