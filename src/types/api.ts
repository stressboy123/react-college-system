// 后端ResultCode枚举（需和后端com.gdut.entity.ResultCode完全对齐）
export enum ResultCode {
  SUCCESS = 200, // 示例值，替换为后端实际枚举值
  FAIL = 500,
  UNAUTHORIZED = 401
}

// 后端统一返回格式Result（匹配com.gdut.entity.Result）
export interface Result<T = any> {
  code: ResultCode; // 枚举值
  message: string; // 返回提示信息
  data: T; // 业务数据
}

// 登录传参（匹配com.gdut.entity.LoginDTO）
export interface LoginDTO {
  username: string; // 示例字段，替换为后端实际字段（如账号/手机号/邮箱）
  password: string; // 密码
  // 可选：验证码、记住我等字段
}

// 注册传参（匹配com.gdut.entity.RegisterDTO）
export interface RegisterDTO {
  username: string;
  password: string;
  email?: string; // 示例可选字段
  phone?: string; // 示例可选字段
  // 其他后端要求的注册字段
}

// 专业类（匹配com.gdut.entity.TMajor）
export interface TMajor {
  id: number; // 专业ID
  majorName: string; // 专业名称
  collegeId: number; // 所属学院ID
  // 其他字段：创建时间、状态等
}

// 大学/学院类（匹配com.gdut.entity.TCollege）
export interface TCollege {
  id: number; // 学院ID
  collegeName: string; // 学院名称
  // 其他字段：学校ID、备注等
}