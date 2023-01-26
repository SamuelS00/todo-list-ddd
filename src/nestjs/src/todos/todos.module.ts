import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { TODO_PROVIDERS } from './providers/todo.providers';
import { SequelizeModule } from '@nestjs/sequelize';
import { TodoSequelize } from 'todo-list/todo/infrastructure';

@Module({
  imports: [SequelizeModule.forFeature([TodoSequelize.TodoModel])],
  controllers: [TodosController],
  providers: [
    TodosService,
    ...Object.values(TODO_PROVIDERS.REPOSITORIES),
    ...Object.values(TODO_PROVIDERS.USE_CASES),
  ],
})
export class TodosModule {}
