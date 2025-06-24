import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchOrdersList,
  fetchOrderDetail,
  updateOrder,
  deleteOrder,
  deleteOrders,
  exportOrdersToExcel,
  fetchOrdersStats
} from '../services'
import { GetOrdersListRequest, GetOrderDetailRequest } from '../types'

export const ordersQueryKeys = {
  all: ['orders'] as const,
  lists: () => [...ordersQueryKeys.all, 'list'] as const,
  list: (params: GetOrdersListRequest) => [...ordersQueryKeys.lists(), params] as const,
  details: () => [...ordersQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...ordersQueryKeys.details(), id] as const,
  stats: (filter?: GetOrdersListRequest['filter']) => [...ordersQueryKeys.all, 'stats', filter] as const
}

export const useOrdersList = (params?: GetOrdersListRequest) => {
  return useQuery(ordersQueryKeys.list(params || {}), () => fetchOrdersList(params), {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000 // 10 minutes
  })
}

export const useOrderDetail = (params: GetOrderDetailRequest) => {
  return useQuery(ordersQueryKeys.detail(params.id), () => fetchOrderDetail(params), {
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    enabled: !!params.id
  })
}

export const useOrdersStats = (filter?: GetOrdersListRequest['filter']) => {
  return useQuery(ordersQueryKeys.stats(filter), () => fetchOrdersStats(filter), {
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000
  })
}

export const useUpdateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation(updateOrder, {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(ordersQueryKeys.lists())
      queryClient.setQueryData(ordersQueryKeys.detail(variables.id), { data: data.data })
      queryClient.invalidateQueries(ordersQueryKeys.all)
    },
    onError: (error) => {
      console.error('Error updating order:', error)
    }
  })
}

export const useDeleteOrder = () => {
  const queryClient = useQueryClient()

  return useMutation(deleteOrder, {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(ordersQueryKeys.lists())
      queryClient.removeQueries(ordersQueryKeys.detail(variables.id))
      queryClient.invalidateQueries(ordersQueryKeys.all)
    },
    onError: (error) => {
      console.error('Error deleting order:', error)
    }
  })
}

export const useDeleteOrders = () => {
  const queryClient = useQueryClient()

  return useMutation(deleteOrders, {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(ordersQueryKeys.lists())
      // Remove specific orders from cache
      variables.forEach((id) => {
        queryClient.removeQueries(ordersQueryKeys.detail(id))
      })
      queryClient.invalidateQueries(ordersQueryKeys.all)
    },
    onError: (error) => {
      console.error('Error deleting orders:', error)
    }
  })
}

export const useExportOrders = () => {
  return useMutation(exportOrdersToExcel, {
    onSuccess: (data) => {
      const link = document.createElement('a')
      link.href = data.url
      link.download = data.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setTimeout(() => {
        URL.revokeObjectURL(data.url)
      }, 100)
    },
    onError: (error) => {
      console.error('Error exporting orders:', error)
    }
  })
}

export const useOrdersActions = () => {
  const updateMutation = useUpdateOrder()
  const deleteMutation = useDeleteOrder()
  const deleteManyMutation = useDeleteOrders()
  const exportMutation = useExportOrders()

  return {
    updateOrder: updateMutation.mutate,
    deleteOrder: deleteMutation.mutate,
    deleteOrders: deleteManyMutation.mutate,
    exportOrders: exportMutation.mutate,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
    isDeletingMany: deleteManyMutation.isLoading,
    isExporting: exportMutation.isLoading,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    deleteManyError: deleteManyMutation.error,
    exportError: exportMutation.error
  }
}

export const usePrefetchOrder = () => {
  const queryClient = useQueryClient()

  return (id: number) => {
    queryClient.prefetchQuery(ordersQueryKeys.detail(id), () => fetchOrderDetail({ id }), {
      staleTime: 5 * 60 * 1000
    })
  }
}
