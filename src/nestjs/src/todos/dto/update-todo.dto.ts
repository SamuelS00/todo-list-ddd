import { UpdateTodoUseCase } from 'todo-list/todo/application';

export class UpdateTodoDto implements Omit<UpdateTodoUseCase.Input, 'id'> {
  title: string;
  priority: 'low' | 'medium' | 'high';
  description?: string;
  is_scratched?: boolean;
}
