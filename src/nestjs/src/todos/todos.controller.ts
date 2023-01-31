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
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import {
  CreateTodoUseCase,
  DeleteTodoUseCase,
  GetTodoUseCase,
  ListTodosUseCase,
  TodoOutput,
  UpdateTodoUseCase,
} from 'todo-list/todo/application';
import { SearchTodoDto } from './dto/search-todo.dto';
import {
  TodoCollectionPresenter,
  TodoPresenter,
} from './presenter/todo.presenter';

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
  async create(@Body() createTodoDto: CreateTodoDto) {
    const output = await this.createUseCase.execute(createTodoDto);
    return new TodoPresenter(output);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422, version: '4' }))
    id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    const output = await this.updateUseCase.execute({
      id,
      ...updateTodoDto,
    });

    return TodosController.todoToResponse(output);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422, version: '4' }))
    id: string,
  ) {
    return this.deleteUseCase.execute({ id });
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422, version: '4' }))
    id: string,
  ) {
    const output = await this.getUseCase.execute({ id });
    return TodosController.todoToResponse(output);
  }

  @Get()
  async search(@Query() searchParams: SearchTodoDto) {
    const output = await this.listUseCase.execute(searchParams);
    return new TodoCollectionPresenter(output);
  }

  static todoToResponse(output: TodoOutput) {
    return new TodoPresenter(output);
  }
}
