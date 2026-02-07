import { useState } from 'react'
import { Button, Form, Input, message, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import { login } from '@/api/authApi'
import type { LoginDTO, LoginResponse, Result } from '@/types/api'

const { Title, Text } = Typography

const LoginForm = () => {
  const [loading, setLoading] = useState(false)
  const loginStore = useUserStore((state) => state.login)
  const navigate = useNavigate()

  const handleSubmit = async (values: LoginDTO) => {
    setLoading(true)
    try {
      const response = await login(values)
      const result: Result<LoginResponse> = response.data 
      
      if (result.code === 200) {
        loginStore(result.data)
        localStorage.setItem('token', result.data.token)
        message.success('登录成功！')
        navigate('/')
      }
    } catch (err) {
      console.error('登录失败：', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 24 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        系统登录
      </Title>
      <Form
        name="loginForm"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入账号！' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="请输入账号" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码！' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            登录
          </Button>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Text>没有账号？</Text>
            <Link to="/register" style={{ marginLeft: 8 }}>
              立即注册
            </Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

export default LoginForm