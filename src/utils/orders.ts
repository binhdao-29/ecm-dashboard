import { LSType } from '@/types'

const nameOrder = 'orders_save_query'

export function saveOrderQueryToLS(value: LSType[]) {
  localStorage.setItem(nameOrder, JSON.stringify(value))
}

export function getOrderQueryFormLS() {
  const dataLs = localStorage.getItem(nameOrder)
  if (!dataLs) return []
  return JSON.parse(dataLs)
}

export function deleteOrderQueryFormLS(id: number) {
  const dataLs: LSType[] = JSON.parse(localStorage.getItem(nameOrder) ?? '[]')
  const filterDataLs = dataLs.filter((data) => data.id !== id)

  if (!filterDataLs.length) {
    localStorage.removeItem(nameOrder)
  }
  localStorage.setItem(nameOrder, JSON.stringify(filterDataLs))
}
