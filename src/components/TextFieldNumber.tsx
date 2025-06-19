import { Box, BoxProps, IconButton, SxProps, TextField } from '@mui/material'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'

import React from 'react'

interface Props {
  textFieldLabel: string
  handleClose?: () => void
  wrapperProps?: BoxProps
  sxTextFiled: SxProps
}

export default function TextFieldNumber({ textFieldLabel, handleClose, wrapperProps, sxTextFiled }: Props) {
  return (
    <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center' }} {...wrapperProps}>
      <TextField
        sx={{
          ...sxTextFiled,
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
        id='filled-number'
        label={textFieldLabel}
        size='small'
        type='number'
        variant='filled'
      />
      {handleClose && (
        <IconButton onClick={handleClose} aria-label='delete'>
          <RemoveCircleOutlineIcon sx={{ color: 'rgba(0, 0, 0, 0.54)', cursor: 'pointer' }} />
        </IconButton>
      )}
    </Box>
  )
}
