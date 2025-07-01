import AddFilter from '@/components/AddFilter'
import CustomDatePicker from '@/components/CustomDatePicker'
import SettingColumns from '@/components/SettingColumns'
import TextFieldAutoComplete from '@/components/TextFieldAutocomplete'
import TextFieldInput from '@/components/TextFieldInput'
import TextFieldNumber from '@/components/TextFieldNumber'
import TextFieldSelect from '@/components/TextFieldSelect'
import { RETURNED } from '@/constants'
import { FilterContext } from '@/features/orders/context/FilterContext'
import useSearchParam from '@/hooks/useSearchParam'
import { ColumnItem, SelectOptionItem } from '@/types'
import { yupResolver } from '@hookform/resolvers/yup'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, InputAdornment, styled } from '@mui/material'
import { useContext, useEffect } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { schema } from '../schemas'
import { cleanObject } from '@/utils'

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
  const { saveQueries, columnSetting, filterItems, activeTab, setSaveQueries, setFilterItems, setColumnSetting } =
    useContext(FilterContext)

  const { queryObject, deleteParam, setMany } = useSearchParam()

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const { reset } = methods

  const customerId = useWatch({ name: 'customer_id', control: methods.control })
  const returned = useWatch({ name: 'returned', control: methods.control })
  const minAmount = useWatch({ name: 'total_gte', control: methods.control })
  const passedBefore = useWatch({ name: 'date_lte', control: methods.control })
  const passedSince = useWatch({ name: 'date_gte', control: methods.control })
  const q = useWatch({ name: 'q', control: methods.control })

  // useEffect(() => {
  //   reset({
  //     customer_id: queryObject.customer_id,
  //     returned: queryObject.returned,
  //     total_gte: Number(queryObject.total_gte),
  //     date_lte: JSON.parse(queryObject.date_lte)
  //   })
  // })

  console.log(queryObject.date_lte)

  useEffect(() => {
    const newParams = cleanObject({
      q: q,
      returned: returned,
      total_gte: minAmount,
      date_lte: passedBefore ? passedBefore.toISOString() : '',
      date_gte: passedSince ? passedSince.toISOString() : '',
      customer_id: customerId,
      status: activeTab
    })

    if (Object.keys(newParams).length) {
      setMany({
        ...queryObject,
        filter: JSON.stringify(newParams)
      })
    } else {
      deleteParam('filter')
    }
  }, [q, customerId, returned, minAmount, passedBefore, passedSince, activeTab])

  const handleChangeColumn = (columns: ColumnItem[]) => {
    const value = {
      ...columnSetting,
      [activeTab]: columns
    }
    setColumnSetting(value)
  }

  const handleRemoveFilterItem = (key: string) => () => {
    const indexOfFilterItems = filterItems.findIndex((item) => item.key === key)
    filterItems[indexOfFilterItems].isChecked = false
    setFilterItems([...filterItems])
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
        <AddFilter
          filterItems={filterItems}
          saveQueries={saveQueries}
          setFilterItems={setFilterItems}
          setSaveQueries={setSaveQueries}
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
