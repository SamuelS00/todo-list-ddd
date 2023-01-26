import { config as readEnv } from 'dotenv'
import { join } from 'path'

interface ConfigOutput { db: { vendor: any, host: string | undefined, logging: boolean }}

function makeConfig (envFile: string): ConfigOutput {
  const output = readEnv({ path: envFile })

  return {
    db: {
      vendor: output.parsed?.DB_VENDOR as any,
      host: output.parsed?.DB_HOST,
      logging: output.parsed?.DB_LOGGING === 'true'
    }
  }
}
const envTestingFile = join(__dirname, '../../../../.env.test')

export const configTest = makeConfig(envTestingFile)
