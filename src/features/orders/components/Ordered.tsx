import CustomTable from '@/components/CustomTable'
import React, { useContext } from 'react'
import { FilterContext } from '../context/FilterContext'

export default function Ordered() {
  const { columnSetting, activeTab } = useContext(FilterContext)

  return <CustomTable size='medium' dataColumn={columnSetting[activeTab]} />
}
