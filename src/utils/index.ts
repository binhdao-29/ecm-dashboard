import { format } from 'date-fns'

export function formatDateTime(dateData: string, formatPattern: string) {
  return format(new Date(dateData), formatPattern)
}

export function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {}

  for (const key in obj) {
    const value = obj[key]
    if (value && value !== 'false') {
      result[key] = value
    }
  }

  return result
}

export function isoStringToDate(isoString?: string): Date | null {
  if (!isoString) return null
  return new Date(isoString)
}
