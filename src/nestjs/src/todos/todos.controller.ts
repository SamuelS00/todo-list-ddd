import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Inject,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import {
  CreateTodoUseCase,
  DeleteTodoUseCase,
  GetTodoUseCase,
  ListTodosUseCase,
  UpdateTodoUseCase,
} from 'todo-list/todo/application';
import { SearchTodoDto } from './dto/search-todo.dto';

@Controller('todos')
export class TodosController {
  @Inject(CreateTodoUseCase.UseCase)
  private createUseCase: CreateTodoUseCase.UseCase;

  @Inject(GetTodoUseCase.UseCase)
  private getUseCase: GetTodoUseCase.UseCase;

  @Inject(ListTodosUseCase.UseCase)
  private listUseCase: ListTodosUseCase.UseCase;

  @Inject(UpdateTodoUseCase.UseCase)
  private updateUseCase: UpdateTodoUseCase.UseCase;

  @Inject(DeleteTodoUseCase.UseCase)
  private deleteUseCase: DeleteTodoUseCase.UseCase;

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.createUseCase.execute(createTodoDto);
  }

  @Get()
  search(@Query() searchParams: SearchTodoDto) {
    return this.listUseCase.execute(searchParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getUseCase.execute({ id });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.updateUseCase.execute({ ...updateTodoDto, id });
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteUseCase.execute({ id });
  }
}
