import { useState } from 'react'
import { Button, Form, Input, message, Typography } from 'antd'
import { UserOutlined, LockOutlined, UserAddOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '@/api/authApi'
import type { RegisterDTO, Result } from '@/types/api'

const { Title } = Typography

const RegisterForm = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // 表单提交
  const handleSubmit = async (values: {
    username: string
    password: string
    confirmPwd: string
    nickname?: string
  }) => {
    setLoading(true)
    try {
      // 前端校验
      if (values.password !== values.confirmPwd) {
        message.error('两次密码不一致！')
        return
      }
      if (values.username.length < 3 || values.username.length > 50) {
        message.error('用户名长度需在3-50之间！')
        return
      }
      if (values.password.length < 6 || values.password.length > 20) {
        message.error('密码长度需在6-20之间！')
        return
      }

      // 构造注册参数（匹配后端RegisterDTO）
      const registerData: RegisterDTO = {
        username: values.username,
        password: values.password,
        nickname: values.nickname
      }

      const response = await register(registerData)
      const result: Result<string> = response.data
      
      if (result.success && result.code === 200) {
        message.success(result.msg || '注册成功，请登录！')
        navigate('/login') // 跳登录页
      } else {
        message.error(result.msg || '注册失败')
      }
    } catch (err) {
      console.error('注册失败：', err)
      message.error('注册失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

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
          <Input prefix={<UserOutlined />} placeholder="请输入账号（3-50位）" />
        </Form.Item>

        <Form.Item
          name="nickname"
          label="昵称"
          rules={[{ required: false }]} // 后端nickname非必填
        >
          <Input prefix={<UserAddOutlined />} placeholder="请输入昵称（选填）" />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码！' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="请输入密码（6-20位）" />
        </Form.Item>

        <Form.Item
          name="confirmPwd"
          label="确认密码"
          rules={[{ required: true, message: '请确认密码！' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="请确认密码" />
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
  )
}

export default RegisterForm