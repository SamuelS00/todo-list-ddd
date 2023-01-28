import { ValueObject } from '../../../@shared/domain/value-object/value-object'
import { PriorityError } from '../errors/priority-type.error'

export interface PriorityTypeProps {
  code: number
  description: string
}

export class PriorityType extends ValueObject<PriorityTypeProps> {
  constructor (public readonly props: PriorityTypeProps) {
    super(props)
    this.validate(props)
  }

  private validate (value: PriorityTypeProps): void {
    if (![1, 2, 3].includes(value.code)) {
      throw new PriorityError('code must be either 1, 2 or 3')
    }

    if (value.code === 1 && value.description !== 'Low') {
      throw new PriorityError('description must be low when code is 1')
    }

    if (value.code === 2 && value.description !== 'Medium') {
      throw new PriorityError('description must be medium when code is 2')
    }

    if (value.code === 3 && value.description !== 'High') {
      throw new PriorityError('description must be high when code is 3')
    }
  }

  get code (): number {
    return this.value.code
  }

  get description (): string {
    return this.value.description
  }

  static createLow (): PriorityType {
    return new PriorityType({ code: 1, description: 'Low' })
  }

  static createMedium (): PriorityType {
    return new PriorityType({ code: 2, description: 'Medium' })
  }

  static createHigh (): PriorityType {
    return new PriorityType({ code: 3, description: 'High' })
  }

  static createByCode (code: number): PriorityType {
    if (code === 1) {
      return PriorityType.createLow()
    }

    if (code === 2) {
      return PriorityType.createMedium()
    }

    if (code === 3) {
      return PriorityType.createHigh()
    }

    throw new PriorityError(
      'code must be either 1 for low, 2 for medium or 3 for high'
    )
  }
}
