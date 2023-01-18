import { SortDirection } from '../../../@shared/domain/repository/repository-contracts'

export default interface SearchInputDto<Filter = string> {
  page?: number
  per_page?: number
  sort?: string | null
  sort_dir?: SortDirection | null
  filter?: Filter | null
}
