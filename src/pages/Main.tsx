import { useState } from 'react';
import { Layout, Button, Space, Typography, Divider } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import CollegeTable from '../components/CollegeTable';
import MajorTable from '../components/MajorTable';
import { useUserStore } from '../store/userStore';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const Main = () => {
  const [activeTab, setActiveTab] = useState<'college' | 'major'>('college'); // 切换查大学/专业
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  // 退出登录
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 头部：用户信息 + 退出 */}
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

      {/* 内容区：切换按钮 + 表格 */}
      <Content style={{ padding: '24px', backgroundColor: '#f5f5f5' }}>
        <div style={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          backgroundColor: 'white', 
          padding: 24, 
          borderRadius: 8,
          marginTop: 40 // 屏幕中间偏上，不置顶
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
  );
};

export default Main;