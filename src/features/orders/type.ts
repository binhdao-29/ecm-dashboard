import { FilterItem, UrlQuery } from '@/types'

export interface OrderParams {
  status: string
  customer_id: string
  date_gte: string
  date_lte: string
  total_gte: number
  returned: string
}

export type OrderFilterItem = FilterItem<OrderParams>

export type OrderUrlQuery = UrlQuery<OrderParams>
