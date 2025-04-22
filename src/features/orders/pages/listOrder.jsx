import { Crud, List } from '@toolpad/core/Crud'
import React from 'react'
import { ordersCache, OrdersDataSource } from '../../../data/order'
import { useNavigate } from 'react-router-dom'


const OrderList = () => {
  const navigate = useNavigate()

  const handleRowClick = (row) => {
    console.log('Row clicked:', row);
    navigate(`/orders/${row}`)
  }

  return (
    <List
      dataSource={OrdersDataSource}
      dataSourceCache={ordersCache}
      initialPageSize={25}
      onRowClick={handleRowClick}
      onDelete={OrdersDataSource.deleteOne}
    />
  )
}

export default OrderList