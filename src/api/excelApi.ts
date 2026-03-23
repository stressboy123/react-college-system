import service from '@/utils/request';
import type { AxiosProgressEvent, AxiosResponse } from 'axios';
import type { Result } from '@/types/api';

// 上传进度回调类型
export type UploadProgressCallback = (progressEvent: AxiosProgressEvent) => void;

/**
 * 导入招生计划
 * @param formData 表单数据（包含Excel文件）
 * @param onProgress 上传进度回调
 */
export const importEnrollmentPlan = (
  formData: FormData,
  onProgress?: UploadProgressCallback
): Promise<AxiosResponse<Result<string>>> => {
  return service({
    url: '/excel/addEnrollmentPlan',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress,
    timeout: 60000 // 60秒超时
  });
};

/**
 * 导入一分一段数据
 * @param formData 表单数据（包含Excel文件）
 * @param onProgress 上传进度回调
 */
export const importScoreRank = (
  formData: FormData,
  onProgress?: UploadProgressCallback
): Promise<AxiosResponse<Result<string>>> => {
  return service({
    url: '/excel/addScoreRank',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress,
    timeout: 60000
  });
};

/**
 * 导入录取数据
 * @param formData 表单数据（包含Excel文件）
 * @param onProgress 上传进度回调
 */
export const importAdmissionData = (
  formData: FormData,
  onProgress?: UploadProgressCallback
): Promise<AxiosResponse<Result<string>>> => {
  return service({
    url: '/excel/addAdmissionData',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress,
    timeout: 60000
  });
};