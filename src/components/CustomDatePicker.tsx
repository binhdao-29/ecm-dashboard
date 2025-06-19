import { IconButton, SxProps, TextField } from '@mui/material'
import { Box, BoxProps } from '@mui/system'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'

interface Props {
  sxDatePicker?: SxProps
  DatePickerLabel: string
  handleClose?: () => void
  wrapperProps?: BoxProps
}

export default function CustomDatePicker({ DatePickerLabel, sxDatePicker, handleClose, wrapperProps }: Props) {
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
      <DatePicker
        label={DatePickerLabel}
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
            }
          }
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
