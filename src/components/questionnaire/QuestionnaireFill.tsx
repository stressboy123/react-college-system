import { useState, useEffect, useCallback } from 'react';
import { Form, Button, Radio, Checkbox, Input, Space, Typography, message, Card } from 'antd';
import { useUserStore } from '@/store/userStore';
import { getQuestionnaireList, submitQuestionnaireAnswer } from '@/api/questionnaireApi';
import type { QuestionnaireQuestionDTO, QuestionnaireAnswerSubmitDTO, AnswerItemDTO } from '@/types/questionnaire';

const { Title, Text } = Typography;
type FieldValue = { [key: number]: string | string[] };

const QuestionnaireFill = () => {
  const [form] = Form.useForm<FieldValue>();
  const [questionList, setQuestionList] = useState<QuestionnaireQuestionDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUserStore(); // 获取当前登录用户信息
  const userId = user?.id as number;

  // 获取问卷题目列表
  const fetchQuestionList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getQuestionnaireList();
      const { data } = res;
      if (data.code === 200 && data.data) {
        setQuestionList(data.data);
        // 初始化表单默认值
        const initialValues: FieldValue = {};
        data.data.forEach(item => initialValues[item.id as number] = '');
        form.setFieldsValue(initialValues);
      }
    } catch (err) {
      console.error('获取问卷列表失败：', err);
      message.error('获取问卷失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    fetchQuestionList();
  }, [fetchQuestionList]);

  // 提交问卷答案
  const handleSubmit = async () => {
    if (!userId) {
      message.error('用户未登录，请重新登录');
      return;
    }
    try {
      // 获取表单值并格式化（匹配后端要求）
      const formValues = form.getFieldsValue();
      const answerList: AnswerItemDTO[] = Object.entries(formValues).map(([qId, value]) => {
        let answerContent = '';
        // 多选数组转逗号分隔字符串，单选/填空直接转字符串
        if (Array.isArray(value)) {
          answerContent = value.join(',');
        } else {
          answerContent = String(value).trim();
        }
        return {
          questionnaireId: Number(qId),
          answerContent
        };
      });
      // 构建提交DTO
      const submitDTO: QuestionnaireAnswerSubmitDTO = { userId, answerList };
      // 提交请求
      const res = await submitQuestionnaireAnswer(submitDTO);
      if (res.data.success) {
        message.success('问卷提交成功！');
        form.resetFields();
      } else {
        message.error(res.data.msg || '问卷提交失败');
      }
    } catch (err) {
      console.error('提交问卷失败：', err);
      message.error('问卷提交失败，请稍后重试');
    }
  };

  // 根据问题类型渲染对应的表单组件
  const renderQuestionItem = (item: QuestionnaireQuestionDTO) => {
    const { id, questionTitle, questionType, options } = item;
    const rules = [{ required: true, message: '请填写该问题答案' }];
    switch (questionType) {
      case 'single_choice':
        return (
          <Form.Item name={id} label={questionTitle} rules={rules} key={id}>
            <Radio.Group buttonStyle="solid">
              {options?.map(option => (
                <Radio value={option} key={option}>{option}</Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        );
      case 'multiple_choice':
        return (
          <Form.Item name={id} label={questionTitle} rules={rules} key={id}>
            <Checkbox.Group>
              <Space direction="vertical">
                {options?.map(option => (
                  <Checkbox value={option} key={option}>{option}</Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </Form.Item>
        );
      case 'fill_blank':
        return (
          <Form.Item name={id} label={questionTitle} rules={rules} key={id}>
            <Input.TextArea placeholder="请输入你的答案" autoSize={{ minRows: 2, maxRows: 4 }} />
          </Form.Item>
        );
      default:
        return <Text key={id}>未知问题类型</Text>;
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}>加载问卷中...</div>;
  if (questionList.length === 0) return <div style={{ textAlign: 'center', padding: 40 }}>暂无问卷题目</div>;

  return (
    <Card title={<Title level={4}>问卷填写</Title>} bordered={false} style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 16 }}
      >
        {questionList.map(item => renderQuestionItem(item))}
        <Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
          <Button type="primary" htmlType="submit" size="large">
            提交答案
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default QuestionnaireFill;