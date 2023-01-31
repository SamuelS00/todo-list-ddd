export default {
  displayName: {
    name: "nestjs",
    color: 'magentaBright'
  },
  moduleFileExtensions: [
    "js",
    "json",
    "ts"
  ],
  rootDir: "src",
  testRegex: ".*\\..*spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "@swc/jest"
  },
  collectCoverageFrom: [
    "**/*.(t|j)s"
  ],
  coverageDirectory: "../coverage",
  moduleNameMapper: {
    'todo\\-list/(.*)$': '<rootDir>/../../../node_modules/todo-list/dist/$1',
    // '#shared/domain': '<rootDir>/../../../node_modules/todo-list/dist/@shared/domain/index.js',
    '#shared/(.*)$': '<rootDir>/../../../node_modules/todo-list/dist/@shared/$1',
    // '#todo/domain': '<rootDir>/../../../node_modules/todo-list/dist/todo/domain/index.js',
    '#todo/(.*)$': '<rootDir>/../../../node_modules/todo-list/dist/todo/$1',
  },
  setupFilesAfterEnv: [
    '../../@core/src/@shared/domain/tests/jest.ts',
  ],
}  