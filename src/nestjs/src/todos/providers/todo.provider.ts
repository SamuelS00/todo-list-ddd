/* eslint-disable @typescript-eslint/no-namespace */
import { TodoRepository } from 'todo-list/todo/domain';
import {
  CreateTodoUseCase,
  DeleteTodoUseCase,
  GetTodoUseCase,
  ListTodosUseCase,
  UpdateTodoUseCase,
} from 'todo-list/todo/application';
import {
  TodoInMemoryRepository,
  TodoSequelize,
} from 'todo-list/todo/infrastructure';
import { getModelToken } from '@nestjs/sequelize';

export namespace TODO_PROVIDERS {
  export namespace REPOSITORIES {
    export const TODO_IN_MEMORY_REPOSITORY = {
      provide: 'TodoInMemoryRepository',
      useClass: TodoInMemoryRepository,
    };
    export const TODO_SEQUELIZE_REPOSITORY = {
      provide: 'TodoSequelizeRepository',
      useFactory: (todoModel: typeof TodoSequelize.TodoModel) => {
        return new TodoSequelize.TodoSequelizeRepository(todoModel);
      },
      inject: [getModelToken(TodoSequelize.TodoModel)],
    };
    export const TODO_REPOSITORY = {
      provide: 'TodoRepository',
      useExisting: 'TodoSequelizeRepository',
    };
  }

  export namespace USE_CASES {
    export const CREATE_TODO_USE_CASE = {
      provide: CreateTodoUseCase.UseCase,
      useFactory: (todoRepo: TodoRepository.Repository) => {
        return new CreateTodoUseCase.UseCase(todoRepo);
      },
      inject: [REPOSITORIES.TODO_REPOSITORY.provide],
    };

    export const DELETE_TODO_USE_CASE = {
      provide: DeleteTodoUseCase.UseCase,
      useFactory: (todoRepo: TodoRepository.Repository) => {
        return new DeleteTodoUseCase.UseCase(todoRepo);
      },
      inject: [REPOSITORIES.TODO_REPOSITORY.provide],
    };

    export const GET_TODO_USE_CASE = {
      provide: GetTodoUseCase.UseCase,
      useFactory: (todoRepo: TodoRepository.Repository) => {
        return new GetTodoUseCase.UseCase(todoRepo);
      },
      inject: [REPOSITORIES.TODO_REPOSITORY.provide],
    };

    export const UPDATE_TODO_USE_CASE = {
      provide: UpdateTodoUseCase.UseCase,
      useFactory: (todoRepo: TodoRepository.Repository) => {
        return new UpdateTodoUseCase.UseCase(todoRepo);
      },
      inject: [REPOSITORIES.TODO_REPOSITORY.provide],
    };

    export const LIST_TODO_USE_CASE = {
      provide: ListTodosUseCase.UseCase,
      useFactory: (todoRepo: TodoRepository.Repository) => {
        return new ListTodosUseCase.UseCase(todoRepo);
      },
      inject: [REPOSITORIES.TODO_REPOSITORY.provide],
    };
  }
}
