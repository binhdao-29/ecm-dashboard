import useSearchParam from '@/hooks/useSearchParam'
import { FilterItem, LSType, SaveQuery } from '@/types'
import { deleteOrderQueryFormLS, getOrderQueryFormLS, saveOrderQueryToLS } from '@/utils/orders'
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd'
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import CloseIcon from '@mui/icons-material/Close'
import FilterListIcon from '@mui/icons-material/FilterList'
import isEqual from 'lodash/isEqual'
import {
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  TextField
} from '@mui/material'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { cloneDeep } from 'lodash'
import * as React from 'react'
import { data, useParams } from 'react-router'

interface Props {
  filterItems: FilterItem[]
  saveQueries?: SaveQuery[]
  setFilterItems: (filterItems: FilterItem[]) => void
  setSaveQueries: (saveQueries: SaveQuery[]) => void
}

export default function AddFilter({ filterItems, saveQueries = [], setFilterItems, setSaveQueries }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [openRemoveDialog, setOpenRemoveDialog] = React.useState(false)
  const [saveName, setSaveName] = React.useState('')
  const [removeId, setRemoveId] = React.useState(0)
  const currentQuery: LSType[] = getOrderQueryFormLS()

  const { queryObject } = useSearchParam()
  const { setMany } = useSearchParam()

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
    const newFilterItem = filterItems.map((item) => {
      return {
        ...item,
        isChecked: false
      }
    })
    setFilterItems(newFilterItem)
  }

  const handleClickOpen = () => {
    setSaveName('')
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleSave = () => {
    if (!saveName) {
      setOpenDialog(false)
      return
    }
    const newSaveQuery: LSType[] = [
      ...currentQuery,
      {
        name: saveName,
        value: queryObject,
        id: new Date().getTime()
      }
    ]
    saveOrderQueryToLS(newSaveQuery)
    setOpenDialog(false)
  }

  const handleClickOpenRemoveDialog = (id: number) => {
    setOpenRemoveDialog(true)
    setRemoveId(id)
  }

  const handleCloseRemoveDialog = () => {
    setOpenRemoveDialog(false)
    deleteOrderQueryFormLS(removeId)
  }

  const isQueryObj = currentQuery.find((data) => isEqual(data.value, queryObject))

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

          {currentQuery.map((data) =>
            isEqual(data.value, queryObject) ? (
              <Box
                key={data.id}
                sx={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  paddingBlock: '6px',
                  paddingInline: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
                onClick={() => handleClickOpenRemoveDialog(data.id)}
              >
                <BookmarkRemoveIcon sx={{ color: 'rgba(0, 0, 0, 0.54)', width: '20px' }} />
                <Typography>{`Remove query "${data.name}"`}</Typography>
              </Box>
            ) : (
              <Box
                onClick={() => {
                  setMany({
                    filter: data.value.filter,
                    displayedFilters: data.value.displayedFilters
                  })
                }}
                key={data.id}
                sx={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  paddingBlock: '6px',
                  paddingInline: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <BookmarkBorderIcon sx={{ color: 'rgba(0, 0, 0, 0.54)', width: '20px' }} />
                <Typography>{data.name}</Typography>
              </Box>
            )
          )}

          {/* save query */}
          {isQueryObj ? (
            ''
          ) : (
            <Box
              onClick={handleClickOpen}
              sx={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                paddingBlock: '6px',
                paddingInline: 2,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <BookmarkAddIcon sx={{ color: 'rgba(0, 0, 0, 0.54)', width: '20px' }} />
              <Typography>Save current query</Typography>
            </Box>
          )}

          {/* <Box
            sx={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              paddingBlock: '6px',
              paddingInline: 2,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <BookmarkAddIcon sx={{ color: 'rgba(0, 0, 0, 0.54)', width: '20px' }} />
            <Typography onClick={handleClickOpen}>Save current query</Typography>
          </Box> */}

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

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Save current query as</DialogTitle>

        <DialogContent>
          <TextField
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            label='Query name'
            type='search'
            variant='filled'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>CANCEL</Button>
          <Button onClick={handleSave} autoFocus>
            SAVE
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openRemoveDialog} onClose={handleCloseRemoveDialog}>
        <DialogTitle>{'Remove saved query?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to remove that item from your list of saved queries?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRemoveDialog(false)}>CANCEL</Button>
          <Button onClick={handleCloseRemoveDialog} autoFocus>
            CONFIRM
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
