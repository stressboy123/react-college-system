import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import { useUserStore } from './store/userStore';

// 路由守卫：未登录拦截
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isLogin = useUserStore((state) => state.isLogin);
  return isLogin ? children : <Navigate to="/login" />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoute><Main /></PrivateRoute>, // 默认跳主页面（需登录）
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
    element: <Navigate to="/login" />, // 404跳登录
  },
]);