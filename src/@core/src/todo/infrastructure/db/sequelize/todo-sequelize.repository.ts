/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Priority, Todo } from '../../../domain/entities/todo'
import { TodoRepository } from '#todo/domain/repository'
import { UniqueEntityId } from '#shared/domain/value-object/unique-entity-id.vo'
import { NotFoundError } from '#shared/domain/errors/not-found-error'
import { TodoModelMapper } from './todo.mapper'
import { TodoModel } from './todo.model'

import { Op } from 'sequelize'

export class TodoSequelizeRepository implements TodoRepository.Repository {
  sortableFields: string[] = ['title', 'created_at']

  constructor (private readonly todoModel: typeof TodoModel) {}

  async exists (name: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  async search (
    props: TodoRepository.SearchParams
  ): Promise<TodoRepository.SearchResult> {
    const offset = (props.page - 1) * props.per_page
    const limit = props.per_page

    const { rows: models, count } = await this.todoModel.findAndCountAll({
      ...(props.filter && {
        where: { title: { [Op.like]: `%${props.filter}%` } }
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? { order: [[props.sort, props.sort_dir as Priority]] }
        : { order: [['created_at', 'DESC']] }),
      offset,
      limit
    })

    return new TodoRepository.SearchResult({
      items: models.map((m) => TodoModelMapper.toEntity(m)),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
      filter: props.filter,
      sort: props.sort,
      sort_dir: props.sort_dir
    })
  }

  async insert (entity: Todo): Promise<void> {
    await this.todoModel.create(entity.toJSON())
  }

  async findById (id: string | UniqueEntityId): Promise<Todo> {
    const _id = `${id}`
    const model = await this._get(_id)
    return TodoModelMapper.toEntity(model)
  }

  async findAll (): Promise<Todo[]> {
    const models = await this.todoModel.findAll()
    return models.map((m) => TodoModelMapper.toEntity(m))
  }

  async update (entity: Todo): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async delete (id: string | UniqueEntityId): Promise<void> {
    throw new Error('Method not implemented.')
  }

  private async _get (id: string): Promise<TodoModel> {
    return await this.todoModel.findByPk(id, {
      rejectOnEmpty: new NotFoundError(`Entity not found using ID ${id}`)
    })
  }
}

export default TodoSequelizeRepository
