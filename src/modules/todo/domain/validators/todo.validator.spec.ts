import { TodoProperties } from '../entities/todo'
import { TodoValidatorFactory, TodoRules, TodoValidator } from './todo.validator'

describe('TodoValidator Tests', () => {
  let validator: TodoValidator = TodoValidatorFactory.create()

  beforeEach(() => {
    validator = TodoValidatorFactory.create()
  })

  test('invalidation cases for title field', () => {
    expect({ validator, data: { title: null } }).containsErrorMessages({
      title: [
        'title should not be empty',
        'title must be a string',
        'title must be longer than or equal to 3 characters',
        'title must be shorter than or equal to 40 characters'
      ]
    })

    expect({ validator, data: { title: '' } }).containsErrorMessages({
      title: [
        'title should not be empty',
        'title must be longer than or equal to 3 characters'
      ]
    })

    expect({ validator, data: { title: 5 } }).containsErrorMessages({
      title: [
        'title must be a string',
        'title must be longer than or equal to 3 characters',
        'title must be shorter than or equal to 40 characters'
      ]
    })

    expect({ validator, data: { title: 's'.repeat(41) } }).containsErrorMessages({
      title: [
        'title must be shorter than or equal to 40 characters'
      ]
    })

    expect({ validator, data: { title: 's' } }).containsErrorMessages({
      title: [
        'title must be longer than or equal to 3 characters'
      ]
    })
  })

  test('invalidation cases for description field', () => {
    expect({ validator, data: { description: '' } }).containsErrorMessages({
      description: [
        'description must be longer than or equal to 10 characters'
      ]
    })

    expect({ validator, data: { description: 5 } }).containsErrorMessages({
      description: [
        'description must be a string',
        'description must be longer than or equal to 10 characters',
        'description must be shorter than or equal to 255 characters'
      ]
    })

    expect({ validator, data: { description: 's'.repeat(256) } }).containsErrorMessages({
      description: [
        'description must be shorter than or equal to 255 characters'
      ]
    })
  })

  test('invalidation cases for priority field', () => {
    expect({ validator, data: { priority: null } }).containsErrorMessages({
      priority: [
        'priority should not be empty',
        'priority must be a string',
        'priority must be one of the following values: low, medium, high'
      ]
    })

    expect({ validator, data: { priority: '' } }).containsErrorMessages({
      priority: [
        'priority should not be empty',
        'priority must be one of the following values: low, medium, high'
      ]
    })

    expect({ validator, data: { priority: 5 } }).containsErrorMessages({
      priority: [
        'priority must be a string',
        'priority must be one of the following values: low, medium, high'
      ]
    })
  })

  test('invalidation cases for is_scratched field', () => {
    expect({ validator, data: { is_scratched: 5 } }).containsErrorMessages({
      is_scratched: [
        'is_scratched must be a boolean value'
      ]
    })

    expect({ validator, data: { is_scratched: 0 } }).containsErrorMessages({
      is_scratched: [
        'is_scratched must be a boolean value'
      ]
    })

    expect({ validator, data: { is_scratched: 1 } }).containsErrorMessages({
      is_scratched: [
        'is_scratched must be a boolean value'
      ]
    })
  })

  test('valid cases for fields', () => {
    const createdAt = new Date()

    const todo: TodoProperties = {
      title: 'Supermarket',
      priority: 'medium'
    }

    const arrange = [
      todo,
      {
        ...todo,
        description: 'go to the nearest market. Buy spices and juices',
        is_scratched: false
      },
      {
        ...todo,
        priority: 'MEDIUM' as any,
        createdAt
      },
      {
        ...todo,
        is_scratched: true,
        createdAt
      }
    ]

    arrange.forEach((i) => {
      const isValid = validator.validate(i)
      expect(isValid).toBeTruthy()
      expect(validator.validatedData).toStrictEqual(new TodoRules(i))
    })
  })
})
