import { Typography, TypographyProps } from '@mui/material'

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
