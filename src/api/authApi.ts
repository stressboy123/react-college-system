import service from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { Result, LoginDTO, RegisterDTO, LoginResponseVO } from '@/types/api'

// 登录接口
export const login = (data: LoginDTO): Promise<AxiosResponse<Result<LoginResponseVO>>> => {
  return service({
    url: '/auth/login',
    method: 'post',
    data
  })
}

// 注册接口
export const register = (data: RegisterDTO): Promise<AxiosResponse<Result<string>>> => {
  return service({
    url: '/auth/register',
    method: 'post',
    data
  })
}

// 登出接口
export const logout = (): Promise<AxiosResponse<Result<string>>> => {
  return service({
    url: '/auth/logout',
    method: 'post'
  })
}