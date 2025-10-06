import React from 'react';
import { Layout, Typography, Button } from 'antd';
import { LogoutOutlined, HeartFilled, SmileOutlined } from '@ant-design/icons';
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
      <Layout.Footer style={{ textAlign: 'center', backgroundColor: '#f0f2f5', borderTop: '1px solid #e8e8e8', padding: '12px 0' }}>
        <Typography.Text type="secondary">
          Made with <HeartFilled style={{ color: '#eb2f96' }} /> fun by Jijish <SmileOutlined />
        </Typography.Text>
      </Layout.Footer>
    </Layout>
  );
};

export default MainLayout;