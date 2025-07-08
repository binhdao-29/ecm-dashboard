import { ColumnItem } from '@/types'
import * as React from 'react'
import { OrderFilterItem } from '../type'

export interface FilterContextValue {
  activeTab: string
  filterItems: OrderFilterItem[]
  columnSetting: {
    [key: string]: ColumnItem[]
  }
  setColumnSetting: (columnSetting: { [key: string]: ColumnItem[] }) => void
  setFilterItems: (filterItems: OrderFilterItem[]) => void
  setActiveTab: (activeTab: string) => void
}

export const FilterContext = React.createContext<FilterContextValue>({
  activeTab: 'ordered',
  filterItems: [],
  columnSetting: {},
  setColumnSetting: () => {},
  setFilterItems: () => {},
  setActiveTab: () => {}
})
