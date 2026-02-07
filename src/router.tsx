import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Main from '@/pages/Main'
import { useUserStore } from '@/store/userStore'

// 路由守卫
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isLogin = useUserStore((state) => state.isLogin)
  return isLogin ? children : <Navigate to="/login" />
}

// 定义路由
const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoute><Main /></PrivateRoute>,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '*',
    element: <Navigate to="/login" />,
  },
])

const AppRouter = () => {
  return <RouterProvider router={router} />
}

export default AppRouter