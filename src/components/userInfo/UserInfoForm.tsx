import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Form, Input, InputNumber, Button, Card, Typography, message, Space, Spin, Select } from 'antd';
import { SaveOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';
import { debounce } from 'lodash'; 
import type { DebouncedFunc } from 'lodash';
import { useUserStore } from '@/store/userStore';
import { getUserInfo, saveUserInfo } from '@/api/userInfoApi';
import type { UserInfoDTO } from '@/types/userInfo';
import { 
  PROVINCE_LIST, 
  SECOND_SUBJECT_OPTIONS,
  FIRST_SUBJECT_OPTIONS,
  SUBJECT_COMBINATION_LIST
} from '@/types/constants';

const { Title, Text } = Typography;
const { Option } = Select;
const DEBOUNCE_DELAY = 300;

interface UserInfoFormDTO extends UserInfoDTO {
  _secondSubjectArr?: string[];
}

const UserInfoForm = () => {
  const [form] = Form.useForm<UserInfoFormDTO>();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [firstSubject, setFirstSubject] = useState<string>('');
  const [editMode, setEditMode] = useState(false);
  
  const { user, userInfo: cachedUserInfo, updateUserInfo } = useUserStore();
  const userId = user?.id as number;
  const debouncedSaveRef = useRef<DebouncedFunc<(dto: UserInfoDTO) => Promise<void>> | null>(null);

  // ========== 1. 首选/再选科目联动 ==========
  const filteredSecondSubject = useMemo(() => {
    if (!firstSubject) return [];
    const validSecond = SUBJECT_COMBINATION_LIST
      .filter(item => item.firstSubject === firstSubject)
      .flatMap(item => item.secondSubject.split(','))
      .filter((v, i, arr) => arr.indexOf(v) === i);
    return SECOND_SUBJECT_OPTIONS.filter(item => validSecond.includes(item.value));
  }, [firstSubject]);

  // ========== 2. 缓存优先查询 ==========
  const fetchUserInfo = useCallback(async () => {
    if (!userId) {
      message.error('用户未登录，请重新登录');
      return;
    }

    if (cachedUserInfo) {
      const formVals: UserInfoFormDTO = { ...cachedUserInfo };
      if (cachedUserInfo.secondSubject) {
        formVals._secondSubjectArr = cachedUserInfo.secondSubject.split(',');
      }
      form.setFieldsValue(formVals);
      setFirstSubject(cachedUserInfo.firstSubject || '');
      return;
    }

    setLoading(true);
    try {
      const res = await getUserInfo(userId);
      const { data } = res;
      if (data.code === 200 && data.data) {
        const userInfo = data.data;
        const formVals: UserInfoFormDTO = { ...userInfo };
        if (userInfo.secondSubject) {
          formVals._secondSubjectArr = userInfo.secondSubject.split(',');
        }
        form.setFieldsValue(formVals);
        setFirstSubject(userInfo.firstSubject || '');
        updateUserInfo(userInfo);
      }
    } catch (err) {
      console.error('查询用户信息失败：', err);
      message.error('查询用户信息失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [form, userId, cachedUserInfo, updateUserInfo]);

  // ========== 3. 防抖函数 ==========
  const initDebouncedSave = useCallback(() => {
    const saveFn = async (userInfoDTO: UserInfoDTO) => {
      setSubmitLoading(true);
      try {
        const res = await saveUserInfo(userInfoDTO);
        if (res.data.success) {
          message.success('用户信息保存成功！');
          updateUserInfo(res.data.data);
          fetchUserInfo();
          setEditMode(false);
        } else {
          message.error(res.data.msg || '用户信息保存失败');
        }
      } catch (err) {
        console.error('保存用户信息失败：', err);
        message.error('用户信息保存失败，请检查输入内容');
      } finally {
        setSubmitLoading(false);
      }
    };
    debouncedSaveRef.current = debounce(saveFn, DEBOUNCE_DELAY);
  }, [fetchUserInfo, updateUserInfo]);

  // ========== 4. 生命周期 ==========
  useEffect(() => {
    fetchUserInfo();
    initDebouncedSave();
    return () => {
      debouncedSaveRef.current?.cancel();
    };
  }, [fetchUserInfo, initDebouncedSave]);

  // ========== 5. 提交处理 ==========
  const handleSave = async () => {
    if (!userId) {
      message.error('用户未登录，请重新登录');
      return;
    }
    try {
      const formValues = await form.validateFields();
      const userInfoDTO: UserInfoDTO = {
        sysUserId: userId,
        realName: formValues.realName,
        phone: formValues.phone,
        candidateProvince: formValues.candidateProvince,
        candidateYear: formValues.candidateYear,
        firstSubject: firstSubject,
        gaokaoTotalScore: formValues.gaokaoTotalScore,
        provinceRank: formValues.provinceRank,
        secondSubject: formValues._secondSubjectArr?.join(',') || ''
      };
      debouncedSaveRef.current?.(userInfoDTO);
    } catch (err) {
      console.error('表单校验失败：', err);
      message.error('表单校验失败，请检查输入内容');
    }
  };

  // ========== 6. 取消编辑 ==========
  const handleCancelEdit = () => {
    form.resetFields();
    setFirstSubject(cachedUserInfo?.firstSubject || '');
    setEditMode(false);
    message.info('已取消编辑，表单已重置');
  };

  // ========== 7. 首选科目变更 ==========
  const handleFirstSubjectChange = (value: string) => {
    setFirstSubject(value);
    form.setFieldsValue({ _secondSubjectArr: [] });
  };

  if (loading) return <Spin tip="加载用户信息中..." style={{ display: 'block', textAlign: 'center', padding: 40 }} />;

  return (
    <Card title={<Title level={4}>用户详细信息</Title>} bordered={false} style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Form组件：仅控制表单字段的禁用，按钮移出Form */}
      <Form
        form={form}
        layout="vertical"
        initialValues={{ sysUserId: userId, _secondSubjectArr: [] }}
        style={{ marginTop: 16, marginBottom: 24 }} // 增加底部间距，给按钮留位置
        disabled={!editMode}
      >
        {/* 隐藏字段：系统用户ID */}
        <Form.Item name="sysUserId" hidden>
          <Input />
        </Form.Item>

        {/* 真实姓名 */}
        <Form.Item
          name="realName"
          label="真实姓名"
          rules={[{ max: 50, message: '真实姓名长度不能超过50个字符' }]}
          extra={form.getFieldValue('realName') === '暂无信息' ? <Text type="secondary">暂无信息</Text> : null}
        >
          <Input placeholder="请输入真实姓名（可留空）" allowClear />
        </Form.Item>

        {/* 手机号 */}
        <Form.Item
          name="phone"
          label="手机号"
          rules={[
            { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
            { max: 11, message: '手机号长度不能超过11位' }
          ]}
          extra={form.getFieldValue('phone') === '暂无信息' ? <Text type="secondary">暂无信息</Text> : null}
        >
          <Input placeholder="请输入手机号（可留空）" allowClear />
        </Form.Item>

        {/* 考生省份 */}
        <Form.Item
          name="candidateProvince"
          label="考生省份"
          rules={[{ max: 20, message: '省份名称长度不能超过20个字符' }]}
          extra={form.getFieldValue('candidateProvince') === '暂无信息' ? <Text type="secondary">暂无信息</Text> : null}
        >
          <Select
            placeholder="请选择考生省份"
            allowClear
            style={{ width: '100%' }}
          >
            {PROVINCE_LIST.map(prov => (
              <Option value={prov.provinceName} key={prov.provinceCode}>
                {prov.provinceName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* 考生年份 */}
        <Form.Item
          name="candidateYear"
          label="考生年份"
          rules={[{ type: 'integer', message: '考生年份必须为整数' }]}
          extra={form.getFieldValue('candidateYear') === '暂无信息' ? <Text type="secondary">暂无信息</Text> : null}
        >
          <InputNumber
            placeholder="请输入考生年份（如：2025）"
            style={{ width: '100%' }}
            min={2000}
            max={2100}
          />
        </Form.Item>

        {/* 首选科目 */}
        <Form.Item
          name="firstSubject"
          label="首选科目"
          rules={[{ max: 10, message: '首选科目长度不能超过10个字符' }]}
          extra={form.getFieldValue('firstSubject') === '暂无信息' ? <Text type="secondary">暂无信息</Text> : null}
        >
          <Select
            placeholder="请选择首选科目"
            allowClear
            style={{ width: '100%' }}
            value={firstSubject}
            onChange={handleFirstSubjectChange}
          >
            {FIRST_SUBJECT_OPTIONS.map(item => (
              <Option value={item.value} key={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* 再选科目 */}
        <Form.Item
          name="_secondSubjectArr"
          label="再选科目"
          extra={form.getFieldValue('secondSubject') === '暂无信息' ? <Text type="secondary">暂无信息</Text> : null}
        >
          <Select
            placeholder="请选择再选科目（可多选）"
            allowClear
            mode="multiple"
            style={{ width: '100%' }}
            options={filteredSecondSubject}
            disabled={!firstSubject || !editMode}
          />
        </Form.Item>

        {/* 高考总分 */}
        <Form.Item
          name="gaokaoTotalScore"
          label="高考总分"
          rules={[{ type: 'integer', message: '高考总分必须为整数' }]}
          extra={form.getFieldValue('gaokaoTotalScore') === '暂无信息' ? <Text type="secondary">暂无信息</Text> : null}
        >
          <InputNumber
            placeholder="请输入高考总分"
            style={{ width: '100%' }}
            min={0}
            max={750}
          />
        </Form.Item>

        {/* 全省排名 */}
        <Form.Item
          name="provinceRank"
          label="全省排名"
          rules={[{ type: 'integer', message: '全省排名必须为非负整数' }]}
          extra={form.getFieldValue('provinceRank') === '暂无信息' ? <Text type="secondary">暂无信息</Text> : null}
        >
          <InputNumber
            placeholder="请输入全省排名"
            style={{ width: '100%' }}
            min={0}
          />
        </Form.Item>
      </Form>

      {/* 操作按钮：移出Form外部，避免继承disabled状态 */}
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Space size="middle">
          {!editMode ? (
            // 查看态：编辑按钮（可正常点击）
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setEditMode(true)}
              size="large"
            >
              编辑信息
            </Button>
          ) : (
            // 编辑态：保存+取消按钮
            <>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                loading={submitLoading}
                size="large"
              >
                保存信息
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={handleCancelEdit}
                size="large"
              >
                取消编辑
              </Button>
            </>
          )}
        </Space>
      </div>
    </Card>
  );
};

export default UserInfoForm;