import { ReactRouterAppProvider } from '@toolpad/core/react-router'
import { Outlet } from 'react-router-dom'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import InventoryIcon from '@mui/icons-material/Inventory';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DiscountIcon from '@mui/icons-material/Discount';
import LogoutIcon from '@mui/icons-material/Logout';
import React from 'react'

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main Menu'
  },
  {
    segment: '',
    title: 'Dashboard',
    icon: <SpaceDashboardIcon/>,
  },
  {
    segment: 'orders',
    title: 'Orders',
    icon: <ShoppingBagIcon/>,
  },
  {
    segment: 'products',
    title: 'Products',
    icon: <InventoryIcon/>,
  },
  {
    segment: 'categories',
    title: 'Categories',
    icon: <FactCheckIcon/>,
  },
  {
    segment: 'addons',
    title: 'Addons',
    icon: <AddCircleIcon/>,
  },
  {
    segment: 'discounts',
    title: 'Discounts',
    icon: <DiscountIcon/>,
  },
  {
    segment: 'logout',
    title: 'Logout',
    icon: <LogoutIcon />,
  },
]

const BRANDING = {
  title: "",
  logo: "https://sugaryums.com/wp-content/uploads/2022/03/Wintermelon-Milk-Tea-SugarYums-1.jpg",
}

const App = () => {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet/>
    </ReactRouterAppProvider>
  )
}

export default App