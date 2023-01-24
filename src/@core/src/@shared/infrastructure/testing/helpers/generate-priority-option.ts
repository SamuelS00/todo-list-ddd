import { Priority } from '#todo/domain/entities/todo'

const priorityOptions: Priority[] = ['low', 'medium', 'high']

export function genPriorityOption (): Priority {
  return priorityOptions[Math.floor(Math.random() * priorityOptions.length)]
}
