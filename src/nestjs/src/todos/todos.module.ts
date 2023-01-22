import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';

import { TodoInMemoryRepository } from 'todo-list/todo/infrastructure';
import { TodoRepository } from 'todo-list/todo/domain';
import {
  CreateTodoUseCase,
  DeleteTodoUseCase,
  GetTodoUseCase,
  ListTodosUseCase,
  UpdateTodoUseCase,
} from 'todo-list/todo/application';

@Module({
  controllers: [TodosController],
  providers: [
    TodosService,
    {
      provide: 'TodoInMemoryRepository',
      useClass: TodoInMemoryRepository,
    },
    {
      provide: CreateTodoUseCase.UseCase,
      useFactory: (todoRepo: TodoRepository.Repository) => {
        return new CreateTodoUseCase.UseCase(todoRepo);
      },
      inject: ['TodoInMemoryRepository'],
    },
    {
      provide: DeleteTodoUseCase.UseCase,
      useFactory: (todoRepo: TodoRepository.Repository) => {
        return new DeleteTodoUseCase.UseCase(todoRepo);
      },
      inject: ['TodoInMemoryRepository'],
    },
    {
      provide: GetTodoUseCase.UseCase,
      useFactory: (todoRepo: TodoRepository.Repository) => {
        return new GetTodoUseCase.UseCase(todoRepo);
      },
      inject: ['TodoInMemoryRepository'],
    },
    {
      provide: ListTodosUseCase.UseCase,
      useFactory: (todoRepo: TodoRepository.Repository) => {
        return new ListTodosUseCase.UseCase(todoRepo);
      },
      inject: ['TodoInMemoryRepository'],
    },
    {
      provide: UpdateTodoUseCase.UseCase,
      useFactory: (todoRepo: TodoRepository.Repository) => {
        return new UpdateTodoUseCase.UseCase(todoRepo);
      },
      inject: ['TodoInMemoryRepository'],
    },
  ],
})
export class TodosModule {}
