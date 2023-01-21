module.exports = {
  extends: 'standard-with-typescript',
  parserOptions: {
    project: './src/@core/tsconfig.json',
    rules: {
      '@typescript-eslint/strict-boolean-expressions': 'warn'
    }
  }
}
