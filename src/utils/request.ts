import axios from 'axios'
import type { 
  InternalAxiosRequestConfig, 
  AxiosResponse,
  AxiosError
} from 'axios'
import type { Result } from '@/types/api'
import { message } from 'antd'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:11451',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    message.error(error.message || '请求异常')
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<Result<unknown>>) => {
    const res = response.data
    // 非200状态码抛错，但仍返回完整response
    if (res.code !== 200) {
      message.error(res.message || '请求失败')
    }
    return response // 返回完整的AxiosResponse，而非Result
  },
  (error: AxiosError) => {
    message.error(error.message || '服务器异常')
    return Promise.reject(error)
  }
)

export default service