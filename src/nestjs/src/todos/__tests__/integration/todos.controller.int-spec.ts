import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateTodoUseCase,
  UpdateTodoUseCase,
  GetTodoUseCase,
  DeleteTodoUseCase,
  ListTodosUseCase,
} from 'todo-list/todo/application';
import { Todo, TodoRepository } from 'todo-list/todo/domain';
import { ConfigModule } from '../../../config/config.module';
import { DatabaseModule } from '../../../database/database.module';
import { TodosModule } from '../../../todos/todos.module';
import { TodosController } from '../../todos.controller';
import {
  CreateTodoFixture,
  ListTodosFixture,
  UpdateTodoFixture,
} from '../../fixures/fixures';
import {
  TodoCollectionPresenter,
  TodoPresenter,
} from '../../../todos/presenter/todo.presenter';
import { TODO_PROVIDERS } from '../../providers/todo.provider';
import { NotFoundError } from 'todo-list/@shared/domain';

describe('TodosController Integration Tests', () => {
  let controller: TodosController;
  let repository: TodoRepository.Repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, TodosModule],
    }).compile();

    controller = module.get(TodosController);
    repository = module.get(
      TODO_PROVIDERS.REPOSITORIES.TODO_SEQUELIZE_REPOSITORY.provide,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();

    expect(controller['createUseCase']).toBeInstanceOf(
      CreateTodoUseCase.UseCase,
    );
    expect(controller['updateUseCase']).toBeInstanceOf(
      UpdateTodoUseCase.UseCase,
    );
    expect(controller['deleteUseCase']).toBeInstanceOf(
      DeleteTodoUseCase.UseCase,
    );
    expect(controller['getUseCase']).toBeInstanceOf(GetTodoUseCase.UseCase);
    expect(controller['listUseCase']).toBeInstanceOf(ListTodosUseCase.UseCase);
  });

  describe('should create a todo', () => {
    const arrange = CreateTodoFixture.arrangeForSave();

    test.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.create(send_data as any);
        const entity = await repository.findById(presenter.id);

        expect(entity.toJSON()).toStrictEqual({
          id: presenter.id,
          ...send_data,
          ...expected,
          created_at: presenter.created_at,
        });

        expect(presenter).toEqual(new TodoPresenter(entity.toJSON()));
      },
    );
  });

  describe('should update a todo', () => {
    const arrange = UpdateTodoFixture.arrangeForSave();

    test.each(arrange)(
      'with send data $send_data',
      async ({ send_data, expected }) => {
        const entity = Todo.fake().aTodo().build();
        await repository.insert(entity);

        const presenter = await controller.update(entity.id, send_data as any);

        const foundEntity = await repository.findById(entity.id);

        expect(foundEntity.toJSON()).toMatchObject({
          id: presenter.id,
          created_at: presenter.created_at,
          ...send_data,
          ...expected,
        });

        const expectedPresenter = new TodoPresenter(foundEntity.toJSON());
        expect(presenter).toEqual(expectedPresenter);
      },
    );
  });

  it('should delete a todo', async () => {
    const entity = Todo.fake().aTodo().build();
    await repository.insert(entity);

    const response = await controller.remove(entity.id);

    expect(response).toBeUndefined();
    expect(repository.findById(entity.id)).rejects.toThrowError(
      new NotFoundError(`Entity Not Found using ID ${entity.id}`),
    );
  });

  it('should find a todo', async () => {
    const entity = Todo.fake().aTodo().build();
    await repository.insert(entity);

    const expectedPresenter = new TodoPresenter(entity.toJSON());
    const presenter = await controller.findOne(entity.id);

    expect(presenter).toStrictEqual(expectedPresenter);
    expect(presenter.id).toBe(entity.id);
    expect(presenter.title).toBe(expectedPresenter.title);
    expect(presenter.description).toBe(expectedPresenter.description);
    expect(presenter.priority).toBe(expectedPresenter.priority);
    expect(presenter.created_at).toStrictEqual(entity.created_at);
  });

  describe('search method', () => {
    describe('should return presenter with todo ordered by created_at when query is empty', () => {
      const { arrange, entitiesMap } =
        ListTodosFixture.arrangeIncrementedWithCreatedAt();
      const entities = Object.values(entitiesMap);

      test.each(arrange)(
        'with send data: $send_data',
        async ({ send_data, expected }) => {
          await repository.bulkInsert(entities);
          const presenter = await controller.search(send_data);
          expect(presenter).toEqual(
            new TodoCollectionPresenter(expected as any),
          );
        },
      );
    });

    describe('should return output using paginate, sort and filter', () => {
      const { arrange, entitiesMap } = ListTodosFixture.arrangeUnsorted();
      const items = Object.values(entitiesMap);

      test.each(arrange)(
        'with send data: $send_data',
        async ({ send_data, expected }) => {
          await repository.bulkInsert(items);
          const presenter = await controller.search(send_data);
          expect(presenter).toEqual(
            new TodoCollectionPresenter(expected as any),
          );
        },
      );
    });
  });
});
