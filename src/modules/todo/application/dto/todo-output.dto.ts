export interface TodoOutput {
  id: string
  title: string
  description?: string | null
  priority: string
  is_scratched?: boolean
  created_at: Date
}
