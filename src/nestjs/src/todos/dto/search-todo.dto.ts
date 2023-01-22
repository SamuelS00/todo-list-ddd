import { SortDirection } from 'todo-list/@shared/domain';
import { ListTodosUseCase } from 'todo-list/todo/application';

export class SearchTodoDto implements ListTodosUseCase.Input {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: string;
}
