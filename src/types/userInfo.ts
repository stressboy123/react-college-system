import type { Result } from './api';

/**
 * 用户详细信息DTO（与后端UserInfoDTO完全一致）
 */
export interface UserInfoDTO {
  /** 系统用户表主键（关联sys_user.id） */
  sysUserId?: number;
  /** 真实姓名 */
  realName?: string;
  /** 手机号 */
  phone?: string;
  /** 考生省份 */
  candidateProvince?: string;
  /** 考生年份 */
  candidateYear?: number;
  /** 首选科目 */
  firstSubject?: string;
  /** 再选科目（多个用逗号分隔） */
  secondSubject?: string;
  /** 高考总分 */
  gaokaoTotalScore?: number;
  /** 全省排名 */
  provinceRank?: number;

  _secondSubjectArr?: string[];
}

// 接口返回类型别名（简化代码）
export type UserInfoResult = Result<UserInfoDTO>;
export type BasicResult = Result<void>;

// 类型安全的字段校验工具函数（替代索引签名）
export const getUserInfoField = <K extends keyof UserInfoDTO>(
  userInfo: UserInfoDTO,
  key: K
): UserInfoDTO[K] => {
  return userInfo[key];
};