import SearchIcon from '@mui/icons-material/Search'
import { InputAdornment, TextField } from '@mui/material'
import type { TextFieldProps, TextFieldVariants } from '@mui/material/TextField'
import { Controller, useFormContext } from 'react-hook-form'

interface Props extends Omit<TextFieldProps, 'variant'> {
  name: string
  variant?: TextFieldVariants
}

export default function TextFieldInput({ name, ...rest }: Props) {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
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
          size='small'
          id='filled-basic'
          label='Search'
          variant='filled'
          {...rest}
        />
      )}
    />
  )
}
