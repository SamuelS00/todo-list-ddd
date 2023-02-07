/* eslint-disable @typescript-eslint/dot-notation */

import { TodoFakeBuilder } from './todo-fake-builder'
import { DataGenerator } from '../../../@shared/infrastructure/testing/helpers/data-generator'
import { UniqueEntityId } from '../../../@shared/domain'
import { PriorityType } from '../entities/priority-type.vo'

describe('TodoFakeBuilder Unit Tests', () => {
  describe('unique_entity_id prop', () => {
    const faker = TodoFakeBuilder.aTodo()

    it('should throw an error when unique_entity_id has not been set', () => {
      expect(() => faker['getValue']('unique_entity_id')).toThrow(
        new Error(
          'Property unique_entity_id does not have a factory, use \'with\' method instead'
        )
      )
      expect(() => faker.unique_entity_id).toThrow(
        new Error(
          'Property unique_entity_id does not have a factory, use \'with\' method instead'
        )
      )
    })

    it('should be undefined', () => {
      expect(faker['_unique_entity_id']).toBeUndefined()
    })

    test('withUniqueEntityId', () => {
      const uniqueEntityId = new UniqueEntityId()
      const $this = faker.withUniqueEntityId(uniqueEntityId)
      expect($this).toBeInstanceOf(TodoFakeBuilder)
      expect(faker['_unique_entity_id']).toBe(uniqueEntityId)

      faker.withUniqueEntityId(() => uniqueEntityId)
      // expect(faker['_unique_entity_id']()).toBe(uniqueEntityId)

      expect(faker.unique_entity_id).toBe(uniqueEntityId)

      const todo = faker.build()
      expect(todo.uniqueEntityId).toStrictEqual(uniqueEntityId)
    })

    it('should pass index to unique_entity_id factory', () => {
      const mockFactory = jest.fn().mockReturnValue(new UniqueEntityId())
      faker.withUniqueEntityId(mockFactory)
      faker.build()
      expect(mockFactory).toHaveBeenCalledWith(0)
    })
  })

  describe('title prop', () => {
    const faker = TodoFakeBuilder.aTodo()

    it('should be a function', () => {
      expect(typeof faker['_title'] === 'function').toBeTruthy()
    })

    it('should call the word method', () => {
      const spyWordMethod = jest.spyOn(DataGenerator, 'word')
      faker['lib'] = DataGenerator
      faker.build()

      expect(spyWordMethod).toHaveBeenCalled()
    })

    test('withTitle', () => {
      const $this = faker.withTitle('test title')
      expect($this).toBeInstanceOf(TodoFakeBuilder)
      expect(faker['_title']).toBe('test title')
      faker.withTitle(() => 'test title')
      // @ts-expect-error This expression is not callable
      expect(faker['_title']()).toBe('test title')

      expect(faker.title).toBe('test title')
    })

    it('should pass an index to title factory', () => {
      faker.withTitle((index) => `test title ${index}`)
      const todo = faker.build()
      expect(todo.title).toBe('test title 0')

      const fakerMany = TodoFakeBuilder.theTodos(2)
      fakerMany.withTitle((index) => `test title ${index}`)
      const todos = fakerMany.build()

      expect(todos[0].title).toBe('test title 0')
      expect(todos[1].title).toBe('test title 1')
    })

    test('invalid empty case', () => {
      const $this = faker.withInvalidTitleEmpty(undefined)
      expect($this).toBeInstanceOf(TodoFakeBuilder)

      expect(faker['_title']).toBeUndefined()

      faker.withInvalidTitleEmpty(null)
      expect(faker['_title']).toBeNull()

      faker.withInvalidTitleEmpty('')
      expect(faker['_title']).toBe('')
    })

    test('invalid not a string case', () => {
      const $this = faker.withInvalidTitleNotAString()
      expect($this).toBeInstanceOf(TodoFakeBuilder)

      expect(faker['_title']).toBe(5)

      faker.withInvalidTitleNotAString(55)
      expect(faker['_title']).toBe(55)

      faker.withInvalidTitleNotAString(true)
      expect(faker['_title']).toBeTruthy()
    })

    test('invalid too long case', () => {
      const tooLong = 't'.repeat(41)

      const $this = faker.withInvalidTitleTooLong()
      expect($this).toBeInstanceOf(TodoFakeBuilder)
      expect(faker['_title'].length).toBe(41)

      faker.withInvalidTitleTooLong(tooLong)
      expect(faker['_title'].length).toBe(41)
      expect(faker['_title']).toBe(tooLong)
    })
  })

  describe('priority prop', () => {
    const faker = TodoFakeBuilder.aTodo()
    it('should be a function', () => {
      expect(typeof faker['_priority'] === 'function').toBeTruthy()
    })

    it('should call the integer method', () => {
      const spyIntegerMethod = jest.spyOn(DataGenerator, 'integer')
      faker['lib'] = DataGenerator
      faker.build()

      expect(spyIntegerMethod).toHaveBeenCalled()
    })

    test('withPriority', () => {
      const $this = faker.withPriority(null as any)
      expect($this).toBeInstanceOf(TodoFakeBuilder)
      expect(faker['_priority']).toBeNull()

      const todoLow = PriorityType.createLow()
      faker.withPriority(todoLow)
      expect(faker['_priority']).toEqual(todoLow)

      faker.withPriority(() => todoLow)
      // @ts-expect-error This expression is not callable
      expect(faker['_priority']()).toEqual(todoLow)

      expect(faker.priority).toEqual(todoLow)
    })

    it('should pass an index to priority factory', () => {
      faker.withPriority((index) =>
        index % 2 === 0
          ? PriorityType.createLow()
          : PriorityType.createHigh()
      )

      const todo = faker.build()
      expect(
        todo.priority.equals(PriorityType.createLow())
      ).toBeTruthy()

      const fakerMany = TodoFakeBuilder.theTodos(2)
      fakerMany.withPriority((index) =>
        index % 2 === 0
          ? PriorityType.createLow()
          : PriorityType.createHigh()
      )
      const todos = fakerMany.build()

      expect(
        todos[0].priority.equals(PriorityType.createLow())
      ).toBeTruthy()
      expect(
        todos[1].priority.equals(PriorityType.createHigh())
      ).toBeTruthy()
    })

    test('invalid empty case', () => {
      const $this = faker.withInvalidPriorityEmpty(undefined)
      expect($this).toBeInstanceOf(TodoFakeBuilder)
      expect(faker['_priority']).toBeUndefined()

      faker.withInvalidPriorityEmpty(null)
      expect(faker['_priority']).toBeNull()

      faker.withInvalidPriorityEmpty('')
      expect(faker['_priority']).toBe('')
    })

    test('invalid not a priority type case', () => {
      const $this = faker.withInvalidPriorityNotAPriorityType()
      expect($this).toBeInstanceOf(TodoFakeBuilder)
      expect(faker['_priority']).toBe('fake priority type')

      faker.withInvalidPriorityNotAPriorityType(5)
      expect(faker['_priority']).toBe(5)
    })
  })

  describe('description prop', () => {
    const faker = TodoFakeBuilder.aTodo()

    it('should be a function', () => {
      expect(typeof faker['_description'] === 'function').toBeTruthy()
    })

    it('should call the sentence method', () => {
      const spySentenceMethod = jest.spyOn(DataGenerator, 'sentence')
      faker['lib'] = DataGenerator
      faker.build()

      expect(spySentenceMethod).toHaveBeenCalled()
    })

    test('withDescription', () => {
      const $this = faker.withDescription(null)
      expect($this).toBeInstanceOf(TodoFakeBuilder)
      expect(faker['_description']).toBeNull()

      faker.withDescription('test description')
      expect(faker['_description']).toBe('test description')

      faker.withDescription(() => 'test description')
      // @ts-expect-error This expression is not callable
      expect(faker['_description']()).toBe('test description')

      expect(faker.description).toBe('test description')
    })

    it('should pass an index to description factory', () => {
      faker.withDescription((index) => `test description ${index}`)
      const todo = faker.build()
      expect(todo.description).toBe('test description 0')

      const fakerMany = TodoFakeBuilder.theTodos(2)
      fakerMany.withDescription((index) => `test description ${index}`)
      const todos = fakerMany.build()

      expect(todos[0].description).toBe('test description 0')
      expect(todos[1].description).toBe('test description 1')
    })

    test('invalid not a string case', () => {
      const $this = faker.withInvalidDescriptionNotAString()
      expect($this).toBeInstanceOf(TodoFakeBuilder)
      expect(faker['_description']).toBe(5)

      faker.withInvalidDescriptionNotAString(55)
      expect(faker['_description']).toBe(55)

      faker.withInvalidDescriptionNotAString(true)
      expect(faker['_description']).toBeTruthy()
    })
  })

  describe('is_scratched prop', () => {
    const faker = TodoFakeBuilder.aTodo()

    it('should be a function', () => {
      expect(typeof faker['_is_scratched'] === 'function').toBeTruthy()
    })

    test('completeTask', () => {
      const $this = faker.completeTask()
      expect($this).toBeInstanceOf(TodoFakeBuilder)
      expect(faker['_is_scratched']).toBeTruthy()
      expect(faker.is_scratched).toBeTruthy()
    })

    test('reactivateTask', () => {
      const $this = faker.reactivateTask()
      expect($this).toBeInstanceOf(TodoFakeBuilder)
      expect(faker['_is_scratched']).toBeFalsy()
      expect(faker.is_scratched).toBeFalsy()
    })

    test('invalid empty case', () => {
      const $this = faker.withInvalidIsScratchedEmpty(undefined)
      expect($this).toBeInstanceOf(TodoFakeBuilder)
      expect(faker['_is_scratched']).toBeUndefined()

      faker.withInvalidIsScratchedEmpty(null)
      expect(faker['_is_scratched']).toBeNull()

      faker.withInvalidIsScratchedEmpty('')
      expect(faker['_is_scratched']).toBe('')
    })

    test('invalid not a boolean case', () => {
      const $this = faker.withInvalidIsScratchedNotABoolean()
      expect($this).toBeInstanceOf(TodoFakeBuilder)
      expect(faker['_is_scratched']).toBe('fake boolean')

      faker.withInvalidIsScratchedNotABoolean(5)
      expect(faker['_is_scratched']).toBe(5)
    })
  })

  describe('created_at prop', () => {
    const faker = TodoFakeBuilder.aTodo()
    it('should throw an error when created_at has not been set', () => {
      expect(() => faker['getValue']('created_at')).toThrow(
        new Error(
          'Property created_at does not have a factory, use \'with\' method instead'
        )
      )
      expect(() => faker.created_at).toThrow(
        new Error(
          'Property created_at does not have a factory, use \'with\' method instead'
        )
      )
    })

    it('should be undefined', () => {
      expect(faker['_created_at']).toBeUndefined()
    })

    test('withCreatedAt', () => {
      const date = new Date()
      const $this = faker.withCreatedAt(date)
      expect($this).toBeInstanceOf(TodoFakeBuilder)
      expect(faker['_created_at']).toBe(date)

      faker.withCreatedAt(() => date)
      // expect(faker['_created_at']()).toBe(date)
      expect(faker.created_at).toBe(date)
    })

    it('should pass index to created_at factory', () => {
      const date = new Date()
      faker.withCreatedAt(
        (index) => new Date(date.getTime() + (index + 2) * 1000)
      )
      const todo = faker.build()
      expect(todo.created_at.getTime()).toBe(date.getTime() + 2 * 1000)

      const fakerMany = TodoFakeBuilder.theTodos(2)
      fakerMany.withCreatedAt(
        (index) => new Date(date.getTime() + (index + 2) * 1000)
      )
      const todos = fakerMany.build()
      expect(todos[0].created_at.getTime()).toBe(
        date.getTime() + (0 + 2) * 1000
      )
      expect(todos[1].created_at.getTime()).toBe(
        date.getTime() + (1 + 2) * 1000
      )
    })

    it('should create a todo', () => {
      let todo = TodoFakeBuilder.aTodo().build()
      expect(todo.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
      expect(typeof todo.title === 'string').toBeTruthy()
      expect(todo.priority).toBeInstanceOf(PriorityType)
      expect(todo.created_at).toBeInstanceOf(Date)

      const createdAt = new Date()
      const uniqueEntityId = new UniqueEntityId()
      todo = TodoFakeBuilder.aTodo()
        .withTitle('some title')
        .withPriority(PriorityType.createLow())
        .withCreatedAt(createdAt)
        .withUniqueEntityId(uniqueEntityId)
        .build()
      expect(todo.uniqueEntityId).toBe(uniqueEntityId)
      expect(todo.id).toBe(uniqueEntityId.value)
      expect(todo.title).toBe('some title')
      expect(
        todo.priority.equals(PriorityType.createLow())
      ).toBeTruthy()
      expect(todo.created_at).toStrictEqual(createdAt)
    })

    it('should create many todos', () => {
      let todos = TodoFakeBuilder.theTodos(2).build()

      todos.forEach((todo) => {
        expect(todo.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
        expect(typeof todo.title === 'string').toBeTruthy()
        expect(todo.priority).toBeInstanceOf(PriorityType)
        expect(todo.created_at).toBeInstanceOf(Date)
      })

      const createdAt = new Date()
      const uniqueEntityId = new UniqueEntityId()
      todos = TodoFakeBuilder.theTodos(2)
        .withTitle('some title')
        .withPriority(PriorityType.createLow())
        .withCreatedAt(createdAt)
        .withUniqueEntityId(uniqueEntityId)
        .build()

      todos.forEach((todo) => {
        expect(todo.uniqueEntityId).toBe(uniqueEntityId)
        expect(todo.id).toBe(uniqueEntityId.value)
        expect(todo.title).toBe('some title')
        expect(
          todo.priority.equals(PriorityType.createLow())
        ).toBeTruthy()
        expect(todo.created_at).toStrictEqual(createdAt)
      })
    })
  })

  it('should create a todo', () => {
    const faker = TodoFakeBuilder.aTodo()
    let todo = faker.build()

    expect(todo.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
    expect(typeof todo.title === 'string').toBeTruthy()
    expect(typeof todo.description === 'string').toBeTruthy()
    expect(todo.is_scratched).toBeFalsy()
    expect(todo.created_at).toBeInstanceOf(Date)

    const createdAt = new Date()
    const uniqueEntityId = new UniqueEntityId()

    todo = faker
      .withUniqueEntityId(uniqueEntityId)
      .withTitle('title test')
      .withDescription('description test')
      .completeTask()
      .withCreatedAt(createdAt)
      .build()

    expect(todo.uniqueEntityId.value).toBe(uniqueEntityId.value)
    expect(todo.title).toBe('title test')
    expect(todo.description).toBe('description test')
    expect(todo.is_scratched).toBeTruthy()
    expect(todo.props.created_at).toEqual(createdAt)
  })

  it('should create many todos', () => {
    const faker = TodoFakeBuilder.theTodos(2)
    let todos = faker.build()

    todos.forEach((todo) => {
      expect(todo.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
      expect(typeof todo.title === 'string').toBeTruthy()
      expect(typeof todo.description === 'string').toBeTruthy()
      expect(todo.is_scratched).toBeFalsy()
      expect(todo.created_at).toBeInstanceOf(Date)
    })

    const createdAt = new Date()
    const uniqueEntityId = new UniqueEntityId()

    todos = faker
      .withUniqueEntityId(uniqueEntityId)
      .withTitle('title test')
      .withDescription('description test')
      .completeTask()
      .withCreatedAt(createdAt)
      .build()

    todos.forEach((todo) => {
      expect(todo.uniqueEntityId.value).toBe(uniqueEntityId.value)
      expect(todo.title).toBe('title test')
      expect(todo.description).toBe('description test')
      expect(todo.is_scratched).toBeTruthy()
      expect(todo.props.created_at).toEqual(createdAt)
    })
  })
})
