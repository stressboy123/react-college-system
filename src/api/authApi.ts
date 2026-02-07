import service from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { Result, LoginDTO, RegisterDTO, LoginResponse } from '@/types/api'

// 登录接口
export const login = (data: LoginDTO): Promise<AxiosResponse<Result<LoginResponse>>> => {
  return service({
    url: '/auth/login',
    method: 'post',
    data
  })
}

// 注册接口
export const register = (data: RegisterDTO): Promise<AxiosResponse<Result<boolean>>> => {
  return service({
    url: '/auth/register',
    method: 'post',
    data
  })
}

export const logout = (): Promise<AxiosResponse<Result<boolean>>> => {
  return service({
    url: '/auth/logout',
    method: 'post'
  })
}