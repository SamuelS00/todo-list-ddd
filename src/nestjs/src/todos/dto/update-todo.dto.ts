import { UpdateTodoUseCase } from 'todo-list/todo/application';
import { CreateTodoDto } from './create-todo.dto';

export class UpdateTodoDto
  extends CreateTodoDto
  implements Omit<UpdateTodoUseCase.Input, 'id'> {}
