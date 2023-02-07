import { TodoRepository } from 'todo-list/todo/domain';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { startApp } from '../../src/@shared/testing/helpers';
import { TodosController } from '../../src/todos/todos.controller';
import { TODO_PROVIDERS } from '../../src/todos/providers/todo.provider';
import { ListTodosFixture } from '../../src/todos/fixures/fixures';
import { TodoCollectionPresenter } from '../../src/todos/presenter/todo.presenter';


describe('TodosController (e2e)', () => {
  describe('/todos (GET)', () => {
    describe('should return todos ordered by created_at when query is empty', () => {
      let todoRepo: TodoRepository.Repository;

      const nestApp = startApp();
      const { arrange, entitiesMap } =
        ListTodosFixture.arrangeIncrementedWithCreatedAt();

      const entities = Object.values(entitiesMap);

      beforeEach(async () => {
        todoRepo = nestApp.app.get<TodoRepository.Repository>(
          TODO_PROVIDERS.REPOSITORIES.TODO_REPOSITORY.provide,
        );
        await todoRepo.bulkInsert(entities);
      });

      test.each(arrange)(
        'with send data: $send_data',
        async ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(send_data as any).toString();

          const res = await request(nestApp.app.getHttpServer())
            .get(`/todos?${queryParams}`)
            .expect(200);

          expect(Object.keys(res.body)).toStrictEqual(['data', 'meta']);
          const presenter = new TodoCollectionPresenter(expected);
          const serialized = instanceToPlain(presenter);
          expect(res.body).toEqual(serialized);
        },
      );
    });

    describe('should return todos using paginate, sort and filter', () => {
      let todoRepo: TodoRepository.Repository;
      const nestApp = startApp();
      const { arrange, entitiesMap } = ListTodosFixture.arrangeUnsorted();
      const entities = Object.values(entitiesMap);

      beforeEach(async () => {
        todoRepo = nestApp.app.get<TodoRepository.Repository>(
          TODO_PROVIDERS.REPOSITORIES.TODO_REPOSITORY.provide,
        );
        await todoRepo.bulkInsert(entities);
      });

      test.each(arrange)(
        'with send data: $send_data',
        async ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(send_data as any).toString();

          const res = await request(nestApp.app.getHttpServer())
            .get(`/todos?${queryParams}`)
            .expect(200);
  
          expect(Object.keys(res.body)).toStrictEqual(['data', 'meta']);
          const presenter = new TodoCollectionPresenter(expected);
          const serialized = instanceToPlain(presenter);

          expect(res.body).toEqual(serialized);
        },
      );
    });
  });
});