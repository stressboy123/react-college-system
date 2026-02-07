import RegisterForm from '../components/RegisterForm';
import { Layout } from 'antd';

const { Content } = Layout;

const Register = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
        <div style={{ backgroundColor: 'white', borderRadius: 8, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.1)' }}>
          <RegisterForm />
        </div>
      </Content>
    </Layout>
  );
};

export default Register;