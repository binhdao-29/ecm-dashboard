import FilterBar from '@/features/orders/components/FilterBar'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'

import { ColumnItem, FilterItem, SaveQuery } from '@/types'
import { useState } from 'react'
import Cancelled from './components/Cancelled'
import Delivered from './components/Delivered'
import Ordered from './components/Ordered'
import { FilterContext } from './context/FilterContext'

const initialColumns: ColumnItem[] = [
  {
    label: 'Date',
    value: 'Date',
    isVisible: false
  },
  {
    label: 'Reference',
    value: 'Reference',
    isVisible: false
  },
  {
    label: 'Customers',
    value: 'Customers',
    isVisible: false
  },
  {
    label: 'Address',
    value: 'Address',
    isVisible: false
  },
  {
    label: 'Nb items',
    value: 'Nb items',
    isVisible: false
  },
  {
    label: 'Total ex taxes',
    value: 'Total ex taxes',
    isVisible: false
  },
  {
    label: 'Delivery fees',
    value: 'Delivery fees',
    isVisible: false
  },
  {
    label: 'Taxes',
    value: 'Taxes',
    isVisible: false
  },
  {
    label: 'Total',
    value: 'Total',
    isVisible: false
  }
]

export const initFilterItems: FilterItem[] = [
  {
    label: 'Customer',
    key: 'customer',
    isChecked: false
  },
  {
    label: 'Passed Since',
    key: 'passed_since',
    isChecked: false
  },
  {
    label: 'Passed Before',
    key: 'passed_before',
    isChecked: false
  },
  {
    label: 'Min amount',
    key: 'min_amount',
    isChecked: false
  },
  {
    label: 'Returned',
    key: 'returned',
    isChecked: false
  }
]

const Orders = () => {
  const [filterItems, setFilterItems] = useState<FilterItem[]>(initFilterItems)
  const [saveQueries, setSaveQueries] = useState<SaveQuery[]>([])
  const [columnSetting, setColumnSetting] = useState<{ [key: string]: ColumnItem[] }>({
    ordered: initialColumns,
    delivered: initialColumns,
    cancelled: initialColumns
  })

  const [activeTab, setActiveTab] = useState<string>('ordered')

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
  }

  return (
    <FilterContext.Provider
      value={{
        activeTab,
        setActiveTab,
        filterItems,
        saveQueries,
        columnSetting,
        setColumnSetting,
        setFilterItems,
        setSaveQueries
      }}
    >
      <Box>
        <FilterBar />
        <TabContext value={activeTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleTabChange}>
              <Tab label='Ordered' value='ordered' />
              <Tab label='Delivered' value='delivered' />
              <Tab label='Cancelled' value='cancelled' />
            </TabList>
          </Box>
          <TabPanel value='ordered'>
            <Ordered />
          </TabPanel>
          <TabPanel value='delivered'>
            <Delivered />
          </TabPanel>
          <TabPanel value='cancelled'>
            <Cancelled />
          </TabPanel>
        </TabContext>
      </Box>
    </FilterContext.Provider>
  )
}

export default Orders
