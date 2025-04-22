import { Crud, List } from '@toolpad/core/Crud'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { discountsCache, DiscountsDataSource } from '../../../data/discount'

const DiscountList = () => {
  const navigate = useNavigate()

  return (
    <List
      dataSource={DiscountsDataSource}
      dataSourceCache={discountsCache}
      initialPageSize={25}
      onCreateClick={() => navigate('/discounts/create')}
      onRowClick={(row) => navigate(`/discounts/${row}`)}
      onEditClick={(row) => navigate(`/discounts/${row}/edit`)}
      onDelete={DiscountsDataSource.deleteOne}
    />
  )
}

export default DiscountList