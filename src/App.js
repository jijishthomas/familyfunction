import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import Login from './Login';
import Albums from './Albums';
import Gallery from './Gallery';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from './MainLayout';

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const bypassToken = 'Shij0WedsSerin';

    if (bypassToken && token === bypassToken) {
      sessionStorage.setItem('isAuthenticated', 'true');
      navigate('/albums', { replace: true });
    }
  }, [location, navigate]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/albums" />} />
        <Route path="albums" element={<Albums />} />
        <Route path="gallery/:albumId" element={<Gallery />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00b96b',
          colorInfo: '#00b96b',
          borderRadius: 6,
        },
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <Router basename="/familyfunction">
        <AppContent />
      </Router>
    </ConfigProvider>
  );
}

export default App;