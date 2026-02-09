import service from '@/utils/request';
import type { AxiosResponse } from 'axios';
import type {
  QuestionnaireAddDTO,
  QuestionnaireUpdateDTO,
  QuestionnaireAnswerSubmitDTO,
  QuestionnaireListResult,
  UserAnswerResult,
  BasicResult
} from '@/types/questionnaire';

// 获取问卷题目列表（前端展示填写）
export const getQuestionnaireList = (): Promise<AxiosResponse<QuestionnaireListResult>> => {
  return service({
    url: '/api/questionnaire/list',
    method: 'get'
  });
};

// 提交问卷答案
export const submitQuestionnaireAnswer = (data: QuestionnaireAnswerSubmitDTO): Promise<AxiosResponse<BasicResult>> => {
  return service({
    url: '/api/questionnaire/answer/submit',
    method: 'post',
    data
  });
};

// 查询用户已提交的问卷答案
export const getUserQuestionnaireAnswer = (userId: number): Promise<AxiosResponse<UserAnswerResult>> => {
  return service({
    url: `/api/questionnaire/answer/${userId}`,
    method: 'get'
  });
};

// 管理员新增问卷题目
export const addQuestionnaire = (data: QuestionnaireAddDTO): Promise<AxiosResponse<BasicResult>> => {
  return service({
    url: '/api/questionnaire/add',
    method: 'post',
    data
  });
};

// 管理员修改问卷题目
export const updateQuestionnaire = (data: QuestionnaireUpdateDTO): Promise<AxiosResponse<BasicResult>> => {
  return service({
    url: '/api/questionnaire/update',
    method: 'put',
    data
  });
};

// 管理员删除问卷题目
export const deleteQuestionnaire = (id: number): Promise<AxiosResponse<BasicResult>> => {
  return service({
    url: `/api/questionnaire/delete/${id}`,
    method: 'delete'
  });
};