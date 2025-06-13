import { Box, Typography } from '@mui/material'
import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const data = [
  { date: '11/5/2025', total: 620 },
  { date: '13/5/2025', total: 250 },
  { date: '15/5/2025', total: 560 },
  { date: '17/5/2025', total: 0 },
  { date: '20/5/2025', total: 310 },
  { date: '23/5/2025', total: 0 },
  { date: '26/5/2025', total: 145.69 },
  { date: '29/5/2025', total: 790 },
  { date: '1/6/2025', total: 0 },
  { date: '3/6/2025', total: 260 },
  { date: '5/6/2025', total: 410 }
]

const currencyFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0
})

export default function LineChartDashboard() {
  return (
    <Box sx={{ padding: '16px', borderRadius: '10px', border: '1px solid rgb(224, 224, 227)' }}>
      <Typography sx={{ fontSize: '24px', marginBottom: '32px' }}>30 Day Revenue History</Typography>
      <AreaChart width={532} height={300} data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='date' />
        <YAxis tickFormatter={(value) => currencyFormatter.format(value)} />
        <Tooltip
          formatter={(value: number) => [`${value.toLocaleString('en-US', { minimumFractionDigits: 2 })} US$`, 'total']}
          labelFormatter={(label) => `${label}`}
        />
        <Area type='monotone' dataKey='total' stroke='#8884d8' fill='#8884d8' fillOpacity={0.1} />
      </AreaChart>
    </Box>
  )
}
