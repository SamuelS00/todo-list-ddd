import { Todo, TodoRepository } from 'todo-list/todo/domain';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { startApp } from '../../src/@shared/testing/helpers';
import { TodosController } from '../../src/todos/todos.controller';
import { TODO_PROVIDERS } from '../../src/todos/providers/todo.provider';
import { CreateTodoFixture } from '../../src/todos/fixures/fixures';

describe('TodosController (e2e)', () => {
  describe('/todos/:id (GET)', () => {
    const nestApp = startApp();
    describe('should give a response error with 422/404 when id is invalid or not found', () => {
      const arrange = [
        {
          label: 'INVALID',
          id: 'fake id',
          expected: {
            statusCode: 422,
            error: 'Unprocessable Entity',
            message: 'Validation failed (uuid v4 is expected)',
          },
        },
        {
          label: 'NOT FOUND',
          id: 'd0ba5077-fb6d-406f-bd05-8c521ba9425a',
          expected: {
            statusCode: 404,
            error: 'Not Found',
            message:
              'Entity Not Found using ID d0ba5077-fb6d-406f-bd05-8c521ba9425a',
          },
        },
      ];
      test.each(arrange)('id contents: $label', ({ id, expected }) => {
        return request(nestApp.app.getHttpServer())
          .get(`/todos/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should get a todo', async () => {
      const todoRepo = nestApp.app.get<TodoRepository.Repository>(
        TODO_PROVIDERS.REPOSITORIES.TODO_REPOSITORY.provide,
      );

      const createdTodo = Todo.fake().aTodo().build();
      todoRepo.insert(createdTodo);

      const res = await request(nestApp.app.getHttpServer())
        .get(`/todos/${createdTodo.id}`)
        .expect(200);

      const keysInResponse = CreateTodoFixture.keysInResponse();

      expect(Object.keys(res.body)).toStrictEqual(['data']);
      expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);

      const presenter = TodosController.todoToResponse(
        createdTodo.toJSON(),
      );

      const serialized = instanceToPlain(presenter);
      expect(res.body.data).toStrictEqual(serialized);
    });
  });
});