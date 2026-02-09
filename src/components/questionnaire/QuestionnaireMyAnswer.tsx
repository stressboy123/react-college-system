import { useState, useEffect, useCallback } from 'react';
import { Card, Typography, List, Divider, message, Spin } from 'antd';
import { useUserStore } from '@/store/userStore';
import { getUserQuestionnaireAnswer } from '@/api/questionnaireApi';
import type { UserQuestionnaireAnswerDTO } from '@/types/questionnaire';
import { QuestionTypeCN } from '@/types/questionnaire';

const { Title, Text } = Typography;

const QuestionnaireMyAnswer = () => {
  const [answerList, setAnswerList] = useState<UserQuestionnaireAnswerDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUserStore();
  const userId = user?.id as number;

  // 获取用户已答问卷
  const fetchMyAnswer = useCallback(async () => {
    if (!userId) {
      message.error('用户未登录，请重新登录');
      return;
    }
    setLoading(true);
    try {
      const res = await getUserQuestionnaireAnswer(userId);
      const { data } = res;
      if (data.code === 200 && data.data) {
        setAnswerList(data.data);
      }
    } catch (err) {
      console.error('获取我的答卷失败：', err);
      message.error('获取答卷失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMyAnswer();
  }, [fetchMyAnswer]);

  // 格式化答案展示（多选逗号分隔转分行）
  const formatAnswer = (type: string, content: string) => {
    if (type === 'multiple_choice') {
      return content.split(',').map((item, idx) => <div key={idx}>- {item}</div>);
    }
    return content;
  };

  if (loading) return <Spin tip="加载我的答卷中..." style={{ display: 'block', textAlign: 'center', padding: 40 }} />;
  if (answerList.length === 0) return <Card title={<Title level={4}>我的答卷</Title>} bordered={false}><Text type="secondary">暂无已提交的问卷答案</Text></Card>;

  return (
    <Card title={<Title level={4}>我的答卷</Title>} bordered={false} style={{ maxWidth: 800, margin: '0 auto' }}>
      <List
        dataSource={answerList}
        itemLayout="vertical"
        renderItem={(item) => (
          <List.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>{item.questionTitle}</Text>
              <Text type="secondary">{QuestionTypeCN[item.questionType as keyof typeof QuestionTypeCN]}</Text>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ paddingLeft: 16 }}>
              <Text>我的答案：</Text>
              <div style={{ marginTop: 4 }}>{formatAnswer(item.questionType, item.answerContent)}</div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default QuestionnaireMyAnswer;