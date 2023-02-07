import { NotFoundError } from 'todo-list/@shared/domain';
import { Todo, TodoRepository } from 'todo-list/todo/domain';
import request from 'supertest';
import { startApp } from '../../src/@shared/testing/helpers';
import { TODO_PROVIDERS } from '../../src/todos/providers/todo.provider';

describe('TodosController (e2e)', () => {
  describe('/todos/:id (DELETE)', () => {
    const nestApp = startApp();
    describe('should return a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '51683e7d-0842-4913-a768-f7bb0be5bfcc',
          expected: {
            message:
              'Entity Not Found using ID 51683e7d-0842-4913-a768-f7bb0be5bfcc',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          expected: {
            message: 'Validation failed (uuid v4 is expected)',
            statusCode: 422,
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('with id is $id', ({ id, expected }) => {
        return request(nestApp.app.getHttpServer())
          .delete(`/todos/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should delete a todo with response status 204 ', async () => {
      const todoRepo = nestApp.app.get<TodoRepository.Repository>(
        TODO_PROVIDERS.REPOSITORIES.TODO_REPOSITORY.provide,
      );
      const todo = Todo.fake().aTodo().build();
      todoRepo.insert(todo);

      await request(nestApp.app.getHttpServer())
        .delete(`/todos/${todo.id}`)
        .expect(204);

      await expect(todoRepo.findById(todo.id)).rejects.toThrowError(
        new NotFoundError(`Entity Not Found using ID ${todo.id}`),
      );
    });
  });
});