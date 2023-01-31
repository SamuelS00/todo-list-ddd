import {
  TodoCollectionPresenter,
  TodoPresenter,
} from '../../presenter/todo.presenter';
import { SortDirection } from 'todo-list/@shared/domain';
import {
  CreateTodoUseCase,
  GetTodoUseCase,
  ListTodosUseCase,
  UpdateTodoUseCase,
} from 'todo-list/todo/application';
import { CreateTodoDto } from '../../dto/create-todo.dto';
import { UpdateTodoDto } from '../../dto/update-todo.dto';
import { TodosController } from '../../todos.controller';

describe('TodosController Unit Tests', () => {
  let controller: TodosController;

  beforeEach(() => {
    controller = new TodosController();
  });

  it('should creates a todo', async () => {
    const id = '22c7bbc8-b798-481e-b9fd-5bacd3c235c6';
    const output: CreateTodoUseCase.Output = {
      id,
      title: 'Supermarket',
      priority: 1,
      description: 'buy fruits',
      is_scratched: false,
      created_at: new Date(),
    };

    const expectedPresenter = new TodoPresenter(output);

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedPresenter)),
    };

    //@ts-expect-error mock for testing
    controller['createUseCase'] = mockCreateUseCase;

    const input: CreateTodoDto = {
      title: 'Supermarket',
      priority: 1,
      description: 'buy fruits',
    };

    const presenter = await controller.create(input);

    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(TodoPresenter);
    expect(presenter).toStrictEqual(new TodoPresenter(expectedPresenter));
  });

  it('should updates a todo', async () => {
    const id = '22c7bbc8-b798-481e-b9fd-5bacd3c235c6';
    const output: UpdateTodoUseCase.Output = {
      id,
      title: 'Supermarket',
      priority: 1,
      description: 'buy fruits',
      is_scratched: false,
      created_at: new Date(),
    };

    const expectedPresenter = new TodoPresenter(output);

    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedPresenter)),
    };

    //@ts-expect-error mock for testing
    controller['updateUseCase'] = mockUpdateUseCase;

    const input: UpdateTodoDto = {
      title: 'Supermarket',
      priority: 1,
      description: 'buy fruits',
    };

    const presenter = await controller.update(id, input);

    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    expect(presenter).toBeInstanceOf(TodoPresenter);
    expect(presenter).toStrictEqual(expectedPresenter);
  });

  it('should deletes a todo', async () => {
    const expectOutput = undefined;

    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectOutput)),
    };

    //@ts-expect-error mock for testing
    controller['deleteUseCase'] = mockDeleteUseCase;

    const id = '22c7bbc8-b798-481e-b9fd-5bacd3c235c6';
    expect(controller.remove(id)).toBeInstanceOf(Promise);
    const output = await controller.remove(id);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(expectOutput).toStrictEqual(output);
  });

  it('should gets a todo', async () => {
    const id = '22c7bbc8-b798-481e-b9fd-5bacd3c235c6';
    const output: GetTodoUseCase.Output = {
      id,
      title: 'Supermarket',
      priority: 1,
      description: 'buy fruits',
      is_scratched: false,
      created_at: new Date(),
    };

    const expectedPresenter = new TodoPresenter(output);

    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedPresenter)),
    };

    //@ts-expect-error mock for testing
    controller['getUseCase'] = mockGetUseCase;

    const presenter = await controller.findOne(id);

    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(presenter).toBeInstanceOf(TodoPresenter);
    expect(presenter).toStrictEqual(new TodoPresenter(expectedPresenter));
  });

  it('should list todos', async () => {
    const id = '22c7bbc8-b798-481e-b9fd-5bacd3c235c6';
    const output: ListTodosUseCase.Output = {
      items: [
        {
          id,
          title: 'Supermarket',
          priority: 1,
          description: 'buy fruits',
          is_scratched: false,
          created_at: new Date(),
        },
      ],
      current_page: 1,
      last_page: 1,
      per_page: 1,
      total: 1,
    };

    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    //@ts-expect-error mock for testing
    controller['listUseCase'] = mockListUseCase;

    const searchParams = {
      page: 1,
      per_page: 2,
      sort_dir: 'desc' as SortDirection,
      filter: 'test',
    };

    const presenter = await controller.search(searchParams);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toBeInstanceOf(TodoCollectionPresenter);
    expect(presenter).toStrictEqual(new TodoCollectionPresenter(output));
  });
});
