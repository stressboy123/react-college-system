import { useState, useEffect } from 'react';
import { Card, Typography, Table, Tag, Space, Divider, Spin, message } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { PredictFinalResultVO, CollegeMajorPredictVO } from '@/types/predict';
import type { UserInfoDTO } from '@/types/userInfo';
import { predictVolunteer, saveUserInfo } from '@/api/predictApi';

const { Title, Text } = Typography;

// 冲稳保标签颜色配置
const typeTagColorMap = {
  冲: 'orange',
  稳: 'blue',
  保: 'green'
};

// 显式标注列类型
const columns: ColumnType<CollegeMajorPredictVO>[] = [
  { title: '院校代码', dataIndex: 'collegeCode', key: 'collegeCode', width: 100 },
  { title: '院校名称', dataIndex: 'collegeName', key: 'collegeName', width: 200 },
  { title: '院校层级', dataIndex: 'schoolLevel', key: 'schoolLevel', width: 100 },
  { title: '办学性质', dataIndex: 'schoolNature', key: 'schoolNature', width: 100 },
  { title: '选科要求', dataIndex: 'subjectRequirement', key: 'subjectRequirement', width: 150 },
  { title: '最低录取分', dataIndex: 'lowestAdmissionScore', key: 'lowestAdmissionScore', width: 120 },
  { title: '最低录取排名', dataIndex: 'lowestAdmissionRank', key: 'lowestAdmissionRank', width: 120 },
  { 
    title: '录取概率(%)', 
    dataIndex: 'admitProbability', 
    key: 'admitProbability', 
    width: 120, 
    render: (value?: number) => value ? value.toFixed(2) : '-' 
  },
  { 
    title: '学费区间(元/年)', 
    dataIndex: 'tuitionFeeMin', // 当前列绑定的是tuitionFeeMin
    key: 'tuitionFee', 
    width: 150,
    // 正确参数顺序：value=tuitionFeeMin, record=整条院校数据
    render: (tuitionMin?: number, record?: CollegeMajorPredictVO) => {
      if (!record) return '-';
      return `${tuitionMin || '-'}-${record.tuitionFeeMax || '-'}`;
    }
  },
  { title: '分类理由', dataIndex: 'reason', key: 'reason' }
];

// Props类型定义
interface PredictResultProps {
  result?: PredictFinalResultVO;
  userInfo: UserInfoDTO | null;
}

// 最终修复版组件
const PredictResult = ({ userInfo }: PredictResultProps) => {
  // 状态管理：预测结果、请求loading、空数据
  const [predictResult, setPredictResult] = useState<PredictFinalResultVO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const renderEmpty = () => <Text type="secondary">暂无相关预测结果</Text>;

  // 核心：组件挂载时发起预测请求（切换到该组件就发请求）
  useEffect(() => {
    // 前置校验：用户信息为空直接返回
    if (!userInfo || !userInfo.sysUserId) {
      message.error('用户信息异常，请重新完善');
      setLoading(false);
      return;
    }

    // 定义请求方法
    const fetchPredictData = async () => {
      try {
        setLoading(true);
        // 1. 调用后端预测接口（核心：发送请求）
        const res = await predictVolunteer(userInfo);
        const { data } = res;

        if (data.success && data.data) {
          // 2. 预测成功：保存结果到state，用于表格渲染
          setPredictResult(data.data);
          message.success('志愿预测成功！');

          // 3. 静默保存用户信息到数据库（无提示，按你的要求）
          try {
            await saveUserInfo(userInfo);
            console.log('用户信息静默保存成功'); // 仅控制台打印，不弹提示
          } catch (saveErr) {
            console.warn('用户信息静默保存失败：', saveErr); // 保存失败不影响预测结果
          }
        } else {
          message.error(data.msg || '志愿预测失败，请检查信息后重试');
        }
      } catch (err) {
        // 网络错误/接口超时等异常处理
        console.error('预测接口请求失败：', err);
        message.error('预测请求失败，请检查后端服务是否启动');
      } finally {
        setLoading(false); // 无论成功失败，结束loading
      }
    };

    // 执行请求
    fetchPredictData();
  }, [userInfo]); // 依赖userInfo：信息变化重新请求

  // 默认空结果兜底
  const finalResult: PredictFinalResultVO = predictResult ?? {
    rushList: [],
    stableList: [],
    safetyList: []
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', marginTop: 20 }}>
      <Title level={4} style={{ textAlign: 'center', marginBottom: 20 }}>
        志愿预测结果（{userInfo?.candidateProvince || '未知省份'} · {userInfo?.candidateYear || '未知年份'}）
      </Title>

      {/* 请求loading：全局遮罩 */}
      <Spin spinning={loading} tip="正在为你预测志愿，请稍候..." style={{ minHeight: 400 }}>
        {/* 冲 - 列表 */}
        <Card 
          title={
            <Space>
              <Tag color={typeTagColorMap['冲']} style={{ fontSize: '16px', padding: '4px 8px' }}>冲</Tag>
              <Text strong>冲刺类院校（录取概率 40%-60%）</Text>
            </Space>
          } 
          bordered 
          style={{ marginBottom: 16 }}
        >
          {finalResult.rushList?.length ? (
            <Table<CollegeMajorPredictVO>
              columns={columns}
              dataSource={finalResult.rushList.map((item, idx) => ({...item, key: `rush-${idx}`}))}
              pagination={{ pageSize: 5 }}
              size="middle"
            />
          ) : renderEmpty()}
        </Card>

        <Divider />

        {/* 稳 - 列表 */}
        <Card 
          title={
            <Space>
              <Tag color={typeTagColorMap['稳']} style={{ fontSize: '16px', padding: '4px 8px' }}>稳</Tag>
              <Text strong>稳妥类院校（录取概率 60%-85%）</Text>
            </Space>
          } 
          bordered 
          style={{ marginBottom: 16 }}
        >
          {finalResult.stableList?.length ? (
            <Table<CollegeMajorPredictVO>
              columns={columns}
              dataSource={finalResult.stableList.map((item, idx) => ({...item, key: `stable-${idx}`}))}
              pagination={{ pageSize: 5 }}
              size="middle"
            />
          ) : renderEmpty()}
        </Card>

        <Divider />

        {/* 保 - 列表 */}
        <Card 
          title={
            <Space>
              <Tag color={typeTagColorMap['保']} style={{ fontSize: '16px', padding: '4px 8px' }}>保</Tag>
              <Text strong>保底类院校（录取概率 85%以上）</Text>
            </Space>
          } 
          bordered
        >
          {finalResult.safetyList?.length ? (
            <Table<CollegeMajorPredictVO>
              columns={columns}
              dataSource={finalResult.safetyList.map((item, idx) => ({...item, key: `safety-${idx}`}))}
              pagination={{ pageSize: 5 }}
              size="middle"
            />
          ) : renderEmpty()}
        </Card>
      </Spin>
    </div>
  );
};

export default PredictResult;