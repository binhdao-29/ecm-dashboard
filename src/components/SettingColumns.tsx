import { FilterContext } from '@/features/orders/context/FilterContext'
import { ColumnItem } from '@/types'
import ViewWeekIcon from '@mui/icons-material/ViewWeek'
import { Box, Button, Popover, Switch, Typography } from '@mui/material'
import React, { useContext } from 'react'
import cloneDeep from 'lodash/cloneDeep'

interface Props {
  columns: ColumnItem[]
  handleChangeColumn: (columns: ColumnItem[]) => void
}

export default function SettingColumns({ columns, handleChangeColumn }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const handleChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColumns = cloneDeep(columns)
    newColumns[index].isVisible = e.target.checked

    handleChangeColumn(newColumns)
  }

  return (
    <div>
      <Button
        startIcon={<ViewWeekIcon />}
        sx={{ color: '#4F3CC9', bgcolor: 'transparent' }}
        variant='text'
        onClick={handleClick}
      >
        COLUMNS
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
        <Box sx={{ paddingBlock: '8px', minWidth: '165px' }}>
          {columns.map((item, index) => {
            return (
              <Box key={index} sx={{ display: 'flex', paddingInline: '8px', margin: 0 }}>
                <Switch
                  checked={item.isVisible}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#4F3CC9',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#4F3CC9'
                      }
                    }
                  }}
                  size='small'
                  onChange={handleChange(index)}
                />
                <Typography>{item.label}</Typography>
              </Box>
            )
          })}
        </Box>
      </Popover>
    </div>
  )
}
