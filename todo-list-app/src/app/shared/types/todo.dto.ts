export interface AddTodoDto {
  text: string;
  description: string;
}

export interface EditTodoDto extends AddTodoDto {
  id: number;
}
