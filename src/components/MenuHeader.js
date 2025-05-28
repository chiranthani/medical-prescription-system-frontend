import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Badge, message } from 'antd';
import { isAuthenticated, fetchUserType } from '../utils/auth';
import api from '../utils/api';

const { Header } = Layout;

const MenuHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  useEffect(() => {
    setUserType(localStorage.getItem('userType'));
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem('auth_token');
      setIsLoggedIn(false);
      console.log('logged out');
    } else {
      navigate('/login');
    }
  };

  const handleMenuClick = async ({ key }) => {

    // const type = await fetchUserType();
    setUserType(userType);

    if (key == 'logout') {
      localStorage.removeItem('auth_token');
      setUserType(null);
      // message.success('Logged out successfully');
      navigate('/');
      return;
    }

    const routes = {
      home: '/',
      prescription: '/prescriptions',
      quotation: '/quotations',
      login: '/login',
      register: '/register',
      notifications: '/notifications'
    };

    if (routes[key]) {
      navigate(routes[key]);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    // const fetchNotifications = async () => {
    //   try {
    //     const res = await api.get('/api/notifications/unread-count');
    //     const data = await res.json();
    //     setNotificationsCount(data.count || 0);
    //   } catch (err) {
    //     console.error('Failed to fetch notifications');
    //   }
    // };

    // fetchNotifications();
    // const interval = setInterval(fetchNotifications, 60000);
    // return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleRegisterClick = () => {
    navigate('/register');
  };
  return (
    <Header
      style={{
        backgroundColor: '#001529',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
      }}
    >
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['home']}
        style={{ flex: 1, backgroundColor: 'transparent' }}
        onClick={handleMenuClick}
      >
        <Menu.Item key="home">Home</Menu.Item>
        {userType == 'user' && (
          <>
            <Menu.Item key="prescription">Prescription</Menu.Item>
          </>
        )}
         {userType == 'pharmacy' && (
          <>
            <Menu.Item key="quotation">Quotation</Menu.Item>
            <Menu.Item key="notifications">
              <Badge count={notificationsCount} offset={[10, 0]}>
                Notifications
              </Badge>
            </Menu.Item>
          </>
        )}
      </Menu>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
        {!isLoggedIn ? (
          <>
            <Button type="primary" onClick={handleAuthClick}>
              Login
            </Button>
            <Button onClick={handleRegisterClick}>Register</Button>
          </>
        ) : (
          <Button type="primary" onClick={handleAuthClick}>
            Logout
          </Button>
        )}
      </div>
    </Header>
  );
};

export default MenuHeader;
