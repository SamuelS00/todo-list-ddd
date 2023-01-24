/* eslint-disable @typescript-eslint/no-namespace */
import { TodoRepository } from 'todo-list/todo/domain';
import {
  CreateTodoUseCase,
  DeleteTodoUseCase,
  GetTodoUseCase,
  ListTodosUseCase,
  UpdateTodoUseCase,
} from 'todo-list/todo/application';
import { TodoInMemoryRepository } from 'todo-list/todo/infrastructure';

export namespace TODO_PROVIDERS {
  export namespace REPOSITORIES {
    export const TODO_IN_MEMORY_REPOSITORY = {
      provide: 'TodoInMemoryRepository',
      useClass: TodoInMemoryRepository,
    };
  }

  export namespace USE_CASES {
    export const CREATE_TODO_USE_CASE = {
      provide: CreateTodoUseCase.UseCase,
      useFactory: (todoRepo: TodoRepository.Repository) => {
        return new CreateTodoUseCase.UseCase(todoRepo);
      },
      inject: [REPOSITORIES.TODO_IN_MEMORY_REPOSITORY.provide],
    };

    export const DELETE_TODO_USE_CASE = {
      provide: DeleteTodoUseCase.UseCase,
      useFactory: (todoRepo: TodoRepository.Repository) => {
        return new DeleteTodoUseCase.UseCase(todoRepo);
      },
      inject: [REPOSITORIES.TODO_IN_MEMORY_REPOSITORY.provide],
    };

    export const GET_TODO_USE_CASE = {
      provide: GetTodoUseCase.UseCase,
      useFactory: (todoRepo: TodoRepository.Repository) => {
        return new GetTodoUseCase.UseCase(todoRepo);
      },
      inject: [REPOSITORIES.TODO_IN_MEMORY_REPOSITORY.provide],
    };

    export const UPDATE_TODO_USE_CASE = {
      provide: UpdateTodoUseCase.UseCase,
      useFactory: (todoRepo: TodoRepository.Repository) => {
        return new UpdateTodoUseCase.UseCase(todoRepo);
      },
      inject: [REPOSITORIES.TODO_IN_MEMORY_REPOSITORY.provide],
    };

    export const LIST_TODO_USE_CASE = {
      provide: ListTodosUseCase.UseCase,
      useFactory: (todoRepo: TodoRepository.Repository) => {
        return new ListTodosUseCase.UseCase(todoRepo);
      },
      inject: [REPOSITORIES.TODO_IN_MEMORY_REPOSITORY.provide],
    };
  }
}