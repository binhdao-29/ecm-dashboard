import { SelectOptionItem } from '@/types'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { Autocomplete, Box, BoxProps, IconButton, SxProps, TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

interface Props {
  label: string
  name: string
  options: SelectOptionItem[]
  wrapperProps?: BoxProps
  sxAutocomplete?: SxProps
  handleClose?: () => void
}

export default function TextFieldAutoComplete({
  name,
  label,
  options,
  handleClose,
  wrapperProps,
  sxAutocomplete
}: Props) {
  const {
    control,
    formState: { errors }
  } = useFormContext()

  return (
    <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center' }} {...wrapperProps}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const { onChange, value, ref } = field
          const selectedOption = options.find((opt) => opt.value === value) || null

          return (
            <Autocomplete
              value={selectedOption}
              onChange={(_, newValue) => {
                onChange(newValue?.value || '')
              }}
              options={options}
              getOptionLabel={(option) => option.label || ''}
              isOptionEqualToValue={(option, val) => option.value === val?.value}
              sx={{
                ...sxAutocomplete,
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
              id='size-small-filled'
              size='small'
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='filled'
                  label={label}
                  error={!!errors[name]}
                  helperText={(errors[name]?.message as string) || ''}
                  inputRef={ref}
                />
              )}
            />
          )
        }}
      />
      {handleClose && (
        <IconButton onClick={handleClose} aria-label='delete'>
          <RemoveCircleOutlineIcon sx={{ color: 'rgba(0, 0, 0, 0.54)', cursor: 'pointer' }} />
        </IconButton>
      )}
    </Box>
  )
}
