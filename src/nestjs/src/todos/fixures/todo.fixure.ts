import { SortDirection } from 'todo-list/@shared/domain';
import { Todo, PriorityType } from 'todo-list/todo/domain';

export class TodoFixture {
  static keysInResponse() {
    return [
      'id',
      'title',
      'priority',
      'description',
      'is_scratched',
      'created_at',
    ];
  }

  static arrangeForCreate() {
    const faker = Todo.fake()
      .aTodo()
      .withTitle('go to the bakery')
      .withDescription('get croissant')
      .withPriority(PriorityType.createMedium())
      .build();

    return [
      {
        send_data: {
          title: faker.title,
        },
        expected: {
          description: null,
          priority: 2,
          is_scratched: false,
        },
      },
      {
        send_data: {
          title: faker.title,
          priority: 1,
        },
        expected: {
          priority: 1,
          description: null,
          is_scratched: false,
        },
      },
      {
        send_data: {
          title: faker.title,
          description: faker.description,
        },
        expected: {
          description: faker.description,
          is_scratched: false,
          priority: 2,
        },
      },
      {
        send_data: {
          title: faker.title,
          is_scratched: false,
        },
        expected: {
          description: null,
          priority: 2,
        },
      },
      {
        send_data: {
          title: faker.title,
          priority: faker.priority.code,
          description: faker.description,
          is_scratched: true,
        },
        expected: {},
      },
    ];
  }

  static arrangeForUpdate() {
    const faker = Todo.fake()
      .aTodo()
      .withTitle('go to the bakery')
      .withDescription('get croissant')
      .withPriority(PriorityType.createMedium())
      .build();

    // if the description is not sent for the update,
    // the current description of the entity is maintained.
    return [
      {
        send_data: {
          title: faker.title,
        },
        expected: {
          is_scratched: false,
        },
      },
      {
        send_data: {
          title: faker.title,
          priority: 3,
        },
        expected: {
          priority: 3,
          is_scratched: false,
        },
      },
      {
        send_data: {
          title: faker.title,
          description: faker.description,
        },
        expected: {
          is_scratched: false,
          description: faker.description,
        },
      },
      {
        send_data: {
          title: faker.title,
          is_scratched: false,
          priority: 2,
        },
        expected: {
          priority: 2,
        },
      },
      {
        send_data: {
          title: faker.title,
          priority: faker.priority.code,
          description: faker.description,
          is_scratched: true,
        },
        expected: {},
      },
    ];
  }

  static arrangeForSave() {
    const faker = Todo.fake()
      .aTodo()
      .withTitle('go to the bakery')
      .withDescription('get croissant')
      .withPriority(PriorityType.createMedium())
      .build();

    return [
      {
        send_data: {
          title: faker.title,
        },
        expected: {
          is_scratched: false,
        },
      },
      {
        send_data: {
          title: faker.title,
          priority: 2,
        },
        expected: {
          priority: 2,
          description: null,
          is_scratched: false,
        },
      },
      {
        send_data: {
          title: faker.title,
          description: null,
        },
        expected: {
          is_scratched: false,
          priority: 2,
        },
      },
      {
        send_data: {
          title: faker.title,
          is_scratched: true,
        },
        expected: {
          description: null,
          priority: 2,
        },
      },
      {
        send_data: {
          title: faker.title,
          is_scratched: false,
        },
        expected: {
          description: null,
          priority: 2,
        },
      },
      {
        send_data: {
          title: faker.title,
          priority: faker.priority.code,
          description: faker.description,
          is_scratched: true,
        },
        expected: {},
      },
      {
        send_data: {
          title: faker.title,
          priority: faker.priority.code,
          description: faker.description,
          is_scratched: false,
        },
        expected: {},
      },
    ];
  }

  static arrangeInvalidRequest() {
    const faker = Todo.fake().aTodo();

    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return [
      {
        label: 'EMPTY',
        send_data: {},
        expected: {
          message: ['title should not be empty', 'title must be a string'],
          ...defaultExpected,
        },
      },
      {
        label: 'TITLE UNDEFINED',
        send_data: {
          title: faker.withInvalidTitleEmpty(undefined).title,
        },
        expected: {
          message: ['title should not be empty', 'title must be a string'],
          ...defaultExpected,
        },
      },
      {
        label: 'TITLE NULL',
        send_data: {
          title: faker.withInvalidTitleEmpty(null).title,
        },
        expected: {
          message: ['title should not be empty', 'title must be a string'],
          ...defaultExpected,
        },
      },
      {
        label: 'TITLE EMPTY',
        send_data: {
          title: faker.withInvalidTitleEmpty('').title,
        },
        expected: {
          message: ['title should not be empty'],
          ...defaultExpected,
        },
      },
      {
        label: 'DESCRIPTION NOT A STRING',
        send_data: {
          description: faker.withInvalidDescriptionNotAString().description,
        },
        expected: {
          message: [
            'description should not be empty',
            'description must be a string',
            'description must be a string',
          ],
          ...defaultExpected,
        },
      },
      {
        label: 'IS_SCRATCHED EMPTY',
        send_data: {
          is_scratched: faker.withInvalidIsScratchedEmpty('').is_scratched,
        },
        expected: {
          message: [
            'title should not be empty',
            'title must be a string',
            'is_scratched must be a boolean value',
          ],
          ...defaultExpected,
        },
      },
      {
        label: 'IS_SCRATCHED NOT A BOOLEAN',
        send_data: {
          is_scratched: faker.withInvalidIsScratchedNotABoolean().is_scratched,
        },
        expected: {
          message: [
            'title should not be empty',
            'title must be a string',
            'is_scratched must be a boolean value',
          ],
          ...defaultExpected,
        },
      },
    ];
  }

  static arrangeForEntityValidationError() {
    const faker = Todo.fake().aTodo();

    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return [
      {
        label: 'EMPTY',
        send_data: {},
        expected: {
          message: [
            'title should not be empty',
            'title must be a string',
            'title must be longer than or equal to 3 characters',
            'title must be shorter than or equal to 40 characters',
          ],
          ...defaultExpected,
        },
      },
      {
        label: 'TITLE UNDEFINED',
        send_data: {
          title: faker.withInvalidTitleEmpty(undefined).title,
        },
        expected: {
          message: [
            'title should not be empty',
            'title must be a string',
            'title must be longer than or equal to 3 characters',
            'title must be shorter than or equal to 40 characters',
          ],
          ...defaultExpected,
        },
      },
      {
        label: 'TITLE NULL',
        send_data: {
          title: faker.withInvalidTitleEmpty(null).title,
        },
        expected: {
          message: [
            'title should not be empty',
            'title must be a string',
            'title must be longer than or equal to 3 characters',
            'title must be shorter than or equal to 40 characters',
          ],
          ...defaultExpected,
        },
      },
      {
        label: 'TITLE EMPTY',
        send_data: {
          title: faker.withInvalidTitleEmpty('').title,
        },
        expected: {
          message: [
            'title should not be empty',
            'title must be longer than or equal to 3 characters',
          ],
          ...defaultExpected,
        },
      },
      {
        label: 'TITLE TOO LONG',
        send_data: {
          title: faker.withInvalidTitleTooLong().title,
        },
        expected: {
          message: ['title must be shorter than or equal to 40 characters'],
          ...defaultExpected,
        },
      },
      {
        label: 'DESCRIPTION NOT A STRING',
        send_data: {
          description: faker.withInvalidDescriptionNotAString().description,
        },
        expected: {
          message: [
            'title should not be empty',
            'title must be a string',
            'title must be longer than or equal to 3 characters',
            'title must be shorter than or equal to 40 characters',
            'description must be a string',
          ],
          ...defaultExpected,
        },
      },
      {
        label: 'IS_SCRATCHED EMPTY',
        send_data: {
          is_scratched: faker.withInvalidIsScratchedEmpty('').is_scratched,
        },
        expected: {
          message: [
            'title should not be empty',
            'title must be a string',
            'title must be longer than or equal to 3 characters',
            'title must be shorter than or equal to 40 characters',
            'is_scratched must be a boolean value',
          ],
          ...defaultExpected,
        },
      },
      {
        label: 'IS_SCRATCHED NOT A BOOLEAN',
        send_data: {
          is_scratched: faker.withInvalidIsScratchedNotABoolean().is_scratched,
        },
        expected: {
          message: [
            'title should not be empty',
            'title must be a string',
            'title must be longer than or equal to 3 characters',
            'title must be shorter than or equal to 40 characters',
            'is_scratched must be a boolean value',
          ],
          ...defaultExpected,
        },
      },
    ];
  }
}

export class CreateTodoFixture {
  static keysInResponse() {
    return TodoFixture.keysInResponse();
  }

  static arrangeForSave() {
    return TodoFixture.arrangeForCreate();
  }

  static arrangeInvalidRequest() {
    return TodoFixture.arrangeInvalidRequest();
  }

  static arrangeForEntityValidationError() {
    return TodoFixture.arrangeForEntityValidationError();
  }
}

export class UpdateTodoFixture {
  static keysInResponse() {
    return TodoFixture.keysInResponse();
  }

  static arrangeForSave() {
    return TodoFixture.arrangeForUpdate();
  }

  static arrangeInvalidRequest() {
    return TodoFixture.arrangeInvalidRequest();
  }

  static arrangeForEntityValidationError() {
    const removeTests = ['IS_SCRATCHED EMPTY', 'IS_SCRATCHED NOT A BOOLEAN'];
    const tests = TodoFixture.arrangeForEntityValidationError();

    return tests.filter((test) => {
      if (!removeTests.includes(test.label)) {
        return test;
      }
    });
  }
}

export class ListTodosFixture {
  static arrangeIncrementedWithCreatedAt() {
    const entities = Todo.fake()
      .theTodos(4)
      .withTitle((index) => `teste ${index}`)
      .withCreatedAt((index) => new Date(new Date().getTime() + index * 1000))
      .build();

    const entitiesMap = {
      first: entities[0],
      second: entities[1],
      third: entities[2],
      fourth: entities[3],
    };

    console.log(entitiesMap.first);

    const arrange = [
      {
        send_data: {},
        expected: {
          items: [
            entitiesMap.fourth.toJSON(),
            entitiesMap.third.toJSON(),
            entitiesMap.second.toJSON(),
            entitiesMap.first.toJSON(),
          ],
          current_page: 1,
          last_page: 1,
          per_page: 15,
          total: 4,
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
        },
        expected: {
          items: [entitiesMap.fourth.toJSON(), entitiesMap.third.toJSON()],
          current_page: 1,
          last_page: 2,
          per_page: 2,
          total: 4,
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
        },
        expected: {
          items: [entitiesMap.second.toJSON(), entitiesMap.first.toJSON()],
          current_page: 2,
          last_page: 2,
          per_page: 2,
          total: 4,
        },
      },
      {
        send_data: {
          page: 99,
          per_page: 2,
        },
        expected: {
          items: [],
          current_page: 99,
          last_page: 2,
          per_page: 2,
          total: 4,
        },
      },
    ];

    return { arrange, entitiesMap };
  }

  static arrangeUnsorted() {
    const faker = Todo.fake().aTodo();

    const entitiesMap = {
      app: faker.withTitle('app').build(),
      AAA: faker.withTitle('AAA').build(),
      AaA: faker.withTitle('AaA').build(),
      bbb: faker.withTitle('bbb').build(),
      ccc: faker.withTitle('ccc').build(),
    };

    const arrange = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'title',
          filter: 'a',
        },
        expected: {
          items: [entitiesMap.AAA.toJSON(), entitiesMap.AaA.toJSON()],
          total: 3,
          current_page: 1,
          last_page: 2,
          per_page: 2,
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
          sort: 'title',
          filter: 'a',
        },
        expected: {
          items: [entitiesMap.app.toJSON()],
          total: 3,
          current_page: 2,
          last_page: 2,
          per_page: 2,
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'title',
          sort_dir: 'desc' as SortDirection,
          filter: 'a',
        },
        expected: {
          items: [entitiesMap.app.toJSON(), entitiesMap.AaA.toJSON()],
          total: 3,
          current_page: 1,
          last_page: 2,
          per_page: 2,
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
          sort: 'title',
          sort_dir: 'desc' as SortDirection,
          filter: 'a',
        },
        expected: {
          items: [entitiesMap.AAA.toJSON()],
          total: 3,
          current_page: 2,
          last_page: 2,
          per_page: 2,
        },
      },
    ];

    return { arrange, entitiesMap };
  }
}
