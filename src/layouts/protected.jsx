// components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'

const isAuthenticated = () => {
  return localStorage.getItem('accessToken')
}

export default function Protected() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/signin" />
}
