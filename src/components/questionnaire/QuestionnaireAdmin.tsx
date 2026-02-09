import { useState, useEffect, useCallback } from 'react';
import { Form, Input, Select, InputNumber, Button, Table, message, Modal, Card, Typography, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getQuestionnaireList, addQuestionnaire, updateQuestionnaire, deleteQuestionnaire } from '@/api/questionnaireApi';
import type { QuestionnaireQuestionDTO, QuestionnaireAddDTO, QuestionnaireUpdateDTO } from '@/types/questionnaire';
import { QuestionType, QuestionTypeCN } from '@/types/questionnaire';

const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const QuestionnaireAdmin = () => {
  const [form] = Form.useForm<QuestionnaireAddDTO & { id?: number }>();
  const [questionList, setQuestionList] = useState<QuestionnaireQuestionDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null); // 编辑的问题ID

  // 获取问卷列表（用于管理展示）
  const fetchQuestionList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getQuestionnaireList();
      const { data } = res;
      if (data.code === 200 && data.data) {
        setQuestionList(data.data);
      }
    } catch (err) {
      console.error('获取问卷管理列表失败：', err);
      message.error('获取列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestionList();
  }, [fetchQuestionList]);

  // 新增/编辑提交
  const handleSave = async () => {
    try {
      const formValues = await form.validateFields();
      // 编辑模式
      if (editId) {
        const updateDTO: QuestionnaireUpdateDTO = {
          id: editId,
          questionTitle: formValues.questionTitle,
          questionType: formValues.questionType,
          options: formValues.options,
          sort: formValues.sort
        };
        const res = await updateQuestionnaire(updateDTO);
        if (res.data.success) {
          message.success('问卷题目修改成功');
          handleReset();
        } else {
          message.error(res.data.msg || '修改失败');
        }
      } else {
        // 新增模式
        const addDTO: QuestionnaireAddDTO = {
          questionTitle: formValues.questionTitle,
          questionType: formValues.questionType,
          options: formValues.options,
          sort: formValues.sort
        };
        const res = await addQuestionnaire(addDTO);
        if (res.data.success) {
          message.success('问卷题目新增成功');
          handleReset();
        } else {
          message.error(res.data.msg || '新增失败');
        }
      }
      fetchQuestionList(); // 刷新列表
    } catch (err) {
      console.error('保存问卷题目失败：', err);
    }
  };

  // 重置表单+编辑状态
  const handleReset = () => {
    form.resetFields();
    setEditId(null);
  };

  // 编辑回显
  const handleEdit = (record: QuestionnaireQuestionDTO) => {
    setEditId(record.id as number);
    form.setFieldsValue({
      questionTitle: record.questionTitle,
      questionType: record.questionType,
      options: record.options?.join(','),
      sort: record.sort
    });
  };

  // 删除确认
  const handleDelete = (id: number) => {
    confirm({
      title: '确认删除',
      content: '你确定要删除该问卷题目吗？删除后不可恢复',
      onOk: async () => {
        const res = await deleteQuestionnaire(id);
        if (res.data.success) {
          message.success('删除成功');
          fetchQuestionList();
        } else {
          message.error(res.data.msg || '删除失败');
        }
      }
    });
  };

  // 表格列定义
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '问题标题', dataIndex: 'questionTitle', key: 'questionTitle' },
    { title: '问题类型', dataIndex: 'questionTypeName', key: 'questionTypeName', width: 100 },
    { title: '选项', dataIndex: 'options', key: 'options', render: (v: string[]) => v?.join('，') || '无' },
    { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
    {
      title: '操作',
      key: 'action',
      width: 120,
       render: (_: React.ReactNode, record: QuestionnaireQuestionDTO) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id as number)}>删除</Button>
        </Space>
      )
    }
  ];

  return (
    <Card title={<Title level={4}>问卷管理（管理员专属）</Title>} bordered={false} style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* 新增/编辑表单 */}
      <Form
        form={form}
        layout="inline"
        style={{ marginBottom: 24, flexWrap: 'wrap' }}
        initialValues={{ questionType: QuestionType.SINGLE_CHOICE }}
      >
        <Form.Item
          name="questionTitle"
          label="问题标题"
          rules={[
            { required: true, message: '请输入问题标题' },
            { max: 100, message: '标题长度不能超过100个字符' }
          ]}
        >
          <Input placeholder="请输入问题标题" style={{ width: 300 }} />
        </Form.Item>
        <Form.Item name="questionType" label="问题类型" rules={[{ required: true, message: '请选择问题类型' }]}>
          <Select placeholder="请选择问题类型" style={{ width: 150 }}>
            {Object.entries(QuestionTypeCN).map(([code, name]) => (
              <Option value={code} key={code}>{name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="options"
          label="选项"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                const type = getFieldValue('questionType');
                // 单选/多选必须填选项，填空不能填选项
                if ((type === QuestionType.SINGLE_CHOICE || type === QuestionType.MULTIPLE_CHOICE) && !value) {
                  return Promise.reject(new Error('单选/多选问题必须填写选项（逗号分隔）'));
                }
                if (type === QuestionType.FILL_BLANK && value) {
                  return Promise.reject(new Error('填空问题无需填写选项'));
                }
                return Promise.resolve();
              }
            })
          ]}
        >
          <Input placeholder="单选/多选用逗号分隔，如：选项1,选项2" style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
            name="sort"
            label="排序"
            rules={[
                { required: true, message: '请输入排序值' },
                { type: 'number', min: 0, message: '排序值必须为非负数' }
            ]}
            >
            <InputNumber placeholder="排序值" style={{ width: 100 }} min={0} />
        </Form.Item>
        <Form.Item>
          <Space size="small">
            <Button type="primary" onClick={handleSave} icon={<PlusOutlined />}>
              {editId ? '保存修改' : '新增题目'}
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>
      {/* 问卷题目表格 */}
      <Table
        columns={columns}
        dataSource={questionList}
        rowKey="id"
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default QuestionnaireAdmin;