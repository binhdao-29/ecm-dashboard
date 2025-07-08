import { OrderUrlQuery } from '@/features/orders/type'
import { QuerySaveType } from '@/types'

const saveQueryLsName = 'orders_save_query'
const orderListParamsLSName = 'order.listParams'

export function setOrderSaveQueryToLS(value: QuerySaveType[]) {
  if (!value.length) {
    localStorage.removeItem(saveQueryLsName)
  } else {
    localStorage.setItem(saveQueryLsName, JSON.stringify(value))
  }
}

export function getOrderSaveQueryFormLS(): QuerySaveType[] {
  const dataLs = localStorage.getItem(saveQueryLsName)
  if (!dataLs) return []
  return JSON.parse(dataLs)
}

export function saveListParamsToLS(value: OrderUrlQuery) {
  localStorage.setItem(orderListParamsLSName, JSON.stringify(value))
}

export function getListParamsFormLS(): OrderUrlQuery {
  const dataLs = localStorage.getItem(orderListParamsLSName)
  if (!dataLs)
    return {
      displayedFilters: {},
      filter: {}
    }
  const obj = JSON.parse(dataLs)
  return {
    displayedFilters: obj.displayedFilters,
    filter: obj.filter
  }
}
