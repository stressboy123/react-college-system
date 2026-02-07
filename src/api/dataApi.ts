import request from '@/utils/request';
import { Result, TMajor, TCollege } from '@/types/api';

// 获取所有学院列表（示例GET请求，路径需和后端DataController对齐）
export function getCollegeList() {
  return request<Result<TCollege[]>>({
    url: '/data/college/list',
    method: 'get'
  });
}

// 根据学院ID获取专业列表（示例GET请求，带参数）
export function getMajorListByCollegeId(collegeId: number) {
  return request<Result<TMajor[]>>({
    url: '/data/major/list',
    method: 'get',
    params: { collegeId } // URL参数
  });
}