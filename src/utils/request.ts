import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// 创建axios实例，匹配后端接口基础路径
const service = axios.create({
  baseURL: 'http://localhost:11451', // 后端接口基础地址
  timeout: 5000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

// 请求拦截器（可选，比如添加token）
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 示例：如果有token，从本地存储获取并添加到请求头
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器（匹配后端统一返回格式Result）
service.interceptors.response.use(
  (response: AxiosResponse<Result<any>>) => {
    const res = response.data;
    // 根据ResultCode枚举判断请求是否成功
    if (res.code !== 200) { // 假设200是成功的枚举值，需和后端ResultCode对齐
      // 可添加错误提示逻辑，比如ElMessage
      // ElMessage.error(res.message || '请求失败');
      return Promise.reject(res);
    }
    return res;
  },
  (error) => {
    // 网络/服务器错误处理
    // ElMessage.error(error.message || '服务器异常');
    return Promise.reject(error);
  }
);

export default service;