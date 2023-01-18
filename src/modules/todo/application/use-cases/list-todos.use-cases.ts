import { TodoRepository } from '../../../../modules/todo/domain/repository/todo.repository'
import { TodoOutput } from '../dtos/todo-output.dto'
import UseCase from '../../../../@shared/application/use-cases/use-case'
import SearchInputDto from '../../../../@shared/application/dtos/search-input.dto'
import { PaginationOutputDto } from '../../../../@shared/application/dtos/pagination-output.dto'
import { PaginationOutputMapper } from '@shared/application/mappers/pagination-output.mapper'
import { TodoOutputMapper } from '../mappers/todo-output.mapper'

export default class ListTodosUseCase implements UseCase<Input, Output> {
  constructor (private readonly todoRepo: TodoRepository.Repository) { }

  async execute (input: Input): Promise<Output> {
    const params = new TodoRepository.SearchParams(input)
    const searchResult = await this.todoRepo.search(params)

    return this.toOutput(searchResult)
  }

  private toOutput (searchResult: TodoRepository.SearchResult): Output {
    return {
      items: searchResult.items.map((i) => TodoOutputMapper.toOutput(i)),
      ...PaginationOutputMapper.toPaginationOutput(searchResult)
    }
  }
}

export type Input = SearchInputDto

export type Output = PaginationOutputDto<TodoOutput>
