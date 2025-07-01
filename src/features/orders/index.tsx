import FilterBar from '@/features/orders/components/FilterBar'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'

import { ColumnItem, FilterItem, FilterParamOrder, SaveQuery } from '@/types'
import { useEffect, useState } from 'react'
import Cancelled from './components/Cancelled'
import Delivered from './components/Delivered'
import { FilterContext } from './context/FilterContext'
import Ordered from './components/Ordered'
import useSearchParam from '@/hooks/useSearchParam'
import { ppid } from 'process'
import { cleanObject } from '@/utils'

const initialColumns: ColumnItem[] = [
  {
    label: 'Customers',
    value: 'customers',
    isVisible: true,
    numeric: false,
    disablePadding: true
  },
  {
    label: 'Date',
    value: 'date',
    isVisible: false,
    numeric: true,
    disablePadding: false
  },
  {
    label: 'Reference',
    value: 'reference',
    isVisible: true,
    numeric: true,
    disablePadding: false
  },

  {
    label: 'Address',
    value: 'address',
    isVisible: false,
    numeric: true,
    disablePadding: false
  },
  {
    label: 'Nb items',
    value: 'nb _items',
    isVisible: false,
    numeric: true,
    disablePadding: false
  },
  {
    label: 'Total ex taxes',
    value: 'total_ex_taxes',
    isVisible: false,
    numeric: true,
    disablePadding: false
  },
  {
    label: 'Delivery fees',
    value: 'delivery_fees',
    isVisible: false,
    numeric: true,
    disablePadding: false
  },
  {
    label: 'Taxes',
    value: 'taxes',
    isVisible: true,
    numeric: true,
    disablePadding: false
  },
  {
    label: 'Total',
    value: 'total',
    isVisible: true,
    numeric: true,
    disablePadding: false
  }
]

const initFilterItems: FilterItem[] = [
  {
    label: 'Customer',
    key: 'customer_id',
    isChecked: false
  },
  {
    label: 'Passed Since',
    key: 'date_gte',
    isChecked: false
  },
  {
    label: 'Passed Before',
    key: 'date_lte',
    isChecked: false
  },
  {
    label: 'Min amount',
    key: 'total_gte',
    isChecked: false
  },
  {
    label: 'Returned',
    key: 'returned',
    isChecked: false
  }
]

const Orders = () => {
  const { queryObject, setMany, deleteParam } = useSearchParam()
  const displayFilter: FilterParamOrder = JSON.parse(queryObject?.displayedFilters ?? '{}')
  const filter = JSON.parse(queryObject.filter ?? '{}')

  const [filterItems, setFilterItems] = useState<FilterItem[]>(
    initFilterItems.map((item) => ({
      ...item,
      isChecked: !!displayFilter[item.key]
    }))
  )

  useEffect(() => {
    const newFilterItem = initFilterItems.map((item) => ({
      ...item,
      isChecked: !!displayFilter[item.key]
    }))
    setFilterItems(newFilterItem)
  }, [JSON.stringify(queryObject)])

  const [saveQueries, setSaveQueries] = useState<SaveQuery[]>([])
  const [columnSetting, setColumnSetting] = useState<{ [key: string]: ColumnItem[] }>({
    ordered: initialColumns,
    delivered: initialColumns,
    cancelled: initialColumns
  })
  const [activeTab, setActiveTab] = useState<string>(filter.status ?? 'ordered')

  useEffect(() => {
    const filterObj = cleanObject(
      filterItems.reduce((acc: FilterItem, filterObj) => {
        return {
          ...acc,
          [filterObj.key]: filterObj.isChecked
        }
      }, {} as FilterItem)
    )

    if (Object.keys(filterObj).length) {
      setMany({
        ...queryObject,
        displayedFilters: JSON.stringify(filterObj)
      })
    } else {
      deleteParam('displayedFilters')
    }
  }, [filterItems])

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
            <TabList variant='fullWidth' onChange={handleTabChange}>
              <Tab label='Ordered' value='ordered' />
              <Tab label='Delivered' value='delivered' />
              <Tab label='Cancelled' value='cancelled' />
            </TabList>
          </Box>
          <TabPanel sx={{ padding: '0px' }} value='ordered'>
            <Ordered />
          </TabPanel>
          <TabPanel sx={{ padding: '0px' }} value='delivered'>
            <Delivered />
          </TabPanel>
          <TabPanel sx={{ padding: '0px' }} value='cancelled'>
            <Cancelled />
          </TabPanel>
        </TabContext>
      </Box>
    </FilterContext.Provider>
  )
}

export default Orders
