/* eslint-disable @typescript-eslint/no-extraneous-class */

import { SearchResult } from '../../../@shared/domain/repository/repository-contracts'
import { PaginationOutputDto } from '../dtos/pagination-output.dto'

export class PaginationOutputMapper {
  static toPaginationOutput (
    result: SearchResult
  ): Omit<PaginationOutputDto, 'items'> {
    return {
      total: result.total,
      current_page: result.current_page,
      last_page: result.last_page,
      per_page: result.per_page
    }
  }
}
