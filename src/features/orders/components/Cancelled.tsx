import { useContext } from 'react'
import { FilterContext } from '../context/FilterContext'
import CustomTable from '@/components/CustomTable'

const Cancelled = () => {
  const { columnSetting, activeTab } = useContext(FilterContext)

  return <CustomTable size='medium' dataColumn={columnSetting[activeTab]} />
}

export default Cancelled
