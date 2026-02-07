// 替换enum为const对象，避免erasableSyntaxOnly报错
export const ResultCode = {
  SUCCESS: 200,
  FAIL: 500,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404
} as const

export type ResultCode = (typeof ResultCode)[keyof typeof ResultCode]

// 统一返回格式（匹配后端Result类）
export interface Result<T = unknown> {
  code: ResultCode
  message: string
  data: T
}

// 登录DTO（匹配后端LoginDTO）
export interface LoginDTO {
  username: string
  password: string
}

// 注册DTO（匹配后端RegisterDTO）
export interface RegisterDTO {
  username: string
  password: string
  role: 'user' | 'admin' // 普通用户/管理员
}

// 登录返回结果（后端返回的用户信息）
export interface LoginResponse {
  token: string
  userId: number
  username: string
  role: 'user' | 'admin'
}

// 院校类（匹配后端TCollege）
export interface TCollege {
  id: number
  collegeName: string
  province?: string
  type?: string // 综合/理工等
  level?: string // 本科/专科
}

// 专业类（匹配后端TMajor）
export interface TMajor {
  id: number
  majorName: string
  collegeId: number // 关联院校ID
  degree?: string // 学士/硕士
  category?: string // 工学/理学
}

// 分页参数
export interface PageParams {
  current: number
  pageSize: number
}

// 分页返回结果
export interface PageResult<T> {
  list: T[]
  total: number
}