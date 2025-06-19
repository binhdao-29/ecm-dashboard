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
  key: string
  isChecked: boolean
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
}
