import * as React from 'react'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import FilterListIcon from '@mui/icons-material/FilterList'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import CloseIcon from '@mui/icons-material/Close'
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd'
import { FilterItem, FilterQuery, SaveQuery } from '@/types'
import { Box, Checkbox, FormControlLabel } from '@mui/material'
import { cloneDeep } from 'lodash'
import { initFilterItems } from '@/features/orders'

interface Props {
  filterItems: FilterItem[]
  saveQueries?: SaveQuery[]
  setFilterItems: (filterItems: FilterItem[]) => void
  setSaveQueries: (saveQueries: SaveQuery[]) => void
}

export default function AddFilter({ filterItems, saveQueries = [], setFilterItems, setSaveQueries }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleCheckBox = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const cloneFilterItem = cloneDeep(filterItems)

    cloneFilterItem[idx].isChecked = e.target.checked
    const updateFilterItem: FilterItem[] = [...cloneFilterItem]
    setFilterItems(updateFilterItem)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const handleRemoveAll = () => {
    setFilterItems(initFilterItems)
  }

  return (
    <div>
      <Button
        startIcon={<FilterListIcon />}
        sx={{ color: '#4F3CC9', bgcolor: 'transparent' }}
        variant='text'
        onClick={handleClick}
      >
        ADD FILTERS
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '10px'
            }
          }
        }}
      >
        <Box sx={{ paddingBlock: '8px', display: 'flex', flexDirection: 'column' }}>
          {filterItems?.map((item, idx) => (
            <FormControlLabel
              key={item.label}
              sx={{
                minWidth: '215px',
                margin: 0,
                paddingInline: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
              control={
                <Checkbox
                  onChange={handleCheckBox(idx)}
                  checked={item.isChecked}
                  sx={{
                    mr: '16px',
                    width: '20px',
                    color: 'rgba(0, 0, 0, 0.54)',
                    '&.Mui-checked': {
                      color: 'rgba(0, 0, 0, 0.54)'
                    },
                    '&:hover': {
                      backgroundColor: 'transparent'
                    }
                  }}
                />
              }
              label={item.label}
            />
          ))}

          <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.12)', marginBlock: '8px', height: '1px', p: '0px' }}></Box>

          {saveQueries.map((saveQuery) => (
            <Box
              key={saveQuery.name}
              sx={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                paddingBlock: '6px',
                paddingInline: 2,
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <BookmarkBorderIcon sx={{ color: 'rgba(0, 0, 0, 0.54)', width: '20px' }} />
              <Typography>{saveQuery.name}</Typography>
            </Box>
          ))}

          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              paddingBlock: '6px',
              paddingInline: 2,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <BookmarkAddIcon sx={{ color: 'rgba(0, 0, 0, 0.54)', width: '20px' }} />
            <Typography>Save current query</Typography>
          </Box>

          <Box
            onClick={handleRemoveAll}
            sx={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              paddingBlock: '6px',
              paddingInline: 2,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)'
              },
              cursor: 'pointer'
            }}
          >
            <CloseIcon sx={{ color: 'rgba(0, 0, 0, 0.54)', width: '20px' }} />
            <Typography>Remove all filters</Typography>
          </Box>
        </Box>
      </Popover>
    </div>
  )
}
