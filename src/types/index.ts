import { FILTER_TYPE } from '@/constants'

export interface UserData {
  id: number
  avatar: string
  review: string
  name: string
  quantity: number
  date: string
  price: number
}

export interface FilterItem {
  label: string
  key: keyof FilterParamOrder
  isChecked: boolean
}

export interface FilterParamOrder {
  customer_id: boolean
  date_gte: boolean
  date_lte: boolean
  total_gte: boolean
  returned: boolean
}

export interface FilterQuery {
  field: string
  value: string
}

export interface SaveQuery {
  name: string
  values: FilterQuery[]
}

export interface ColumnItem {
  label: string
  value: string
  isVisible: boolean
  numeric: boolean
  disablePadding: boolean
}

export interface SelectOptionItem {
  label: string
  value: string
}

export interface LSType {
  name: string
  value: any
  id: number
}
