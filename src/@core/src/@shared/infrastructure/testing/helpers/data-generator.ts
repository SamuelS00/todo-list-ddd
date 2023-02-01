import { Chance } from 'chance'

const lib = Chance()

export interface DataGeneratorInterface<T> {
  lib: T
  uuid: () => string
  word: (options?: { length?: number }) => string
  text: () => string
  integer: (min: number, max: number) => number
  sentence: () => string
  paragraph: () => string
  date: () => Date
}

export const DataGenerator: DataGeneratorInterface<Chance.Chance> = {
  lib,
  uuid (): string {
    return DataGenerator.lib.guid({ version: 4 })
  },
  word (options?: { length?: number }): string {
    const optionCondition = typeof options?.length === 'number'

    return DataGenerator.lib.word(optionCondition ? { length: options.length } : {})
  },
  text (): string {
    return DataGenerator.lib.paragraph()
  },
  integer (min: number, max: number): number {
    return DataGenerator.lib.integer({ min, max })
  },
  sentence (): string {
    return DataGenerator.lib.sentence()
  },
  paragraph (): string {
    return DataGenerator.lib.paragraph()
  },
  date (): Date {
    return DataGenerator.lib.date()
  }
}
