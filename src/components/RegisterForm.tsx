import { useState } from 'react';
import { Button, Form, Input, message, Typography, Select } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { mockUsers } from '../utils/mockData';
import { User } from '../types';

const { Title } = Typography;
const { Option } = Select;

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const register = useUserStore((state) => state.register);
  const navigate = useNavigate();

  // 表单提交
  const handleSubmit = async (values: {
    username: string;
    password: string;
    confirmPwd: string;
    role: 'user' | 'admin';
  }) => {
    setLoading(true);
    try {
      // 前端校验
      if (values.password !== values.confirmPwd) {
        message.error('两次密码不一致！');
        return;
      }
      if (mockUsers.some((user) => user.username === values.username)) {
        message.error('账号已存在！');
        return;
      }

      // 模拟注册（实际替换为axios请求）
      const newUser: User = {
        id: Date.now().toString(),
        username: values.username,
        password: values.password,
        role: values.role,
      };
      register(newUser);
      message.success('注册成功，请登录！');
      navigate('/login'); // 跳登录页
    } catch (error) {
      message.error('注册失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 24 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        账号注册
      </Title>
      <Form
        name="registerForm"
        onFinish={handleSubmit}
        autoComplete="off"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Form.Item
          name="username"
          label="账号"
          rules={[{ required: true, message: '请输入账号！' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="请输入账号" />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码！' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
        </Form.Item>

        <Form.Item
          name="confirmPwd"
          label="确认密码"
          rules={[{ required: true, message: '请确认密码！' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="请确认密码" />
        </Form.Item>

        <Form.Item
          name="role"
          label="身份"
          rules={[{ required: true, message: '请选择身份！' }]}
        >
          <Select placeholder="请选择身份">
            <Option value="user">普通用户</Option>
            <Option value="admin">管理员</Option>
          </Select>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Button type="primary" htmlType="submit" loading={loading} block>
            注册
          </Button>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link to="/login">已有账号？立即登录</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterForm;