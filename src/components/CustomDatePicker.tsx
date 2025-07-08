import { IconButton, SxProps, TextField } from '@mui/material'
import { Box, BoxProps } from '@mui/system'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { Controller, useFormContext } from 'react-hook-form'

interface Props {
  name: string
  datePickerLabel: string
  sxDatePicker?: SxProps
  wrapperProps?: BoxProps
  handleClose?: () => void
}

export default function CustomDatePicker({ datePickerLabel, sxDatePicker, handleClose, wrapperProps, name }: Props) {
  const {
    control,
    formState: { errors }
  } = useFormContext()
  return (
    <Box
      sx={{
        ...wrapperProps,
        display: 'flex',
        gap: '2px',
        alignItems: 'center',
        '& .MuiOutlinedInput-root': {
          borderRadius: '16px',
          backgroundColor: '#f5f5f5'
        },
        '& .MuiInputLabel-root': {
          color: '#555'
        }
      }}
    >
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          return (
            <DatePicker
              {...field}
              value={field.value || null}
              label={datePickerLabel}
              format='dd/MM/yyyy'
              enableAccessibleFieldDOMStructure={false}
              slots={{ textField: TextField }}
              slotProps={{
                textField: {
                  placeholder: 'dd/mm/yyyy',
                  fullWidth: true,
                  variant: 'filled',
                  size: 'small',
                  sx: {
                    '& .MuiFilledInput-root:after': {
                      borderBottom: '2px solid #4F3CC9'
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#4F3CC9'
                    },
                    ...sxDatePicker,
                    '& .MuiFilledInput-root': {
                      borderTopRightRadius: '10px',
                      borderTopLeftRadius: '10px',
                      paddingRight: '16px'
                    }
                  },
                  error: !!errors[name],
                  helperText: (errors[name]?.message as string) || ''
                }
              }}
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
