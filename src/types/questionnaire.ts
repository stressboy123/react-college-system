import type { Result } from './api';

// 问题类型枚举（后端QuestionTypeEnum）
export const QuestionType = {
  SINGLE_CHOICE: 'single_choice',
  MULTIPLE_CHOICE: 'multiple_choice',
  FILL_BLANK: 'fill_blank'
} as const;
export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

// 问题类型中文映射（前端展示用）
export const QuestionTypeCN = {
  [QuestionType.SINGLE_CHOICE]: '单选',
  [QuestionType.MULTIPLE_CHOICE]: '多选',
  [QuestionType.FILL_BLANK]: '填空'
} as const;

// 问卷题目展示DTO（后端返回）
export interface QuestionnaireQuestionDTO {
  id?: number;
  questionTitle: string;
  questionType: QuestionType;
  questionTypeName: string;
  options?: string[];
  sort: number;
}

// 新增问卷题目DTO（传给后端）
export interface QuestionnaireAddDTO {
  questionTitle: string;
  questionType: QuestionType;
  options?: string;
  sort: number;
}

// 修改问卷题目DTO（传给后端）
export interface QuestionnaireUpdateDTO {
  id: number;
  questionTitle?: string;
  questionType?: QuestionType;
  options?: string;
  sort?: number;
}

// 单题答案项DTO
export interface AnswerItemDTO {
  questionnaireId: number;
  answerContent: string;
}

// 提交问卷答案DTO（传给后端）
export interface QuestionnaireAnswerSubmitDTO {
  userId: number;
  answerList: AnswerItemDTO[];
}

// 用户已答问卷DTO（后端返回）
export interface UserQuestionnaireAnswerDTO {
  questionnaireId: number;
  questionTitle: string;
  questionType: QuestionType;
  answerContent: string;
}

// 接口返回类型别名（简化代码）
export type QuestionnaireListResult = Result<QuestionnaireQuestionDTO[]>;
export type UserAnswerResult = Result<UserQuestionnaireAnswerDTO[]>;
export type BasicResult = Result<void>;