import AddFilter from '@/components/AddFilter'
import CustomDatePicker from '@/components/CustomDatePicker'
import SettingColumns from '@/components/SettingColumns'
import TextFieldAutoComplete from '@/components/TextFieldAutocomplete'
import TextFieldInput from '@/components/TextFieldInput'
import TextFieldNumber from '@/components/TextFieldNumber'
import TextFieldSelect from '@/components/TextFieldSelect'
import { RETURNED } from '@/constants'
import { FilterContext } from '@/features/orders/context/FilterContext'
import { useSearchParam } from '@/hooks/useSearchParam'
import { ColumnItem, QuerySaveType, SelectOptionItem } from '@/types'
import { cleanObject, isoStringToDate } from '@/utils'
import { getListParamsFormLS, getOrderSaveQueryFormLS, saveListParamsToLS, setOrderSaveQueryToLS } from '@/utils/orders'
import { yupResolver } from '@hookform/resolvers/yup'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, InputAdornment, styled } from '@mui/material'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import { useContext, useEffect, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { schema } from '../schemas'
import { OrderFilterItem, OrderParams, OrderUrlQuery } from '../type'

const optionReturned: SelectOptionItem[] = [
  {
    label: 'Yes',
    value: RETURNED.Y
  },
  {
    label: 'No',
    value: RETURNED.N
  }
]

const FilterBarWrapper = styled('div')({
  display: 'flex',
  alignItems: 'end',
  justifyContent: 'space-between'
})

const FilterBar = () => {
  const { filterItems, columnSetting, activeTab, setFilterItems, setColumnSetting } = useContext(FilterContext)
  const { setMany } = useSearchParam()
  const [isFirstRender, setIsFirstRender] = useState(true)
  const currentListParamsLS = getListParamsFormLS()
  const currentSaveQueriesLS = getOrderSaveQueryFormLS()
  const [currentSaveQueries, setCurrentSaveQueries] = useState<QuerySaveType[]>(currentSaveQueriesLS)

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      returned: '',
      q: ''
    }
  })

  const customerId = useWatch({ name: 'customer_id', control: methods.control })
  const returned = useWatch({ name: 'returned', control: methods.control })
  const minAmount = useWatch({ name: 'total_gte', control: methods.control })
  const passedBefore = useWatch({ name: 'date_lte', control: methods.control })
  const passedSince = useWatch({ name: 'date_gte', control: methods.control })
  const q = useWatch({ name: 'q', control: methods.control })

  useEffect(() => {
    methods.reset({
      ...currentListParamsLS.filter,
      date_gte: isoStringToDate(currentListParamsLS.filter.date_gte),
      date_lte: isoStringToDate(currentListParamsLS.filter.date_lte)
    })
  }, [JSON.stringify(currentListParamsLS.filter)])

  useEffect(() => {
    setOrderSaveQueryToLS(currentSaveQueries)
  }, [JSON.stringify(currentSaveQueries)])

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)
      return
    }

    const newFilter = cleanObject({
      q: q,
      returned: returned,
      total_gte: minAmount,
      date_lte: passedBefore ? passedBefore.toISOString() : '',
      date_gte: passedSince ? passedSince.toISOString() : '',
      customer_id: customerId,
      status: activeTab
    })

    saveListParamsToLS({
      displayedFilters: currentListParamsLS.displayedFilters,
      filter: newFilter
    })

    const currentFilterForm = cloneDeep(newFilter)
    const currentFilterLS = cloneDeep(currentListParamsLS.filter)

    if (!isEqual(currentFilterLS, currentFilterForm)) {
      setMany({
        displayedFilters: JSON.stringify(currentListParamsLS.displayedFilters),
        filter: JSON.stringify(newFilter)
      })
    }
  }, [q, customerId, returned, minAmount, passedBefore, passedSince, activeTab])

  const handleAddSaveQuery = (value: QuerySaveType[]) => {
    setCurrentSaveQueries(value)
  }

  const handleRemoveCurrentSaveQuery = (id: number) => {
    const newUseQuery = currentSaveQueries.filter((query) => query.id != id)
    setCurrentSaveQueries(newUseQuery)
  }

  const handleChangeColumn = (columns: ColumnItem[]) => {
    const value = {
      ...columnSetting,
      [activeTab]: columns
    }
    setColumnSetting(value)
  }

  const setParamUrlAndLS = (filterItem: OrderFilterItem[]) => {
    const newDisplayedFilters = cleanObject(
      filterItem.reduce((acc, curr) => {
        if (!curr.isChecked) {
          delete currentListParamsLS.filter[curr.key]
        }
        return { ...acc, [curr.key]: curr.isChecked }
      }, {})
    )

    saveListParamsToLS({
      displayedFilters: newDisplayedFilters,
      filter: currentListParamsLS.filter
    })

    setMany({
      displayedFilters: JSON.stringify(newDisplayedFilters),
      filter: JSON.stringify({ ...currentListParamsLS.filter })
    })
  }

  const handleAddFilterItem = (newFilterItems: OrderFilterItem[]) => {
    setFilterItems(newFilterItems)
    const newDisplayedFilters = newFilterItems
      .filter((item) => item.isChecked)
      .reduce((acc, curr) => {
        return { ...acc, [curr.key]: curr.isChecked }
      }, {})

    saveListParamsToLS({
      displayedFilters: newDisplayedFilters,
      filter: currentListParamsLS.filter
    })

    setMany({
      displayedFilters: JSON.stringify(newDisplayedFilters),
      filter: JSON.stringify({ ...currentListParamsLS.filter })
    })
  }

  const handleRemoveFilterItem = (key: string) => () => {
    const indexOfFilterItems = filterItems.findIndex((item) => item.key === key)
    filterItems[indexOfFilterItems].isChecked = false
    setFilterItems([...filterItems])

    setParamUrlAndLS(filterItems)
  }

  const handleRemoveAllFilterItem = (newFilterItems: OrderFilterItem[]) => {
    setFilterItems(newFilterItems)

    setParamUrlAndLS(newFilterItems)
  }

  const handleUseQueryFromLS = (param: OrderUrlQuery) => {
    const newFilterItems = filterItems.map((item) => ({
      ...item,
      isChecked: !!param.displayedFilters[item.key]
    }))
    setFilterItems(newFilterItems)

    saveListParamsToLS({
      displayedFilters: param.displayedFilters,
      filter: param.filter
    })
  }

  return (
    <FilterBarWrapper>
      <FormProvider {...methods}>
        <Box sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <TextFieldInput
            name='q'
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position='end'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }
            }}
          />

          {filterItems[0].isChecked && (
            <TextFieldAutoComplete
              label='Customer'
              name='customer_id'
              options={[
                {
                  label: 'Minh duc',
                  value: '1'
                },
                {
                  label: 'ReactJS',
                  value: '2'
                }
              ]}
              handleClose={handleRemoveFilterItem('customer_id')}
              sxAutocomplete={{ width: '203px' }}
            />
          )}
          {filterItems[1].isChecked && (
            <CustomDatePicker
              name='date_gte'
              datePickerLabel='Passed Since'
              sxDatePicker={{ width: '169px' }}
              handleClose={handleRemoveFilterItem('date_gte')}
            />
          )}
          {filterItems[2].isChecked && (
            <CustomDatePicker
              name='date_lte'
              datePickerLabel='Passed Before'
              sxDatePicker={{ width: '169px' }}
              handleClose={handleRemoveFilterItem('date_lte')}
            />
          )}
          {filterItems[3].isChecked && (
            <TextFieldNumber
              label='Min amount'
              name='total_gte'
              sxTextFiled={{ width: '194px' }}
              handleClose={handleRemoveFilterItem('total_gte')}
            />
          )}
          {filterItems[4].isChecked && (
            <TextFieldSelect
              options={optionReturned}
              name='returned'
              textFieldLabel='Returned'
              handleClose={handleRemoveFilterItem('returned')}
              sxTextFiled={{ width: '164px' }}
            />
          )}
        </Box>
      </FormProvider>

      <Box sx={{ display: 'flex', alignContent: 'center', gap: '8px', color: '#4F3CC9', flexShrink: 0 }}>
        <AddFilter<OrderParams>
          queryObject={currentListParamsLS}
          filterItems={filterItems}
          currentSaveQueries={currentSaveQueries}
          handleUseQueryFromLS={handleUseQueryFromLS}
          handleAddFilterItem={handleAddFilterItem}
          handleRemoveAllFilterItem={handleRemoveAllFilterItem}
          handleAddSaveQuery={handleAddSaveQuery}
          handleRemoveSaveQuery={handleRemoveCurrentSaveQuery}
        />
        <SettingColumns columns={columnSetting[activeTab]} handleChangeColumn={handleChangeColumn} />
        <Button startIcon={<FileDownloadIcon />} sx={{ color: '#4F3CC9', bgcolor: 'transparent' }} variant='text'>
          EXPORT
        </Button>
      </Box>
    </FilterBarWrapper>
  )
}

export default FilterBar
