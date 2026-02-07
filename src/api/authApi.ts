import request from '@/utils/request';
import { Result, LoginDTO, RegisterDTO } from '@/types/api';

// 登录接口（POST /auth/login）
export function login(data: LoginDTO) {
  return request<Result<{ token: string; userId: number }>>({ // 示例返回token+用户ID，替换为后端实际返回
    url: '/auth/login',
    method: 'post',
    data
  });
}

// 注册接口（POST /auth/register）
export function register(data: RegisterDTO) {
  return request<Result<boolean>>({ // 示例返回是否注册成功，替换为后端实际返回
    url: '/auth/register',
    method: 'post',
    data
  });
}

// 可选：退出登录、刷新token等接口
export function logout() {
  return request<Result<boolean>>({
    url: '/auth/logout',
    method: 'post'
  });
}