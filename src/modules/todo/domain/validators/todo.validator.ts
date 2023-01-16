/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/naming-convention */
import { IsBoolean, IsDate, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { ClassValidatorFields } from '../../../../@shared/validators/class-validator'
import { TodoProperties, Priority } from '../entities/todo'

const operations = ['low', 'medium', 'high'] as const

export class TodoRules {
  @MaxLength(40)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
    title: string

  @MaxLength(255)
  @MinLength(10)
  @IsString()
  @IsOptional()
    description: string

  @IsIn(operations)
  @IsString()
  @IsNotEmpty()
    priority: Priority

  @IsDate()
  @IsOptional()
    created_at: Date

  @IsBoolean()
  @IsOptional()
    is_scratched: boolean

  constructor ({
    title,
    description,
    priority,
    created_at,
    is_scratched
  }: TodoProperties) {
    Object.assign(this, { title, description, priority, created_at, is_scratched })
  }
}

export class TodoValidator extends ClassValidatorFields<TodoRules> {
  validate (data: TodoProperties): boolean {
    return super.validate(new TodoRules(data ?? {} as any))
  }
}

export default class TodoValidatorFactory {
  static create (): TodoValidator {
    return new TodoValidator()
  }
}
