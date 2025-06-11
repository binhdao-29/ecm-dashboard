import { Box, Typography, TypographyProps, TypographyTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'

interface Props extends TypographyProps {
  line?: number
}
export default function TextLineClamp({ line = 3, children, ...res }: Props) {
  return (
    <Typography
      {...res}
      sx={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: line,
        WebkitBoxOrient: 'vertical'
      }}
    >
      {children}
    </Typography>
  )
}
