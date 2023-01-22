import { CreateTodoUseCase } from 'todo-list/todo/application';
import { Priority } from 'todo-list/todo/domain';

export class CreateTodoDto implements CreateTodoUseCase.Input {
  title: string;
  priority: Priority;
  description?: string;
  is_scratched?: boolean;
}
