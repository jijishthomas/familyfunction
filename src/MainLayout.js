import React from 'react';
import { Layout, Typography, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title } = Typography;

const MainLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <Title onClick={()=> navigate('/')} level={3} style={{ color: '#003a8c', margin: 0, cursor: 'pointer' }}>
          Shijo & Serin's Wedding
        </Title>
        <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Button>
      </Header>
      <Content style={{ padding: '0 24px' }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default MainLayout;