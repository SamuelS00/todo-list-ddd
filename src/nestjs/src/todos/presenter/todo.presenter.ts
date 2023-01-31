import { TodoOutput } from 'todo-list/todo/application';
import { Exclude, Transform } from 'class-transformer';

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
