import { TodoRepository } from 'todo-list/todo/domain';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { startApp } from '../../src/@shared/testing/helpers';
import { TodosController } from '../../src/todos/todos.controller';
import { TODO_PROVIDERS } from '../../src/todos/providers/todo.provider';
import { CreateTodoFixture } from '../../src/todos/fixures/fixures';

describe('TodosController (e2e)', () => {
  describe('/todos (POST)', () => {
    describe('should give a response error with 422 when request body is invalid', () => {
      const nestApp = startApp();
      const arrange = CreateTodoFixture.arrangeInvalidRequest();

      test.each(arrange)('body contents: $label', ({ send_data, expected }) => {
        return request(nestApp.app.getHttpServer())
          .post('/todos')
          .send(send_data)
          .expect(422)
          .expect(expected);
      });
    });

    describe('should give a response error with 422 when throw EntityValidationError', () => {
      const app = startApp({
        beforeInit: (app) => {
          app['config'].globalPipes = [];
        },
      });

      const arrange = CreateTodoFixture.arrangeForEntityValidationError();
      test.each(arrange)(
        'body contents: $label',
        ({ send_data, expected }) => {
        return request(app.app.getHttpServer())
          .post('/todos')
          .send(send_data)
          .expect(422)
          .expect(expected);
      });
    });

    describe('should create a todo', () => {
      const nestApp = startApp();
      const arrange = CreateTodoFixture.arrangeForSave();
      let todoRepo: TodoRepository.Repository;

      beforeEach(async () => {
        todoRepo = nestApp.app.get<TodoRepository.Repository>(
          TODO_PROVIDERS.REPOSITORIES.TODO_REPOSITORY.provide,
        );
      });

      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const res = await request(nestApp.app.getHttpServer())
            .post('/todos')
            .send(send_data)
            .expect(201);
  
          const keysInResponse = CreateTodoFixture.keysInResponse();
          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);
          const id = res.body.data.id;
          const todo = await todoRepo.findById(id);

          const presenter = TodosController.todoToResponse(
            todo.toJSON(),
          );

          const serialized = instanceToPlain(presenter);

          expect(res.body.data).toStrictEqual(serialized);
          expect(res.body.data).toStrictEqual({
            id: serialized.id,
            created_at: serialized.created_at,
            ...send_data,
            ...expected,
          });
        },
      );
    });
  });
});