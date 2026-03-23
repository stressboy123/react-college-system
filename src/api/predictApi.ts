import service from '@/utils/request';
import type { AxiosResponse } from 'axios';
import type { PredictRequestParams, PredictResult } from '@/types/predict';

/**
 * 志愿预测接口（核心）
 */
export const predictVolunteer = (data: PredictRequestParams): Promise<AxiosResponse<PredictResult>> => {
  return service({
    timeout: 300000,
    url: '/api/volunteer/predict',
    method: 'post',
    data
  });
};

/**
 * 复用用户信息保存接口（静默保存用）
 */
export { saveUserInfo } from './userInfoApi';