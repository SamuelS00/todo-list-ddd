/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-var-requires */
import { UniqueEntityId } from '#shared/domain/value-object/unique-entity-id.vo'
import { EntityValidationError, LoadEntityError, NotFoundError } from '#shared/domain/errors'
import { Todo, Priority } from '#todo/domain/entities/todo'
import { TodoRepository } from '#todo/domain/repository'
import { Model, Column, DataType, PrimaryKey, Table } from 'sequelize-typescript'
import { Op } from 'sequelize'
import { SequelizeModelFactory } from '#shared/infrastructure/sequelize/sequelize-model.factory'
import { genPriorityOption } from '#shared/infrastructure/testing/helpers/generate-priority-option'

export namespace TodoSequelize {
  interface TodosModelProperties {
    id: string
    title: string
    priority: Priority
    description: string
    is_scratched: boolean
    created_at: Date
  }

  @Table({ tableName: 'todos', timestamps: false })
  export class TodoModel extends Model<TodosModelProperties> {
    @PrimaryKey
    @Column({ type: DataType.UUID })
    declare id: string

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare title: string

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare priority: string

    @Column({ allowNull: false, type: DataType.TEXT })
    declare description: string

    @Column({ allowNull: false, type: DataType.BOOLEAN })
    declare is_scratched: boolean

    @Column({ allowNull: false, type: DataType.DATE })
    declare created_at: Date

    static factory (): SequelizeModelFactory<TodoModel, TodosModelProperties> {
      const chance: Chance.Chance = require('chance')
      return new SequelizeModelFactory<TodoModel, TodosModelProperties>(
        TodoModel, () => ({
          id: chance.guid({ version: 4 }),
          title: chance.word(),
          priority: genPriorityOption(),
          description: chance.sentence({ words: 5 }),
          is_scratched: false,
          created_at: chance.date()
        }))
    }
  }

  export const TodoModelMapper = {
    toEntity (model: TodoModel): Todo {
      const { id, ...otherData } = model.toJSON()

      try {
        return new Todo(otherData, new UniqueEntityId(id))
      } catch (err) {
        if (err instanceof EntityValidationError) {
          throw new LoadEntityError(err.error)
        }

        throw err
      }
    }
  }

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
        ...((props.filter != null) && {
          where: { title: { [Op.like]: `%${props.filter}%` } }
        }),
        ...((props.sort != null) && this.sortableFields.includes(props.sort)
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
}
