import { SortDirection } from 'todo-list/@shared/domain';
import {
  CreateTodoUseCase,
  GetTodoUseCase,
  ListTodosUseCase,
  UpdateTodoUseCase,
} from 'todo-list/todo/application';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodosController } from './todos.controller';

describe('TodosController Unit Tests', () => {
  let controller: TodosController;

  beforeEach(() => {
    controller = new TodosController();
  });

  it('should creates a todo', async () => {
    const expectedOutput: CreateTodoUseCase.Output = {
      id: '22c7bbc8-b798-481e-b9fd-5bacd3c235c6',
      title: 'Supermarket',
      priority: 'low',
      description: 'buy fruits',
      is_scratched: false,
      created_at: new Date(),
    };

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    controller['createUseCase'] = mockCreateUseCase;

    const input: CreateTodoDto = {
      title: 'Supermarket',
      priority: 'low',
      description: 'buy fruits',
    };

    const output = await controller.create(input);

    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(expectedOutput).toStrictEqual(output);
  });

  it('should updates a todo', async () => {
    const id = '22c7bbc8-b798-481e-b9fd-5bacd3c235c6';
    const expectedOutput: UpdateTodoUseCase.Output = {
      id,
      title: 'Supermarket',
      priority: 'low',
      description: 'buy fruits',
      is_scratched: false,
      created_at: new Date(),
    };

    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    controller['updateUseCase'] = mockUpdateUseCase;

    const input: UpdateTodoDto = {
      title: 'Supermarket',
      priority: 'low',
      description: 'buy fruits',
    };

    const output = await controller.update(id, input);

    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    expect(expectedOutput).toStrictEqual(output);
  });

  it('should deletes a todo', async () => {
    const expectOutput = undefined;

    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectOutput)),
    };

    controller['deleteUseCase'] = mockDeleteUseCase;
    const id = '22c7bbc8-b798-481e-b9fd-5bacd3c235c6';
    expect(controller.remove(id)).toBeInstanceOf(Promise);
    const output = await controller.remove(id);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(expectOutput).toStrictEqual(output);
  });

  it('should gets a todo', async () => {
    const id = '22c7bbc8-b798-481e-b9fd-5bacd3c235c6';
    const expectedOutput: GetTodoUseCase.Output = {
      id,
      title: 'Supermarket',
      priority: 'low',
      description: 'buy fruits',
      is_scratched: false,
      created_at: new Date(),
    };

    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    controller['getUseCase'] = mockGetUseCase;

    const output = await controller.findOne(id);

    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(expectedOutput).toStrictEqual(output);
  });

  it('should list todos', async () => {
    const id = '22c7bbc8-b798-481e-b9fd-5bacd3c235c6';
    const expectedOutput: ListTodosUseCase.Output = {
      items: [
        {
          id,
          title: 'Supermarket',
          priority: 'low',
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
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    controller['listUseCase'] = mockListUseCase;

    const searchParams = {
      page: 1,
      per_page: 2,
      sort: 'priority',
      sort_dir: 'desc' as SortDirection,
      filter: 'test',
    };

    const output = await controller.search(searchParams);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(expectedOutput).toStrictEqual(output);
  });
});
