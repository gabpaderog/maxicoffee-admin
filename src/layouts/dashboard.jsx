import { Outlet } from 'react-router-dom';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import React from 'react'

const Layout = () => {
  return (
    <DashboardLayout>
      <PageContainer>
        <Outlet/>
      </PageContainer>
    </DashboardLayout>
  )
}

export default Layout