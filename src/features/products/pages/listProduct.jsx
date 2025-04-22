import { Crud, List } from '@toolpad/core/Crud'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { productsCache, ProductsDataSource } from '../../../data/product'


const ProductList = () => {
  const navigate = useNavigate()

  return (
    <List
      dataSource={ProductsDataSource}
      dataSourceCache={productsCache}
      initialPageSize={25}
      onCreateClick={() => navigate('/products/create')}
      onRowClick={(row) => navigate(`/products/${row}`)}
      onEditClick={(row) => navigate(`/products/${row}/edit`)}
      onDelete={ProductsDataSource.deleteOne}
    />
  )
}

export default ProductList