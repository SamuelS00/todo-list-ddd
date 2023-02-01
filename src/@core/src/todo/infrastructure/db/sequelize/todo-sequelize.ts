/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-var-requires */
import { UniqueEntityId } from '../../../../@shared/domain/value-object/unique-entity-id.vo'
import { EntityValidationError } from '../../../../@shared/domain/errors/invalid-validation-error'
import { LoadEntityError } from '../../../../@shared/domain/errors/load-entity.error'
import { NotFoundError } from '../../../../@shared/domain/errors/not-found-error'
import { Todo } from '../../../../todo/domain/entities/todo'
import { TodoRepository } from '../../../../todo/domain/repository'
import { Model, Column, DataType, PrimaryKey, Table } from 'sequelize-typescript'
import { Op } from 'sequelize'
import { SequelizeModelFactory } from '../../../../@shared/infrastructure/sequelize/sequelize-model.factory'
import { DataGenerator } from '../../../../@shared/infrastructure/testing/helpers/data-generator'
import { PriorityType } from '#todo/domain/entities/priority-type.vo'
import { PriorityError } from '#todo/domain/errors/priority-type.error'

export namespace TodoSequelize {
  interface TodosModelProperties {
    id: string
    title: string
    priority: number
    description: string | null
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

    @Column({ allowNull: false, type: DataType.INTEGER() })
    declare priority: number

    @Column({ allowNull: true, type: DataType.TEXT })
    declare description: string

    @Column({ allowNull: false, type: DataType.BOOLEAN })
    declare is_scratched: boolean

    @Column({ allowNull: false, type: DataType.DATE })
    declare created_at: Date

    static factory (): SequelizeModelFactory<TodoModel, TodosModelProperties> {
      return new SequelizeModelFactory<TodoModel, TodosModelProperties>(
        TodoModel, () => ({
          id: DataGenerator.uuid(),
          title: DataGenerator.word({ length: 6 }),
          priority: DataGenerator.integer(1, 3),
          description: DataGenerator.sentence(),
          is_scratched: false,
          created_at: DataGenerator.date()
        }))
    }
  }

  export const TodoModelMapper = {
    toEntity (model: TodoModel): Todo {
      const {
        id,
        priority: code,
        ...otherData
      } = model.toJSON()

      try {
        return new Todo(
          { ...otherData, priority: PriorityType.createByCode(code) },
          new UniqueEntityId(id)
        )
      } catch (err) {
        if (err instanceof EntityValidationError) {
          throw new LoadEntityError(err.error)
        }

        if (err instanceof PriorityError) {
          throw new PriorityError(err.message)
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
          ? { order: [[props.sort, props.sort_dir as string]] }
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

    async bulkInsert (entities: Todo[]): Promise<void> {
      await this.todoModel.bulkCreate(entities.map(e => e.toJSON()))
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
      await this._get(entity.id)
      await this.todoModel.update(entity.toJSON(), {
        where: { id: entity.id }
      })
    }

    async delete (id: string | UniqueEntityId): Promise<void> {
      const _id = `${id}`
      await this._get(_id)
      void this.todoModel.destroy({
        where: { id: _id }
      })
    }

    private async _get (id: string): Promise<TodoModel> {
      return await this.todoModel.findByPk(id, {
        rejectOnEmpty: new NotFoundError(`Entity Not Found using ID ${id}`)
      })
    }
  }
}
