import { FILTER_TYPE } from '@/constants'
import { FilterContext } from '@/features/orders/context/FilterContext'
import { ColumnItem, FilterItem } from '@/types'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, InputAdornment, styled, TextField } from '@mui/material'
import { useContext } from 'react'
import AddFilter from '../../../components/AddFilter'
import SettingColumns from '../../../components/SettingColumns'
import TextFieldAutoComplete from '@/components/TextFieldAutocomplete'
import TextFieldNumber from '@/components/TextFieldNumber'
import TextFieldSelect from '@/components/TextFieldSelect'
import CustomDatePicker from '@/components/CustomDatePicker'

const FilterBarWrapper = styled('div')({
  display: 'flex',
  alignItems: 'end',
  justifyContent: 'space-between'
})

const FilterBar = () => {
  const { saveQueries, columnSetting, filterItems, activeTab, setSaveQueries, setFilterItems, setColumnSetting } =
    useContext(FilterContext)

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
      <Box sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <TextField
          sx={{
            width: '236px',
            '& .MuiFilledInput-root': {
              borderTopRightRadius: '10px',
              borderTopLeftRadius: '10px',
              paddingRight: '8px'
            },
            '& .MuiFilledInput-root:after': {
              borderBottom: '2px solid #4F3CC9'
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#4F3CC9'
            }
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position='end'>
                  <SearchIcon />
                </InputAdornment>
              )
            }
          }}
          size='small'
          id='filled-basic'
          label='Search'
          variant='filled'
        />

        {filterItems[0].isChecked && (
          <TextFieldAutoComplete
            textFieldLabel={'Customer'}
            handleClose={handleRemoveFilterItem('customer')}
            sxAutocomplete={{ width: '203px' }}
          />
        )}
        {filterItems[1].isChecked && (
          <CustomDatePicker
            DatePickerLabel='Passed Since'
            sxDatePicker={{ width: '169px' }}
            handleClose={handleRemoveFilterItem('passed_since')}
          />
        )}
        {filterItems[2].isChecked && (
          <CustomDatePicker
            DatePickerLabel='Passed Before'
            sxDatePicker={{ width: '169px' }}
            handleClose={handleRemoveFilterItem('passed_before')}
          />
        )}
        {filterItems[3].isChecked && (
          <TextFieldNumber
            textFieldLabel='Min amount'
            sxTextFiled={{ width: '194px' }}
            handleClose={handleRemoveFilterItem('min_amount')}
          />
        )}
        {filterItems[4].isChecked && (
          <TextFieldSelect
            textFieldLabel='Returned'
            handleClose={handleRemoveFilterItem('returned')}
            sxTextFiled={{ width: '164px' }}
          />
        )}
      </Box>

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
