import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import Login from './Login';
import Albums from './Albums';
import Gallery from './Gallery';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from './MainLayout';

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
      <Router>
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
      </Router>
    </ConfigProvider>
  );
}

export default App;