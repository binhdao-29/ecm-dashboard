import { RETURNED } from '@/constants'
import { Box, BoxProps, IconButton, MenuItem, SxProps, TextField } from '@mui/material'
import React from 'react'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'

interface Props {
  textFieldLabel: string
  handleClose?: () => void
  wrapperProps?: BoxProps
  sxTextFiled: SxProps
}

export default function TextFieldSelect({ wrapperProps, sxTextFiled, handleClose, textFieldLabel }: Props) {
  return (
    <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center' }} {...wrapperProps}>
      <TextField
        sx={{
          ...sxTextFiled,
          '& .MuiFilledInput-root:after': {
            borderBottom: '2px solid #4F3CC9'
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#4F3CC9'
          },
          '& .MuiFilledInput-root': {
            borderTopRightRadius: '10px',
            borderTopLeftRadius: '10px',
            paddingRight: '8px'
          }
        }}
        id='filled-select'
        select
        size='small'
        label='Returned'
        variant='filled'
      >
        <MenuItem key='' value={RETURNED.ALL}>
          <span style={{ height: 22 }}></span>
        </MenuItem>
        <MenuItem key='N' value={RETURNED.N}>
          No
        </MenuItem>
        <MenuItem key='Y' value={RETURNED.Y}>
          Yes
        </MenuItem>
      </TextField>
      {handleClose && (
        <IconButton onClick={handleClose} aria-label='delete'>
          <RemoveCircleOutlineIcon sx={{ color: 'rgba(0, 0, 0, 0.54)', cursor: 'pointer' }} />
        </IconButton>
      )}
    </Box>
  )
}
