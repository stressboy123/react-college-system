import { useState } from 'react'
import { Layout, Button, Space, Typography, Divider, message } from 'antd'
import { LogoutOutlined, QuestionOutlined, FileTextOutlined, SettingOutlined, UserOutlined, LineChartOutlined } from '@ant-design/icons'
import { useUserStore } from '@/store/userStore'
import { useNavigate } from 'react-router-dom'
import { logout } from '@/api/authApi'
import type { Result } from '@/types/api'
import type { UserInfoDTO } from '@/types/userInfo'
import { getUserInfoField } from '@/types/userInfo';
import CollegeTable from '@/components/CollegeTable'
import MajorTable from '@/components/MajorTable'
import QuestionnaireFill from '@/components/questionnaire/QuestionnaireFill'
import QuestionnaireMyAnswer from '@/components/questionnaire/QuestionnaireMyAnswer'
import QuestionnaireAdmin from '@/components/questionnaire/QuestionnaireAdmin'
import UserInfoForm from '@/components/userInfo/UserInfoForm'
import PredictResult from '@/components/predict/PredictResult'

const { Header, Content, Footer } = Layout
const { Title, Text } = Typography

const Main = () => {
  // 切换当前展示的功能模块：fill(填写问卷) / myAnswer(我的答卷) / admin(问卷管理) / college(查大学) / major(查专业) / userInfo（用户信息）/ predict（志愿预测）
  const [activeModule, setActiveModule] = useState<'fill' | 'myAnswer' | 'admin' | 'college' | 'major' | 'userInfo' | 'predict'>('college')
  const { user, logout: logoutStore, isAdmin, userInfo } = useUserStore()
  const navigate = useNavigate()

  // 退出登录
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

  // 校验用户信息是否完善（预测功能前置条件）
  const checkUserInfoComplete = (): boolean => {
    if (!userInfo) {
      message.warning('请先完善用户基本信息！', 2)
      setActiveModule('userInfo')
      return false
    }

    // 核心必填项（用keyof UserInfoDTO确保类型安全）
    const requiredFields: Array<{ key: keyof UserInfoDTO; label: string }> = [
      { key: 'realName', label: '真实姓名' },
      { key: 'candidateProvince', label: '考生省份' },
      { key: 'candidateYear', label: '考生年份' },
      { key: 'gaokaoTotalScore', label: '高考总分' },
      { key: 'provinceRank', label: '全省排名' },
      { key: 'firstSubject', label: '首选科目' }
    ]

    // 修复：用工具函数获取字段值，避免索引签名
    const emptyFields = requiredFields.filter(item => {
      const value = getUserInfoField(userInfo, item.key);
      return value === undefined || value === '' || value === null;
    })

    if (emptyFields.length > 0) {
      message.warning(`请完善以下必填信息：${emptyFields.map(item => item.label).join('、')}`, 3)
      setActiveModule('userInfo')
      return false
    }
    return true
  }

  // 切换到预测模块（带前置校验）
  const handleSwitchToPredict = () => {
    if (checkUserInfoComplete()) {
      setActiveModule('predict')
    }
  }

  // 渲染当前激活的模块
  const renderActiveModule = () => {
    switch (activeModule) {
      case 'userInfo': return <UserInfoForm />;
      case 'fill': return <QuestionnaireFill />;
      case 'myAnswer': return <QuestionnaireMyAnswer />;
      case 'admin': return <QuestionnaireAdmin />;
      case 'college': return <CollegeTable />;
      case 'major': return <MajorTable />;
      case 'predict': return <PredictResult userInfo={userInfo} />;
      default: return <CollegeTable />;
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 头部：用户信息+退出+角色权限控制 */}
      <Header style={{ backgroundColor: 'white', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>
          高考志愿智能分析预测系统
        </Title>
        <Space>
          <Text>当前登录：{user?.nickname || user?.username}（{user?.roles.join('/') || '普通用户'}）</Text>
          {/* 用户信息按钮（所有用户可见） */}
          <Button type="text" icon={<UserOutlined />} onClick={() => setActiveModule('userInfo')}>
            用户信息
          </Button>
          {/* 管理员专属：问卷管理入口 */}
          {isAdmin && (
            <Button type="text" icon={<SettingOutlined />} onClick={() => setActiveModule('admin')}>
              问卷管理
            </Button>
          )}
          {/* 所有用户：问卷填写+我的答卷 */}
          <Button type="text" icon={<QuestionOutlined />} onClick={() => setActiveModule('fill')}>
            问卷填写
          </Button>
          <Button type="text" icon={<FileTextOutlined />} onClick={() => setActiveModule('myAnswer')}>
            我的答卷
          </Button>
          <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
            退出登录
          </Button>
        </Space>
      </Header>
      {/* 内容区：功能按钮+模块渲染 */}
      <Content style={{ padding: '24px', backgroundColor: '#f5f5f5' }}>
        <div style={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          backgroundColor: 'white', 
          padding: 24, 
          borderRadius: 8,
          marginTop: 20 
        }}>
          {/* 原有院校/专业查询切换按钮 */}
          <Space style={{ marginBottom: 24 }}>
            <Button
              type={activeModule === 'college' ? 'primary' : 'default'}
              onClick={() => setActiveModule('college')}
              size="middle"
            >
              查大学
            </Button>
            <Button
              type={activeModule === 'major' ? 'primary' : 'default'}
              onClick={() => setActiveModule('major')}
              size="middle"
            >
              查专业
            </Button>
            <Button
              type={activeModule === 'predict' ? 'primary' : 'default'}
              onClick={handleSwitchToPredict}
              size="middle"
              icon={<LineChartOutlined />}
            >
              志愿预测
            </Button>
          </Space>
          <Divider />
          {/* 渲染当前激活的功能模块 */}
          {renderActiveModule()}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        高考志愿智能分析预测系统 ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  )
}

export default Main