import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './layouts/dashboard.jsx'
import { OrderList, OrderShow } from './features/orders'
import { ProductCreate, ProductList, ProductShow } from './features/products'
import ProductEdit from './features/products/pages/editProduct.jsx'
import { CategoryCreate, CategoryEdit, CategoryList, CategoryShow } from './features/categories'
import { AddonCreate, AddonEdit, AddonList, AddonShow } from './features/addons'
import { DiscountCreate, DiscountEdit, DiscountList, DiscountShow } from './features/discounts'
import { DashboardShow } from './features/dashboard'
import Public from './layouts/public.jsx'
import { Logout, SignIn } from './features/auth/index.js'
import Protected from './layouts/protected.jsx'


const router = createBrowserRouter([
  {
    Component: App,
    children: [
      // Public Routes
      {
        element: <Public/>,
        children: [
          {
            path: '/signin',
            element: <SignIn />
          },
          
        ]
      },
      // Protected Routes
      {
        element: <Protected />, // protect the dashboard area
        children: [
          {
            element: <Layout />,
            children: [
              { path: '/', element: <DashboardShow /> },
              { path: 'orders', element: <OrderList /> },
              { path: 'orders/:id', element: <OrderShow /> },
              { path: 'products', element: <ProductList /> },
              { path: 'products/create', element: <ProductCreate /> },
              { path: 'products/:id', element: <ProductShow /> },
              { path: 'products/:id/edit', element: <ProductEdit /> },
              { path: 'categories', element: <CategoryList /> },
              { path: 'categories/create', element: <CategoryCreate /> },
              { path: 'categories/:id', element: <CategoryShow /> },
              { path: 'categories/:id/edit', element: <CategoryEdit /> },
              { path: 'addons', element: <AddonList /> },
              { path: 'addons/create', element: <AddonCreate /> },
              { path: 'addons/:id', element: <AddonShow /> },
              { path: 'addons/:id/edit', element: <AddonEdit /> },
              { path: 'discounts', element: <DiscountList /> },
              { path: 'discounts/create', element: <DiscountCreate /> },
              { path: 'discounts/:id', element: <DiscountShow /> },
              { path: 'discounts/:id/edit', element: <DiscountEdit /> },
              { path: '/logout', element: <Logout /> },
            ]
          }
        ]
      }
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
