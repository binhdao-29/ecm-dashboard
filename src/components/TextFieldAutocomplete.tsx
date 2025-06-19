import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { Autocomplete, Box, BoxProps, IconButton, SxProps, TextField } from '@mui/material'
interface Props {
  textFieldLabel: string
  optionSelect?: string[]
  wrapperProps?: BoxProps
  sxAutocomplete?: SxProps
  handleClose?: () => void
}

const mockOptionSelect = [
  {
    value: '',
    label: 'Mduc'
  },
  {
    value: '',
    label: 'MHieu'
  },
  {
    value: '',
    label: 'GBao'
  },
  {
    value: '',
    label: 'XThanh'
  }
]

export default function TextFieldAutoComplete({
  textFieldLabel,
  optionSelect,
  handleClose,
  wrapperProps,
  sxAutocomplete
}: Props) {
  return (
    <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center' }} {...wrapperProps}>
      <Autocomplete
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
        options={mockOptionSelect}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => <TextField {...params} variant='filled' label={textFieldLabel} />}
      />
      {handleClose && (
        <IconButton onClick={handleClose} aria-label='delete'>
          <RemoveCircleOutlineIcon sx={{ color: 'rgba(0, 0, 0, 0.54)', cursor: 'pointer' }} />
        </IconButton>
      )}
    </Box>
  )
}
