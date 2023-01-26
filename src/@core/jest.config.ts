/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */


export default {
  displayName: {
    name: "@core",
    color: 'blue'
  },
  clearMocks: true,
  coverageDirectory: '<rootDir>/../__coverage',
  coverageProvider: "v8",
  coverageReporters: [
    "json",
    "html"
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  },
  moduleFileExtensions: [
    "js",
    "mjs",
    "cjs",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node"
  ],
  rootDir: "src",
  setupFilesAfterEnv: [
    './@shared/domain/tests/validations.ts',
    './@shared/domain/tests/jest.ts',
  ],
  testRegex: ".*\\..*spec\\.ts$",
  transform: {
    "^.+\\.ts?$": ["@swc/jest"]
  }
};
