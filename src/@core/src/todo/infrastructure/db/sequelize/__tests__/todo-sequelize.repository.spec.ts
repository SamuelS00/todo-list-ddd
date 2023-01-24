/* eslint-disable @typescript-eslint/naming-convention */
import { NotFoundError } from '#shared/domain/errors/not-found-error'
import { Todo } from '#todo/domain/entities/todo'
import { TodoRepository } from '#todo/domain/repository/todo.repository'
import { setupSequelize } from '#shared/infrastructure/testing/helpers/db'
import { DataGenerator } from '#shared/infrastructure/testing/helpers/data-generator'
import { TodoSequelize } from '../todo-sequelize'
import { genPriorityOption } from '#shared/infrastructure/testing/helpers/generate-priority-option'

const { TodoSequelizeRepository, TodoModel, TodoModelMapper } = TodoSequelize

describe('TodoSequelizeRepository Unit Tests', () => {
  setupSequelize({ models: [TodoModel] })
  let repository = new TodoSequelizeRepository(TodoModel)

  beforeEach(async () => {
    repository = new TodoSequelizeRepository(TodoModel)
  })

  it('should insert a new entity', async () => {
    let entity = new Todo({ title: 'Supermarket', priority: 'low' })

    void repository.insert(entity)

    let model = await TodoModel.findByPk(entity.id)
    expect(model?.toJSON()).toStrictEqual(entity.toJSON())

    entity = new Todo({
      title: 'Gym',
      priority: 'low',
      description: 'new description',
      is_scratched: false,
      created_at: new Date()
    })

    void repository.insert(entity)

    model = await TodoModel.findByPk(entity.id)
    expect(model?.toJSON()).toStrictEqual(entity.toJSON())
  })

  it('should find an entity', async () => {
    const entity = new Todo({ title: 'Supermarket', priority: 'low' })

    void repository.insert(entity)

    const todo = await repository.findById(entity.id)
    expect(todo.toJSON()).toStrictEqual(entity.toJSON())
  })

  it('should throw an error when entity has not been found', async () => {
    await expect(repository.findById('fake id')).rejects.toThrow(
      new NotFoundError('Entity not found using ID fake id')
    )
    await expect(
      repository.findById('312cffad-1938-489e-a706-643dc9a3cfd3')
    ).rejects.toThrow(
      new NotFoundError(
        'Entity not found using ID 312cffad-1938-489e-a706-643dc9a3cfd3'
      )
    )
  })

  it('should find an entity by Id', async () => {
    const entity = new Todo({ title: 'Supermarket', priority: 'low' })
    await repository.insert(entity)

    let entityFound = await repository.findById(entity.id)
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON())

    entityFound = await repository.findById(entity.uniqueEntityId)
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON())
  })

  it('should return all todos', async () => {
    const entity = new Todo({
      title: 'supermarket',
      priority: 'low'
    })

    await repository.insert(entity)
    const entities = await repository.findAll()
    expect(entities).toHaveLength(1)
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]))
  })

  describe('search method tests', () => {
    it('should only apply paginate when other params are null', async () => {
      const createdAt = new Date()
      await TodoModel.factory()
        .count(16)
        .bulkCreate(() => ({
          id: DataGenerator.uuid(),
          title: 'Supermarket',
          priority: 'medium',
          description: 'Description not defined',
          is_scratched: false,
          created_at: createdAt
        }))
      const spyToEntity = jest.spyOn(TodoModelMapper, 'toEntity')

      const searchOutput = await repository.search(
        new TodoRepository.SearchParams()
      )
      expect(searchOutput).toBeInstanceOf(TodoRepository.SearchResult)
      expect(spyToEntity).toHaveBeenCalledTimes(15)
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null
      })
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Todo)
        expect(item.id).toBeDefined()
      })
      const items = searchOutput.items.map((item) => item.toJSON())
      expect(items).toMatchObject(
        new Array(15).fill({
          title: 'Supermarket',
          priority: 'medium',
          description: 'Description not defined',
          is_scratched: false,
          created_at: createdAt
        })
      )
    })

    it('should order by created_at DESC when search params are null', async () => {
      const createdAt = new Date()

      await TodoModel.factory()
        .count(16)
        .bulkCreate((index) => ({
          id: DataGenerator.uuid(),
          title: `Supermarket${index}`,
          priority: 'medium',
          description: 'Description not defined',
          is_scratched: false,
          created_at: new Date(createdAt.getTime() + 100 + index)
        }))

      const searchOutput = await repository.search(
        new TodoRepository.SearchParams()
      )

      const items = [...searchOutput.items].reverse()

      items.forEach((item, index) => {
        console.log(item.title, index, item.created_at)
        expect(`${item.title}${index + 1}`)
      })
    })

    it('should apply paginate and filter', async () => {
      const defaultProps = {
        priority: genPriorityOption(),
        description: 'Description not defined',
        is_scratched: true,
        created_at: new Date()
      }

      const todoProp = [
        { id: DataGenerator.uuid(), title: 'test', ...defaultProps },
        { id: DataGenerator.uuid(), title: 'a', ...defaultProps },
        { id: DataGenerator.uuid(), title: 'TEST', ...defaultProps },
        { id: DataGenerator.uuid(), title: 'TeSt', ...defaultProps }
      ]
      const todos = await TodoModel.bulkCreate(todoProp)

      let searchOutput = await repository.search(
        new TodoRepository.SearchParams({
          page: 1,
          per_page: 2,
          filter: 'TEST'
        })
      )
      expect(searchOutput.toJSON(true)).toMatchObject(
        new TodoRepository.SearchResult({
          items: [
            TodoModelMapper.toEntity(todos[0]),
            TodoModelMapper.toEntity(todos[2])
          ],
          total: 3,
          current_page: 1,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: 'TEST'
        }).toJSON(true)
      )

      searchOutput = await repository.search(
        new TodoRepository.SearchParams({
          page: 2,
          per_page: 2,
          filter: 'TEST'
        })
      )
      expect(searchOutput.toJSON(true)).toMatchObject(
        new TodoRepository.SearchResult({
          items: [TodoModelMapper.toEntity(todos[3])],
          total: 3,
          current_page: 2,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: 'TEST'
        }).toJSON(true)
      )
    })

    it('should apply paginate and sort', async () => {
      expect(repository.sortableFields).toStrictEqual(['title', 'created_at'])
      const defaultProps = {
        priority: genPriorityOption(),
        description: 'Description not defined',
        is_scratched: false,
        created_at: new Date()
      }

      const todosProp = [
        { id: DataGenerator.uuid(), title: 'baa', ...defaultProps },
        { id: DataGenerator.uuid(), title: 'aaa', ...defaultProps },
        { id: DataGenerator.uuid(), title: 'daa', ...defaultProps },
        { id: DataGenerator.uuid(), title: 'eaa', ...defaultProps },
        { id: DataGenerator.uuid(), title: 'caa', ...defaultProps }
      ]
      const todos = await TodoModel.bulkCreate(todosProp)

      const arrange = [
        {
          params: new TodoRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: 'title'
          }),
          result: new TodoRepository.SearchResult({
            items: [
              TodoModelMapper.toEntity(todos[1]),
              TodoModelMapper.toEntity(todos[0])
            ],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: 'title',
            sort_dir: 'asc',
            filter: null
          })
        },
        {
          params: new TodoRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: 'title'
          }),
          result: new TodoRepository.SearchResult({
            items: [
              TodoModelMapper.toEntity(todos[4]),
              TodoModelMapper.toEntity(todos[2])
            ],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: 'title',
            sort_dir: 'asc',
            filter: null
          })
        },
        {
          params: new TodoRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: 'title',
            sort_dir: 'desc'
          }),
          result: new TodoRepository.SearchResult({
            items: [
              TodoModelMapper.toEntity(todos[3]),
              TodoModelMapper.toEntity(todos[2])
            ],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: 'title',
            sort_dir: 'desc',
            filter: null
          })
        },
        {
          params: new TodoRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: 'title',
            sort_dir: 'desc'
          }),
          result: new TodoRepository.SearchResult({
            items: [
              TodoModelMapper.toEntity(todos[4]),
              TodoModelMapper.toEntity(todos[0])
            ],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: 'title',
            sort_dir: 'desc',
            filter: null
          })
        }
      ]

      for (const i of arrange) {
        const result = await repository.search(i.params)
        expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true))
      }
    })

    describe('should search using filter, sort and paginate', () => {
      const defaultProps = {
        priority: genPriorityOption(),
        description: 'Description not defined',
        is_scratched: false,
        created_at: new Date()
      }

      const todosProps = [
        { id: DataGenerator.uuid(), title: 'test', ...defaultProps },
        { id: DataGenerator.uuid(), title: 'aaa', ...defaultProps },
        { id: DataGenerator.uuid(), title: 'TEST', ...defaultProps },
        { id: DataGenerator.uuid(), title: 'eee', ...defaultProps },
        { id: DataGenerator.uuid(), title: 'TeSt', ...defaultProps }
      ]

      const arrange = [
        {
          search_params: new TodoRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: 'title',
            filter: 'TEST'
          }),
          search_result: new TodoRepository.SearchResult({
            items: [
              TodoModelMapper.toEntity(new TodoModel(todosProps[2])),
              TodoModelMapper.toEntity(new TodoModel(todosProps[4]))
            ],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: 'title',
            sort_dir: 'asc',
            filter: 'TEST'
          })
        },
        {
          search_params: new TodoRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: 'title',
            filter: 'TEST'
          }),
          search_result: new TodoRepository.SearchResult({
            items: [TodoModelMapper.toEntity(new TodoModel(todosProps[0]))],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: 'title',
            sort_dir: 'asc',
            filter: 'TEST'
          })
        }
      ]

      beforeEach(async () => {
        await TodoModel.bulkCreate(todosProps)
      })

      test.each(arrange)(
        'when value is $search_params',
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params)
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true))
        }
      )
    })
  })
})
