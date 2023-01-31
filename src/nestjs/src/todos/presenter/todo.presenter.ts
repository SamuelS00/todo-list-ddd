import { ListTodosUseCase, TodoOutput } from 'todo-list/todo/application';
import { Transform } from 'class-transformer';
import { CollectionPresenter } from '../../@shared/presenters/collection.presenter';

export class TodoPresenter {
  id: string;
  title: string;
  priority: number;
  description: string | null;
  is_scratched: boolean;
  @Transform(({ value }) => value.toISOString())
  created_at: Date;

  constructor(output: TodoOutput) {
    this.id = output.id;
    this.title = output.title;
    this.priority = output.priority;
    this.description = output.description;
    this.is_scratched = output.is_scratched;
    this.created_at = output.created_at;
  }
}

export class TodoCollectionPresenter extends CollectionPresenter {
  data: TodoPresenter[];

  constructor(output: ListTodosUseCase.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((item) => new TodoPresenter(item));
  }
}
