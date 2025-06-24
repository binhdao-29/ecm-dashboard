import { baseDataProvider } from '@/services/dataProvider'

export const fetchPosts = async () => {
  const response = await baseDataProvider.getList('orders', {
    pagination: { page: 1, perPage: 10 },
    sort: { field: 'id', order: 'ASC' },
    filter: {}
  })

  return response.data
}
