export const ResultCode = {
  SUCCESS: 200,
  FAIL: 500,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404
} as const

export type ResultCode = (typeof ResultCode)[keyof typeof ResultCode]

// 统一返回格式（匹配后端Result类）
export interface Result<T = unknown> {
  success: boolean;
  code: ResultCode;
  msg: string;
  data: T;
}

// 登录DTO（匹配后端LoginDTO）
export interface LoginDTO {
  username: string;
  password: string;
}

// 注册DTO（匹配后端RegisterDTO）
export interface RegisterDTO {
  username: string;
  password: string;
  nickname?: string;
}

// 登录返回结果（后端返回的用户信息）
export interface UserInfo {
  token: string;
  username: string;
  nickname?: string;
  role?: 'user' | 'admin'; // 暂时保留，后续可通过用户信息接口补充
}

// 院校类（匹配后端TCollege实体）
export interface TCollege {
  id: number;
  collegeCode: string; // 院校编码
  collegeName: string; // 院校名称
  competentAuthority: string; // 主管部门
  provinceId: number; // 所属省份主键
  schoolLevel: string; // 办学层次（本科/专科/双一流）
  schoolNature: string; // 办学性质（公办/民办/中外合作）
  collegeType: string; // 院校性质（综合类/理工类/文史类）
  detailedAddress: string; // 详细地址
  officialWebsite: string; // 官方网址
  enrollmentWebsite: string; // 招生网址
  officialPhone: string; // 官方电话
  collegeSatisfaction: string; // 院校满意度（0-5分）
  majorSatisfaction: string; // 专业满意度（0-5分）
  majorRecommendCount: string; // 专业推荐人数
  majorRecommendIndex: string; // 专业推荐指数（0-5分）
}

// 专业类（匹配后端TMajor实体）
export interface TMajor {
  id: number;
  majorCategory: string; // 专业门类（工学/理学/文学）
  majorType: string; // 专业类（计算机类/电子信息类）
  majorName: string; // 专业名称
  majorCode: string; // 专业代码
  educationLength: string; // 修业年限
  degreeAwarded: string; // 授予学位
  averageSalary: string; // 平均薪酬（元/月）
  postgraduateDirection: string; // 考研方向
  majorIntro: string; // 简介
  comprehensiveSatisfaction: number; // 综合满意度（0-5分）
  schoolCondition: number; // 办学条件（0-5分）
  teachingQuality: number; // 教学质量（0-5分）
  employmentSituation: number; // 就业情况（0-5分）
  threeYearEmploymentRate: string; // 近三年就业率
}

// 分页参数（匹配后端pageNum/pageSize）
export interface PageParams {
  pageNum: number; // 替换原来的current
  pageSize: number;
}

// 分页返回结果（匹配后端Map<String, Object>结构）
export interface PageResult<T> {
  total: number; // 总条数
  pages: number; // 总页数
  current: number; // 当前页
  records: T[]; // 数据列表
}