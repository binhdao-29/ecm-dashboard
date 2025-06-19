import { ColumnItem, FilterItem, SaveQuery } from '@/types'
import * as React from 'react'

export interface FilterContextValue {
  activeTab: string
  filterItems: FilterItem[]
  saveQueries?: SaveQuery[]
  columnSetting: {
    [key: string]: ColumnItem[]
  }
  setColumnSetting: (columnSetting: { [key: string]: ColumnItem[] }) => void
  setFilterItems: (filterItems: FilterItem[]) => void
  setSaveQueries: (saveQueries: SaveQuery[]) => void
  setActiveTab: (activeTab: string) => void
}

export const FilterContext = React.createContext<FilterContextValue>({
  activeTab: 'ordered',
  filterItems: [],
  saveQueries: [],
  columnSetting: {},
  setColumnSetting: () => {},
  setFilterItems: () => {},
  setSaveQueries: () => {},
  setActiveTab: () => {}
})
