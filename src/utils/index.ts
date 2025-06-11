import { format } from 'date-fns'

export function formatDateTime(dateData: string, formatPattern: string) {
  return format(new Date(dateData), formatPattern)
}
