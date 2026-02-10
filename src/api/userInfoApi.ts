import service from '@/utils/request';
import type { AxiosResponse } from 'axios';
import type { UserInfoDTO, UserInfoResult } from '@/types/userInfo';

/**
 * 查询用户详细信息（根据sysUserId）
 */
export const getUserInfo = (userId: number): Promise<AxiosResponse<UserInfoResult>> => {
  return service({
    url: `/api/user/userInfo/${userId}`,
    method: 'get'
  });
};

/**
 * 新增/更新用户信息（后端add接口已实现“存在则更新”逻辑）
 */
export const saveUserInfo = (data: UserInfoDTO): Promise<AxiosResponse<UserInfoResult>> => {
  return service({
    url: '/api/user/add', // 后端add接口兼容新增+更新，无需调用update
    method: 'post',
    data
  });
};

/**
 * 单独更新用户信息（备用，前端默认用saveUserInfo即可）
 */
export const updateUserInfo = (data: UserInfoDTO): Promise<AxiosResponse<UserInfoResult>> => {
  return service({
    url: '/api/user/update',
    method: 'put',
    data
  });
};