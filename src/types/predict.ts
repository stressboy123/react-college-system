import type { Result } from './api';
import type { UserInfoDTO } from './userInfo';

/**
 * 院校专业预测VO（与后端CollegeMajorPredictVO一致）
 */
export interface CollegeMajorPredictVO {
  // 院校专业组基础信息
  collegeCode?: string;
  collegeName?: string;
  collegeProvinceId?: number;
  schoolLevel?: string;
  schoolNature?: string;
  collegeType?: string;
  majorGroupCode?: string;
  batch?: string;
  subjectType?: string;
  subjectRequirement?: string;
  totalPlanCount?: number;
  tuitionFeeMin?: number;
  tuitionFeeMax?: number;
  tuitionFeeAvg?: number;
  lowestAdmissionScore?: number;
  lowestAdmissionRank?: number;
  // 预测结果
  predictedMinRank?: number;
  admitProbability?: number;
  // 冲稳保分类
  type?: string;
  // 分类理由
  reason?: string;
}

/**
 * 预测最终结果VO（与后端PredictFinalResultVO一致）
 */
export interface PredictFinalResultVO {
  rushList?: CollegeMajorPredictVO[]; // 冲
  stableList?: CollegeMajorPredictVO[]; // 稳
  safetyList?: CollegeMajorPredictVO[]; // 保
}

// 预测接口返回类型
export type PredictResult = Result<PredictFinalResultVO>;

// 预测请求参数（复用UserInfoDTO）
export type PredictRequestParams = UserInfoDTO;