import { Chance } from 'chance'

const lib = Chance()

export const DataGenerator = {
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
  sentence (): string {
    return DataGenerator.lib.sentence()
  },
  date (): Date {
    return DataGenerator.lib.date()
  }
}
