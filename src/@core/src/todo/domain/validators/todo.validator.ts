/* eslint-disable @typescript-eslint/naming-convention */

import {
  IsBoolean,
  IsDate,
  IsInstance,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator'
import { ClassValidatorFields } from '../../../@shared/domain/validators/class-validator'
import { PriorityType } from '../entities/priority-type.vo'
import { TodoProperties } from '../entities/todo'

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

  @IsNotEmptyObject()
  @IsNotEmpty()
  @IsInstance(PriorityType)
  @IsOptional()
    priority: PriorityType

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
