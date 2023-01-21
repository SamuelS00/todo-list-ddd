/* eslint-disable @typescript-eslint/naming-convention */

import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  ValidateByOptions
} from 'class-validator'
import { ClassValidatorFields } from '../../../@shared/domain/validators/class-validator'
import { TodoProperties, Priority } from '../entities/todo'

const PriorityMatches = (
  validationOption?: ValidateByOptions
): PropertyDecorator => Matches('^LOW|MEDIUM|HIGH$', 'i',
  {
    ...validationOption,
    message: 'priority must be one of the following values: low, medium, high'
  }
)

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

  @PriorityMatches()
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

export const TodoValidatorFactory = {
  create: () => {
    return new TodoValidator()
  }
}
