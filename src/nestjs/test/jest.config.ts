export default {
  ...require('../jest.config').default,
  displayName: {
    name: 'nestjs-e2e',
    color: 'yellow',
  },
  rootDir: './',
  testRegex: ['.*\\.e2e-spec\\.ts$'],
  maxWorkers: 1,
  setupFiles: ['<rootDir>/setup-test.ts'],
  moduleNameMapper: {
    'todo\\-list/(.*)$': '<rootDir>/../../../node_modules/todo-list/dist/$1',
    '#shared/(.*)$': '<rootDir>/../../../node_modules/todo-list/dist/@shared/$1',
    '#todo/(.*)$': '<rootDir>/../../../node_modules/todo-list/dist/todo/$1',
  },
};