import { useState } from 'react'
import { Layout, Button, Space, Typography, Divider, message } from 'antd'
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import CollegeTable from '@/components/CollegeTable'
import MajorTable from '@/components/MajorTable'
import { useUserStore } from '@/store/userStore'
import { useNavigate } from 'react-router-dom'
import { logout } from '@/api/authApi'
import type { Result } from '@/types/api'

const { Header, Content, Footer } = Layout
const { Title, Text } = Typography

const Main = () => {
  const [activeTab, setActiveTab] = useState<'college' | 'major'>('college')
  // ========== 获取用户信息+管理员判断 ==========
  const { user, logout: logoutStore, isAdmin } = useUserStore()
  const navigate = useNavigate()

  // 退出登录（无修改）
  const handleLogout = async () => {
    try {
      const response = await logout()
      const result: Result<string> = response.data
      
      if (result.success && result.code === 200) {
        logoutStore()
        localStorage.removeItem('token')
        message.success(result.msg || '退出成功！')
        navigate('/login')
      } else {
        message.error(result.msg || '退出失败')
      }
    } catch (err) {
      console.error('退出失败：', err)
      message.error('退出失败，请稍后重试')
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 头部：添加角色显示+管理员功能显隐 */}
      <Header style={{ backgroundColor: 'white', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>
          高考志愿智能分析预测系统
        </Title>
        <Space>
          <Text>当前登录：{user?.nickname || user?.username}（{user?.roles[0] || '普通用户'}）</Text>
          {/* ========== 权限控制：管理员专属功能（单角色场景始终隐藏） ========== */}
          {isAdmin && (
            <Button type="text" icon={<SettingOutlined />}>
              系统管理
            </Button>
          )}
          <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
            退出登录
          </Button>
        </Space>
      </Header>
      {/* 内容区：可根据角色显隐表格/功能 */}
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
          {/* 表格区域：可根据角色控制是否显示 */}
          {activeTab === 'college' ? <CollegeTable /> : <MajorTable />}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        高考志愿智能分析预测系统 ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  )
}
export default Main