import { PaginationOutputDto } from '../dtos/pagination-output.dto'
import { SearchResult } from '../../domain/repository/repository-contracts'

export const PaginationOutputMapper = {
  toOutput: (result: SearchResult): Omit<PaginationOutputDto, 'items'> => {
    return {
      total: result.total,
      current_page: result.current_page,
      last_page: result.last_page,
      per_page: result.per_page
    }
  }
}
