import { Crud, List } from '@toolpad/core/Crud'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { categoriesCache, CategoriesDataSource } from '../../../data/category'


const CategoryList = () => {
  const navigate = useNavigate()

  return (
    <List
      dataSource={CategoriesDataSource}
      dataSourceCache={categoriesCache}
      initialPageSize={25}
      onCreateClick={() => navigate('/categories/create')}
      onRowClick={(row) => navigate(`/categories/${row}`)}
      onEditClick={(row) => navigate(`/categories/${row}/edit`)}
      onDelete={CategoriesDataSource.deleteOne}
    />
  )
}

export default CategoryList