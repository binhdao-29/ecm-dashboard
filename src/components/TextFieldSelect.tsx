import { RETURNED } from '@/constants'
import { Box, BoxProps, IconButton, MenuItem, SxProps, TextField } from '@mui/material'
import React from 'react'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { Controller, useFormContext } from 'react-hook-form'
import { SelectOptionItem } from '@/types'

interface Props {
  name: string
  textFieldLabel: string
  sxTextFiled: SxProps
  options: SelectOptionItem[]
  hasAllItem?: boolean
  wrapperProps?: BoxProps
  handleClose?: () => void
}

export default function TextFieldSelect({
  wrapperProps,
  sxTextFiled,
  handleClose,
  textFieldLabel,
  options,
  name,
  hasAllItem = true
}: Props) {
  const { control } = useFormContext()

  return (
    <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center' }} {...wrapperProps}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <TextField
            {...field}
            value={field.value || ''}
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
            label={textFieldLabel}
            variant='filled'
          >
            {hasAllItem && (
              <MenuItem key='' value={RETURNED.ALL}>
                <span style={{ height: 22 }}></span>
              </MenuItem>
            )}
            {options.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      {handleClose && (
        <IconButton onClick={handleClose} aria-label='delete'>
          <RemoveCircleOutlineIcon sx={{ color: 'rgba(0, 0, 0, 0.54)', cursor: 'pointer' }} />
        </IconButton>
      )}
    </Box>
  )
}
