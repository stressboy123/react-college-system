import service from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { Result, TCollege, TMajor, PageParams, PageResult } from '@/types/api'

// 院校分页列表
export const getCollegeList = (params: PageParams): Promise<AxiosResponse<Result<PageResult<TCollege>>>> => {
  return service({
    url: '/api/data/college/page',
    method: 'get',
    params
  })
}

// 专业分页列表
export const getMajorList = (params: PageParams): Promise<AxiosResponse<Result<PageResult<TMajor>>>> => {
  return service({
    url: '/api/data/major/page',
    method: 'get',
    params
  })
}