import { useState } from 'react'
import { Layout, Button, Space, Typography, Divider, message } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import CollegeTable from '@/components/CollegeTable'
import MajorTable from '@/components/MajorTable'
import { useUserStore } from '@/store/userStore'
import { useNavigate } from 'react-router-dom'
import { logout } from '@/api/authApi'

const { Header, Content, Footer } = Layout
const { Title, Text } = Typography

const Main = () => {
  const [activeTab, setActiveTab] = useState<'college' | 'major'>('college')
  const { user, logout: logoutStore } = useUserStore()
  const navigate = useNavigate()

  // 退出登录
  const handleLogout = async () => {
    try {
      await logout()
      logoutStore()
      localStorage.removeItem('token')
      message.success('退出成功！')
      navigate('/login')
    } catch (err) {
      console.error('退出失败：', err)
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 头部 */}
      <Header style={{ backgroundColor: 'white', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>
          院校专业查询系统
        </Title>
        <Space>
          <Text>当前登录：{user?.username}（{user?.role === 'admin' ? '管理员' : '普通用户'}）</Text>
          <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
            退出登录
          </Button>
        </Space>
      </Header>

      {/* 内容区 */}
      <Content style={{ padding: '24px', backgroundColor: '#f5f5f5' }}>
        <div style={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          backgroundColor: 'white', 
          padding: 24, 
          borderRadius: 8,
          marginTop: 40 
        }}>
          {/* 切换按钮 */}
          <Space style={{ marginBottom: 24 }}>
            <Button
              type={activeTab === 'college' ? 'primary' : 'default'}
              onClick={() => setActiveTab('college')}
              size="large"
            >
              查大学
            </Button>
            <Button
              type={activeTab === 'major' ? 'primary' : 'default'}
              onClick={() => setActiveTab('major')}
              size="large"
            >
              查专业
            </Button>
          </Space>

          <Divider />

          {/* 表格区域 */}
          {activeTab === 'college' ? <CollegeTable /> : <MajorTable />}
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        院校专业查询系统 ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  )
}

export default Main