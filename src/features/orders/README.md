# Orders Feature

Thư mục này chứa toàn bộ logic xử lý orders trong ứng dụng, bao gồm services, hooks, và types.

## Cấu trúc thư mục

```
src/features/orders/
├── types/
│   └── index.ts          # Định nghĩa interfaces và types
├── services/
│   └── index.ts          # Logic xử lý API calls
├── hooks/
│   └── index.ts          # TanStack Query hooks
└── README.md             # Hướng dẫn sử dụng
```

## Các chức năng chính

### 1. Lấy danh sách orders

```typescript
import { useOrdersList } from '@/features/orders/hooks'

const Component = () => {
  const { data, isLoading, error } = useOrdersList({
    pagination: { page: 1, perPage: 10 },
    sort: { field: 'date', order: 'DESC' },
    filter: { status: 'delivered' }
  })

  return (
    // JSX
  )
}
```

### 2. Lấy chi tiết order

```typescript
import { useOrderDetail } from '@/features/orders/hooks'

const OrderDetail = ({ orderId }: { orderId: number }) => {
  const { data, isLoading, error } = useOrderDetail({ id: orderId })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h1>Order #{data?.data.reference}</h1>
      <p>Total: ${data?.data.total}</p>
      {/* More order details */}
    </div>
  )
}
```

### 3. Cập nhật order

```typescript
import { useOrdersActions } from '@/features/orders/hooks'

const OrderEditForm = ({ orderId }: { orderId: number }) => {
  const { updateOrder, isUpdating } = useOrdersActions()

  const handleSubmit = (formData: any) => {
    updateOrder({
      id: orderId,
      data: {
        status: 'delivered',
        returned: false
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isUpdating}>
        {isUpdating ? 'Updating...' : 'Update Order'}
      </button>
    </form>
  )
}
```

### 4. Xóa order

```typescript
import { useOrdersActions } from '@/features/orders/hooks'

const OrderActions = ({ orderId }: { orderId: number }) => {
  const { deleteOrder, isDeleting } = useOrdersActions()

  const handleDelete = () => {
    if (confirm('Bạn có chắc muốn xóa order này?')) {
      deleteOrder({ id: orderId })
    }
  }

  return (
    <button onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}
```

### 5. Xóa nhiều orders

```typescript
import { useOrdersActions } from '@/features/orders/hooks'

const OrdersList = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const { deleteOrders, isDeletingMany } = useOrdersActions()

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      deleteOrders(selectedIds)
      setSelectedIds([])
    }
  }

  return (
    <div>
      {/* Orders list with checkboxes */}
      <button onClick={handleBulkDelete} disabled={isDeletingMany}>
        {isDeletingMany ? 'Deleting...' : `Delete ${selectedIds.length} orders`}
      </button>
    </div>
  )
}
```

### 6. Export orders ra Excel/CSV

```typescript
import { useOrdersActions } from '@/features/orders/hooks'

const ExportButton = () => {
  const { exportOrders, isExporting } = useOrdersActions()

  const handleExport = () => {
    exportOrders({
      filter: { status: 'delivered' },
      format: 'xlsx'
    })
  }

  return (
    <button onClick={handleExport} disabled={isExporting}>
      {isExporting ? 'Exporting...' : 'Export to Excel'}
    </button>
  )
}
```

### 7. Lấy thống kê orders

```typescript
import { useOrdersStats } from '@/features/orders/hooks'

const OrdersStats = () => {
  const { data: stats, isLoading } = useOrdersStats({
    date_gte: '2024-01-01',
    status: 'delivered'
  })

  if (isLoading) return <div>Loading stats...</div>

  return (
    <div>
      <p>Total Orders: {stats?.totalOrders}</p>
      <p>Total Revenue: ${stats?.totalRevenue}</p>
      <p>Average Order Value: ${stats?.averageOrderValue}</p>
      <p>Returned Orders: {stats?.returnedOrders}</p>
    </div>
  )
}
```

## Sử dụng Services trực tiếp

Sử dụng services mà không cần hooks:

```typescript
import { OrdersService } from '@/features/orders/services'

// Trong async function
const orders = await OrdersService.getOrdersList({
  pagination: { page: 1, perPage: 20 }
})

const orderDetail = await OrdersService.getOrderDetail({ id: 123 })

await OrdersService.updateOrder({
  id: 123,
  data: { status: 'delivered' }
})
```

## Types chính

### Order

```typescript
type Order = {
  id: number
  reference: string
  date: string
  customer_id: number
  basket: BasketItem[]
  total_ex_taxes: number
  delivery_fees: number
  tax_rate: number
  taxes: number
  total: number
  status: 'ordered' | 'delivered' | 'cancelled'
  returned: boolean
}
```

### Filter Options

```typescript
filter: {
  status?: 'ordered' | 'delivered' | 'cancelled'
  customer_id?: number
  date_gte?: string  // ISO date string
  date_lte?: string  // ISO date string
  total_gte?: number
  total_lte?: number
  q?: string        // search query
}
```

## Lưu ý

1. **Caching**: Hooks sử dụng TanStack Query để cache dữ liệu, giảm số lần gọi API
2. **Error Handling**: Tất cả functions đều có error handling và throw meaningful errors
3. **TypeScript**: Đầy đủ type safety với TypeScript
4. **Export**: Hỗ trợ export CSV với encoding UTF-8 cho tiếng Việt
5. **Bulk Operations**: Hỗ trợ xóa nhiều orders cùng lúc
6. **Stats**: Cung cấp thống kê chi tiết về orders

## Cài đặt dependencies

Đảm bảo đã cài đặt các package cần thiết:

```bash
npm install @tanstack/react-query
# hoặc
yarn add @tanstack/react-query
```
