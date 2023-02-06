import { Todo, TodoRepository } from 'todo-list/todo/domain';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { startApp } from '../../src/@shared/testing/helpers';
import { TodosController } from '../../src/todos/todos.controller';
import { TODO_PROVIDERS } from '../../src/todos/providers/todo.provider';
import { UpdateTodoFixture } from '../../src/todos/fixures/fixures';

describe('TodosController (e2e)', () => {
  const uuid = '4b1f1c5e-67d8-4142-a286-fae0b1d6032a';

  describe('/todos/:id (PUT)', () => {
    describe('should give a response error with 422 when request body is invalid', () => {
      const nestApp = startApp();
      const arrange = UpdateTodoFixture.arrangeInvalidRequest();
      test.each(arrange)('body contents: $label', ({ send_data, expected }) => {
        return request(nestApp.app.getHttpServer())
          .put(`/todos/${uuid}`)
          .send(send_data)
          .expect(422)
          .expect(expected);
      });
    });

    describe('should give a response error with 422 when throw EntityValidationError', () => {
      const nestApp = startApp({
        beforeInit: (app) => {
          app['config'].globalPipes = [];
        },
      });
      const arrange = UpdateTodoFixture.arrangeForEntityValidationError();
      let todoRepo: TodoRepository.Repository;

      beforeEach(async () => {
        todoRepo = nestApp.app.get<TodoRepository.Repository>(
          TODO_PROVIDERS.REPOSITORIES.TODO_REPOSITORY.provide,
        );
      });

      test.each(arrange)('body contents: $label', ({ send_data, expected }) => {
        const todo = Todo.fake().aTodo().build();
        todoRepo.insert(todo);
        return request(nestApp.app.getHttpServer())
          .put(`/todos/${todo.id}`)
          .send(send_data)
          .expect(422)
          .expect(expected);
      });
    });

    describe('should give a response error with 422/404 when id is invalid or not found', () => {
      const nestApp = startApp();
      const faker = Todo.fake().aTodo();
      const arrange = [
        {
          label: 'INVALID',
          id: 'fake id',
          send_data: { title: faker.title },
          expected: {
            statusCode: 422,
            error: 'Unprocessable Entity',
            message: 'Validation failed (uuid v4 is expected)',
          },
        },
        {
          label: 'NOT FOUND',
          id: 'd0ba5077-fb6d-406f-bd05-8c521ba9425a',
          send_data: { title: faker.title },
          expected: {
            statusCode: 404,
            error: 'Not Found',
            message:
              'Entity Not Found using ID d0ba5077-fb6d-406f-bd05-8c521ba9425a',
          },
        },
      ];

      test.each(arrange)(
        'id contents: $label',
        ({ id, send_data, expected }) => {
          return request(nestApp.app.getHttpServer())
            .put(`/todos/${id}`)
            .send(send_data)
            .expect(expected.statusCode)
            .expect(expected);
        },
      );
    });

    describe('should update a todo', () => {
      const nestApp = startApp();
      const arrange = UpdateTodoFixture.arrangeForSave();
      let todoRepo: TodoRepository.Repository;

      beforeEach(async () => {
        todoRepo = nestApp.app.get<TodoRepository.Repository>(
          TODO_PROVIDERS.REPOSITORIES.TODO_REPOSITORY.provide,
        );
      });

      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const createdTodo = Todo.fake().aTodo().build();

          todoRepo.insert(createdTodo);

          const res = await request(nestApp.app.getHttpServer())
            .put(`/todos/${createdTodo.id}`)
            .send(send_data)
            .expect(200);

          const keysInResponse = UpdateTodoFixture.keysInResponse();

          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);

          const id = res.body.data.id;
          const updatedTodo = await todoRepo.findById(id);

          const presenter = TodosController.todoToResponse(
            updatedTodo.toJSON(),
          );
          const serialized = instanceToPlain(presenter);

          expect(res.body.data).toStrictEqual(serialized);
          expect(res.body.data).toMatchObject({
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