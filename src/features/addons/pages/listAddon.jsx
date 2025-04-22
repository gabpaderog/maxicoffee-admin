import { Crud, List } from '@toolpad/core/Crud'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { addonsCache, AddonsDataSource } from '../../../data/addon'


const AddonList = () => {
  const navigate = useNavigate()

  return (
    <List
      dataSource={AddonsDataSource}
      dataSourceCache={addonsCache}
      initialPageSize={25}
      onCreateClick={() => navigate('/addons/create')}
      onRowClick={(row) => navigate(`/addons/${row}`)}
      onEditClick={(row) => navigate(`/addons/${row}/edit`)}
      onDelete={AddonsDataSource.deleteOne}
    />
  )
}

export default AddonList