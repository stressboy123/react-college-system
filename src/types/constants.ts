/**
 * 省份类型（匹配t_province表）
 */
export interface ProvinceItem {
  provinceCode: string;
  provinceName: string;
  isNewGaokao: number; // 1=新高考，0=非新高考
}

/**
 * 选科组合类型（匹配t_subject_combination表）
 */
export interface SubjectCombinationItem {
  subjectCode: string;
  subjectName: string;
  firstSubject: string; // 物理/历史
  secondSubject: string; // 逗号分隔的再选科目
}

/**
 * 省份常量
 */
export const PROVINCE_LIST: ProvinceItem[] = [
  { provinceCode: '110000', provinceName: '北京市', isNewGaokao: 1 },
  { provinceCode: '120000', provinceName: '天津市', isNewGaokao: 1 },
  { provinceCode: '130000', provinceName: '河北省', isNewGaokao: 1 },
  { provinceCode: '140000', provinceName: '山西省', isNewGaokao: 0 },
  { provinceCode: '150000', provinceName: '内蒙古自治区', isNewGaokao: 1 },
  { provinceCode: '210000', provinceName: '辽宁省', isNewGaokao: 1 },
  { provinceCode: '220000', provinceName: '吉林省', isNewGaokao: 1 },
  { provinceCode: '230000', provinceName: '黑龙江省', isNewGaokao: 1 },
  { provinceCode: '310000', provinceName: '上海市', isNewGaokao: 1 },
  { provinceCode: '320000', provinceName: '江苏省', isNewGaokao: 1 },
  { provinceCode: '330000', provinceName: '浙江省', isNewGaokao: 1 },
  { provinceCode: '340000', provinceName: '安徽省', isNewGaokao: 1 },
  { provinceCode: '350000', provinceName: '福建省', isNewGaokao: 1 },
  { provinceCode: '360000', provinceName: '江西省', isNewGaokao: 1 },
  { provinceCode: '370000', provinceName: '山东省', isNewGaokao: 1 },
  { provinceCode: '410000', provinceName: '河南省', isNewGaokao: 1 },
  { provinceCode: '420000', provinceName: '湖北省', isNewGaokao: 1 },
  { provinceCode: '430000', provinceName: '湖南省', isNewGaokao: 1 },
  { provinceCode: '440000', provinceName: '广东省', isNewGaokao: 1 },
  { provinceCode: '450000', provinceName: '广西壮族自治区', isNewGaokao: 1 },
  { provinceCode: '460000', provinceName: '海南省', isNewGaokao: 1 },
  { provinceCode: '500000', provinceName: '重庆市', isNewGaokao: 1 },
  { provinceCode: '510000', provinceName: '四川省', isNewGaokao: 1 },
  { provinceCode: '520000', provinceName: '贵州省', isNewGaokao: 1 },
  { provinceCode: '530000', provinceName: '云南省', isNewGaokao: 1 },
  { provinceCode: '540000', provinceName: '西藏自治区', isNewGaokao: 0 },
  { provinceCode: '610000', provinceName: '陕西省', isNewGaokao: 1 },
  { provinceCode: '620000', provinceName: '甘肃省', isNewGaokao: 1 },
  { provinceCode: '630000', provinceName: '青海省', isNewGaokao: 1 },
  { provinceCode: '640000', provinceName: '宁夏回族自治区', isNewGaokao: 1 },
  { provinceCode: '650000', provinceName: '新疆维吾尔自治区', isNewGaokao: 0 },
  { provinceCode: '710000', provinceName: '台湾省', isNewGaokao: 0 },
  { provinceCode: '810000', provinceName: '香港特别行政区', isNewGaokao: 0 },
  { provinceCode: '820000', provinceName: '澳门特别行政区', isNewGaokao: 0 },
];

/**
 * 选科组合常量
 */
export const SUBJECT_COMBINATION_LIST: SubjectCombinationItem[] = [
  { subjectCode: 'W-ZD', subjectName: '物理+政治+地理', firstSubject: '物理', secondSubject: '政治,地理' },
  { subjectCode: 'W-ZH', subjectName: '物理+政治+化学', firstSubject: '物理', secondSubject: '政治,化学' },
  { subjectCode: 'W-ZS', subjectName: '物理+政治+生物', firstSubject: '物理', secondSubject: '政治,生物' },
  { subjectCode: 'W-DH', subjectName: '物理+地理+化学', firstSubject: '物理', secondSubject: '地理,化学' },
  { subjectCode: 'W-DS', subjectName: '物理+地理+生物', firstSubject: '物理', secondSubject: '地理,生物' },
  { subjectCode: 'W-HS', subjectName: '物理+化学+生物', firstSubject: '物理', secondSubject: '化学,生物' },
  { subjectCode: 'L-ZD', subjectName: '历史+政治+地理', firstSubject: '历史', secondSubject: '政治,地理' },
  { subjectCode: 'L-ZH', subjectName: '历史+政治+化学', firstSubject: '历史', secondSubject: '政治,化学' },
  { subjectCode: 'L-ZS', subjectName: '历史+政治+生物', firstSubject: '历史', secondSubject: '政治,生物' },
  { subjectCode: 'L-DH', subjectName: '历史+地理+化学', firstSubject: '历史', secondSubject: '地理,化学' },
  { subjectCode: 'L-DS', subjectName: '历史+地理+生物', firstSubject: '历史', secondSubject: '地理,生物' },
  { subjectCode: 'L-HS', subjectName: '历史+化学+生物', firstSubject: '历史', secondSubject: '化学,生物' },
];

/**
 * 再选科目基础选项（用于下拉）
 */
export const SECOND_SUBJECT_OPTIONS = [
  { label: '化学', value: '化学' },
  { label: '生物', value: '生物' },
  { label: '地理', value: '地理' },
  { label: '政治', value: '政治' },
];

/**
 * 首选科目选项
 */
export const FIRST_SUBJECT_OPTIONS = [
  { label: '物理', value: '物理' },
  { label: '历史', value: '历史' },
];