import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Entity } from 'todo-list/@shared/domain';
import { Todo } from 'todo-list/todo/domain';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    console.log(Todo);
    console.log(Entity);
    return this.appService.getHello();
  }
}
