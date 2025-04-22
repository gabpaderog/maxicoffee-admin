import { Navigate, Outlet } from 'react-router-dom'

const isAuthenticated = () => {
  return localStorage.getItem('accessToken')
}

export default function Public() {
  return isAuthenticated() ? <Navigate to="/" /> : <Outlet />
}
