import { CreateTodoUseCase } from 'todo-list/todo/application';
// import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTodoDto implements CreateTodoUseCase.Input {
  title: string;
  priority: number;
  description?: string;
  is_scratched?: boolean;
}
