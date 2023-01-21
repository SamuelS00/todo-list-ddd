/* eslint-disable @typescript-eslint/no-namespace */

import { SearchInputDto } from '../../../@shared/application/dtos/search-input.dto'
import { UseCase as DefaultUseCase } from '../../../@shared/application/use-cases/use-case'
import { PaginationOutputDto } from '../../../@shared/application/dtos/pagination-output.dto'
import { PaginationOutputMapper } from '../../../@shared/application/mappers/pagination-output.mapper'
import { TodoOutput } from '../dtos/todo-output.dto'
import { TodoOutputMapper } from '../mappers/todo-output.mapper'
import { TodoRepository } from '../../domain/repository/todo.repository'

export namespace ListTodosUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor (private readonly todoRepo: TodoRepository.Repository) { }

    async execute (input: Input): Promise<Output> {
      const params = new TodoRepository.SearchParams(input)
      const searchResult = await this.todoRepo.search(params)

      return this.toOutput(searchResult)
    }

    private toOutput (searchResult: TodoRepository.SearchResult): Output {
      return {
        items: searchResult.items.map((i) => TodoOutputMapper.toOutput(i)),
        ...PaginationOutputMapper.toOutput(searchResult)
      }
    }
  }

  export type Input = SearchInputDto

  export type Output = PaginationOutputDto<TodoOutput>
}

export default ListTodosUseCase
